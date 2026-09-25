// Builds the 1200x630 link-preview image for each onboarding client:
//   public/images/og/onboarding/<slug>.png
// Run after adding a client to src/data/onboarding.ts:
//   node --experimental-strip-types scripts/make-onboarding-og.mjs
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { onboardingClients } = await import(pathToFileURL(path.join(root, 'src/data/onboarding.ts')).href);
const outDir = path.join(root, 'public/images/og/onboarding');
mkdirSync(outDir, { recursive: true });

const dataUri = (file, type) => `data:${type};base64,${readFileSync(path.join(root, file)).toString('base64')}`;
const font = dataUri('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'font/woff2');
const headshot = dataUri('public/images/eddie-urbano.png', 'image/png');
const esc = (s) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);

const html = (c) => `<!doctype html><html><head><style>
  @font-face { font-family: Inter; src: url(${font}) format('woff2'); font-weight: 100 900; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: Inter, sans-serif; color: #fff;
    background: radial-gradient(700px 420px at 18% 30%, rgba(29,78,216,.28), transparent 70%), #0f172a; position: relative; }
  body::before { content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(rgba(148,163,184,.12) 1px, transparent 1px); background-size: 28px 28px; }
  .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: linear-gradient(90deg, #1d4ed8, #3b82f6 55%, #d97706); }
  .left { position: absolute; left: 72px; top: 64px; width: 600px; }
  .pill { display: inline-flex; align-items: center; gap: 12px; padding: 10px 20px; border-radius: 999px;
    background: rgba(29,78,216,.18); border: 1px solid rgba(59,130,246,.35); font-size: 22px; font-weight: 600; color: #cbd5e1; }
  .pill i { width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; }
  .hello { margin-top: 44px; font-size: 50px; font-weight: 700; letter-spacing: -.01em; color: #e2e8f0; }
  .hello b { background: linear-gradient(90deg, #60a5fa, #93c5fd); -webkit-background-clip: text; color: transparent; font-weight: 800; }
  .name { font-size: 118px; font-weight: 800; letter-spacing: -.035em; line-height: 1.02; margin-top: 4px; }
  .sub { margin-top: 22px; font-size: 28px; color: #94a3b8; line-height: 1.4; }
  .from { position: absolute; left: 72px; bottom: 58px; display: flex; align-items: center; gap: 18px; }
  .from img { width: 68px; height: 68px; border-radius: 50%; object-fit: cover; object-position: 50% 20%; border: 3px solid rgba(255,255,255,.18); }
  .from p { font-size: 24px; font-weight: 700; } .from span { display: block; font-size: 19px; font-weight: 500; color: #94a3b8; margin-top: 2px; }
  .card { position: absolute; right: 72px; top: 92px; width: 400px; background: #fff; color: #0f172a; border-radius: 22px;
    padding: 30px 30px 32px; box-shadow: 0 30px 60px rgba(0,0,0,.35); }
  .segs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .segs div { height: 7px; border-radius: 9px; background: #e2e8f0; } .segs .on { background: #1d4ed8; }
  .labels { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 9px; font-size: 12px; font-weight: 700; letter-spacing: .06em; color: #64748b; }
  .labels .on { color: #1d4ed8; }
  .eyebrow { margin-top: 26px; font-size: 13px; font-weight: 800; letter-spacing: .14em; color: #d97706; }
  .q { margin-top: 8px; font-size: 27px; font-weight: 800; line-height: 1.15; }
  .opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
  .opt { display: flex; align-items: center; gap: 10px; padding: 14px 14px; border: 1.5px solid #e2e8f0; border-radius: 12px; background: #f8f9fc; font-size: 17px; font-weight: 600; }
  .opt i { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #cbd5e1; background: #fff; display: grid; place-items: center; }
  .opt.sel { border-color: #1d4ed8; background: #eef2ff; } .opt.sel i { background: #1d4ed8; border-color: #1d4ed8; }
  .opt.sel i::after { content: ''; width: 9px; height: 5px; border: solid #fff; border-width: 0 0 2.5px 2.5px; transform: translateY(-1px) rotate(-45deg); }
  .btn { margin-top: 24px; margin-left: auto; width: max-content; padding: 14px 30px; border-radius: 12px; background: #1d4ed8; color: #fff; font-size: 18px; font-weight: 700; }
</style></head><body>
  <div class="left">
    <div class="pill"><i></i>Private onboarding · ${esc(c.clientName)}</div>
    <p class="hello">Welcome to <b>RankRGV</b>,</p>
    <p class="name">${esc(c.contactFirst)}.</p>
    <p class="sub">Your onboarding is ready.<br>It takes about three minutes.</p>
  </div>
  <div class="from"><img src="${headshot}" alt=""><p>From Eddie Urbano<span>Founder, RankRGV</span></p></div>
  <div class="card">
    <div class="segs"><div class="on"></div><div class="on"></div><div></div><div></div></div>
    <div class="labels"><span class="on">✓ YOU</span><span class="on">SCHEDULE</span><span>UPDATES</span><span>BILLING</span></div>
    <p class="eyebrow">YOUR SCHEDULE</p>
    <p class="q">Which days are okay to contact you?</p>
    <div class="opts">
      <div class="opt sel"><i></i>Mon – Fri</div><div class="opt"><i></i>Saturday</div>
    </div>
    <div class="btn">Next</div>
  </div>
  <div class="bar"></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of onboardingClients) {
  await page.setContent(html(c), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(outDir, `${c.slug}.png`);
  await page.screenshot({ path: file });
  console.log('wrote', path.relative(root, file));
}
await browser.close();
