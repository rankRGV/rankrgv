#!/usr/bin/env node
/**
 * Adds an accurate <lastmod> to the built sitemap. Runs after `astro build`.
 *
 * Why: Google reads <lastmod> only when it is consistently accurate, and it
 * treats "freshness" dates on unchanged content as a warning sign. So a page
 * only gets a new date when the visible text inside its <main> changes.
 *
 * How:
 *   - Blog posts (/blog/<slug>/) use their own <time datetime> (Updated date,
 *     else Published date). The /blog/ index uses the newest post date.
 *   - Every other page: hash the visible text of <main>. Compare to the
 *     committed manifest `sitemap-lastmod.json`. Changed text = today's date.
 *     Pages never seen changing have no <lastmod> (better than a false one).
 *   - Only LOCAL builds write the manifest and assign new dates. Vercel builds
 *     (VERCEL=1) reuse the committed dates and never invent one, so repeated
 *     deploys can't make pages look fresh.
 *
 * Rule: commit `sitemap-lastmod.json` together with the page change.
 *
 * Usage: node scripts/sitemap-lastmod.mjs   (wired into `npm run build`)
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, 'sitemap-lastmod.json');
const OUT_DIRS = [join(ROOT, 'dist'), join(ROOT, '.vercel', 'output', 'static')].filter(existsSync);
const IS_CI = Boolean(process.env.VERCEL || process.env.CI);
const TODAY = new Date().toISOString().slice(0, 10);

const htmlFor = (dir, path) => {
  const p = decodeURIComponent(path).replace(/^\/+|\/+$/g, '');
  for (const c of [join(dir, p, 'index.html'), join(dir, `${p}.html`)]) if (existsSync(c)) return c;
  return null;
};

const mainText = (html) => {
  const m = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return (m ? m[1] : html)
    .replace(/<(script|style|noscript|svg)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Blog post date: prefer the "Updated" <time>, else the first <time datetime>.
const postDate = (html) => {
  const upd = html.match(/Updated\s*<time[^>]*datetime="([^"]+)"/i);
  const any = html.match(/<time[^>]*datetime="([^"]+)"/i);
  const d = (upd || any)?.[1];
  return d ? d.slice(0, 10) : null;
};

async function main() {
  if (!OUT_DIRS.length) throw new Error('No build output found. Run astro build first.');
  const dir = OUT_DIRS[0];
  const sitemaps = (await readdir(dir)).filter((f) => /^sitemap-\d+\.xml$/.test(f));
  if (!sitemaps.length) throw new Error('No sitemap-N.xml in build output.');

  const manifest = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {};
  const next = {};
  let changed = 0;
  let blogNewest = null;
  const dates = {};

  for (const sm of sitemaps) {
    const xml = await readFile(join(dir, sm), 'utf8');
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const path = new URL(loc).pathname;
      const file = htmlFor(dir, path);
      if (!file) continue;
      const html = await readFile(file, 'utf8');
      const hash = createHash('sha1').update(mainText(html)).digest('hex').slice(0, 16);
      const prev = manifest[path];

      if (/^\/blog\/[^/]+\/$/.test(path)) {
        const d = postDate(html);
        dates[path] = d;
        if (d && (!blogNewest || d > blogNewest)) blogNewest = d;
        next[path] = { hash, lastmod: d };
        continue;
      }

      let lastmod = prev?.lastmod ?? null;
      if (prev && prev.hash !== hash && !IS_CI) {
        lastmod = TODAY;
        changed++;
      }
      // New page on a local build: its first publish date is today.
      if (!prev && !IS_CI && Object.keys(manifest).length) lastmod = TODAY;
      next[path] = { hash: IS_CI && prev ? prev.hash : hash, lastmod };
      dates[path] = lastmod;
    }
  }
  if (blogNewest && '/blog/' in dates) {
    dates['/blog/'] = blogNewest;
    next['/blog/'].lastmod = blogNewest;
  }

  // Write <lastmod> into every copy of the sitemap.
  for (const out of OUT_DIRS) {
    for (const sm of sitemaps) {
      const f = join(out, sm);
      if (!existsSync(f)) continue;
      let xml = await readFile(f, 'utf8');
      xml = xml.replace(/<lastmod>[^<]*<\/lastmod>/g, '');
      xml = xml.replace(/<loc>([^<]+)<\/loc>/g, (all, loc) => {
        const d = dates[new URL(loc).pathname];
        return d ? `${all}<lastmod>${d}</lastmod>` : all;
      });
      await writeFile(f, xml);
    }
  }

  const withDate = Object.values(dates).filter(Boolean).length;
  if (!IS_CI) {
    const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
    await writeFile(MANIFEST, JSON.stringify(sorted, null, 1) + '\n');
  }
  console.log(`sitemap-lastmod: ${Object.keys(dates).length} URLs, ${withDate} with lastmod, ${changed} changed${IS_CI ? ' (CI: no new dates)' : ''}.`);
}

main().catch((err) => {
  console.error('sitemap-lastmod:', err.message);
  process.exit(1);
});
