// Vercel Routing Middleware: passcode gate for private client onboarding pages at /start/<slug>/.
// The repo is public, so passcodes live only in Vercel env vars:
//   ONBOARDING_CODES  = {"collision-masters":"K7MX-4QPA", ...}
//   ONBOARDING_SECRET = long random string used to sign the access cookie
// Any slug without a code, or a missing env var, stays locked (fails closed).
import { next } from '@vercel/functions';
// Share-preview fields per client. Generated from src/data/onboarding.ts by
// scripts/make-onboarding-og.mjs (Vercel's middleware bundler can't import the .ts file).
// BEGIN onboardingShare
const onboardingShare = {
  "collision-masters": {
    "contactFirst": "Cruz",
    "clientName": "Collision Masters"
  },
  "vaultx": {
    "contactFirst": "Carlton",
    "clientName": "VaultX"
  },
  "demo": {
    "contactFirst": "Maria",
    "clientName": "Valley Demo Auto Body"
  }
};
// END onboardingShare

export const config = { matcher: '/start/:path*' };

const COOKIE_DAYS = 90;
const enc = new TextEncoder();
const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);

const normalize = (code) => String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

async function sign(secret, value) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  const match = header.split(/;\s*/).find((c) => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : '';
}

// Link-preview tags so a texted link unfurls as "Welcome to RankRGV, <name>" with that client's image
// (built by scripts/make-onboarding-og.mjs). Previews only ever see this page, never the wizard.
function shareMeta(origin, slug) {
  const c = Object.hasOwn(onboardingShare, slug) ? { slug, ...onboardingShare[slug] } : null;
  if (!c) return { title: 'RankRGV · Client access', tags: '' };
  const title = `Welcome to RankRGV, ${c.contactFirst}`;
  const desc = `Your private onboarding for ${c.clientName}. It takes about three minutes.`;
  const img = `${origin}/images/og/onboarding/${c.slug}.png`;
  return {
    title,
    first: c.contactFirst,
    clientName: c.clientName,
    tags: `<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="RankRGV">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${origin}/start/${c.slug}/">
<meta property="og:image" content="${img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${img}">`,
  };
}

function page(status, body, meta = { title: 'RankRGV · Client access', tags: '' }) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${esc(meta.title)}</title>
${meta.tags}
<style>
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8f9fc;font-family:Inter,system-ui,-apple-system,sans-serif;color:#0f172a;padding:16px}
  .card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:32px 28px;width:100%;max-width:380px;box-shadow:0 1px 3px rgba(15,23,42,.06)}
  img{height:26px;margin-bottom:24px}h1{font-size:22px;margin:0 0 8px}p{color:#64748b;font-size:15px;line-height:1.5;margin:0 0 20px}
  label{display:block;font-weight:600;font-size:14px;margin-bottom:8px}
  input{width:100%;font:inherit;font-size:18px;letter-spacing:.12em;text-transform:uppercase;padding:12px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8f9fc}
  input:focus{outline:2px solid #1d4ed8;border-color:transparent}
  button{margin-top:16px;width:100%;font:inherit;font-weight:600;color:#fff;background:#1d4ed8;border:0;border-radius:10px;padding:13px;cursor:pointer}
  .err{color:#dc2626;font-size:14px;margin:12px 0 0}.help{font-size:13px;margin:20px 0 0}
</style></head><body><main class="card">
<img src="/images/RankRGV_compact_logo.png" alt="RankRGV">${body}
<p class="help">No code? Text Eddie at 956-391-5991.</p></main></body></html>`;
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' },
  });
}

function loginPage(meta, error) {
  const heading = meta.first ? `Welcome to RankRGV, ${esc(meta.first)}` : 'Welcome to RankRGV';
  const forWho = meta.clientName ? ` for ${esc(meta.clientName)}` : '';
  // 200, not 401: iMessage and other link previewers skip non-200 pages.
  return page(error ? 401 : 200, `<h1>${heading}</h1><p>Enter the passcode Eddie sent you to open your onboarding${forWho}.</p>
<form method="POST"><label for="code">Passcode</label>
<input id="code" name="code" autocomplete="one-time-code" autocapitalize="characters" required autofocus>
${error ? `<p class="err" role="alert">${error}</p>` : ''}<button type="submit">Continue</button></form>`, meta);
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const slug = (url.pathname.split('/')[2] || '').toLowerCase();
  if (!slug) return next();

  let codes;
  try { codes = JSON.parse(process.env.ONBOARDING_CODES || '{}'); } catch { codes = {}; }
  const secret = process.env.ONBOARDING_SECRET || '';
  const code = normalize(codes[slug]);
  if (!secret || !code) return page(404, '<h1>Page not available</h1><p>This link isn\'t active.</p>');

  const meta = shareMeta(url.origin, slug);
  const cookieName = `rgv_start_${slug.replace(/[^a-z0-9-]/g, '')}`;
  const expected = await sign(secret, `${slug}:${code}`);

  if (request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const given = normalize(form?.get('code'));
    const ok = safeEqual(await sign(secret, `${slug}:${given}`), expected);
    if (!ok) {
      await new Promise((r) => setTimeout(r, 600));
      return loginPage(meta, "That code didn't match. Check the text from Eddie and try again.");
    }
    return new Response(null, {
      status: 303,
      headers: {
        location: `/start/${slug}/`,
        'set-cookie': `${cookieName}=${expected}; Path=/start/; Max-Age=${COOKIE_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`,
        'cache-control': 'no-store',
      },
    });
  }

  if (safeEqual(readCookie(request, cookieName), expected)) {
    return next({ headers: { 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'private, no-store' } });
  }
  return loginPage(meta);
}
