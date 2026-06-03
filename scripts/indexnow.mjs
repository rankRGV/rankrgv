#!/usr/bin/env node
/**
 * IndexNow submitter — zero dependencies, Node 18+ (uses global fetch).
 *
 * One ping notifies Bing, Yandex, Naver, Seznam (and any future IndexNow
 * partners). Submit ONLY changed/new/deleted URLs — never spam the whole site.
 *
 * Usage:
 *   node scripts/indexnow.mjs https://rankrgv.com/blog/some-post/
 *   node scripts/indexnow.mjs <url1> <url2> ...
 *   node scripts/indexnow.mjs --sitemap          # submit every URL in the sitemap (one-time / big change)
 *   node scripts/indexnow.mjs --dry-run <urls>   # print payload, don't send
 *
 * Config (override via env if reusing on another site):
 *   INDEXNOW_HOST   default: rankrgv.com
 *   INDEXNOW_KEY    default: read from the *.txt key file in /public
 *   INDEXNOW_ORIGIN default: https://<host>
 */

import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
export const MAX_URLS = 10000; // IndexNow per-request limit

export const HOST = process.env.INDEXNOW_HOST || 'rankrgv.com';
export const ORIGIN = process.env.INDEXNOW_ORIGIN || `https://${HOST}`;

export async function resolveKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY.trim();
  // Auto-discover the key file dropped in /public (named <key>.txt, contents === key).
  const files = await readdir(PUBLIC_DIR);
  const keyFile = files.find((f) => /^[a-f0-9-]{8,128}\.txt$/i.test(f));
  if (!keyFile) {
    throw new Error('No IndexNow key found. Set INDEXNOW_KEY or add public/<key>.txt');
  }
  return (await readFile(join(PUBLIC_DIR, keyFile), 'utf8')).trim();
}

export async function urlsFromSitemap() {
  const indexUrl = `${ORIGIN}/sitemap-index.xml`;
  const indexXml = await (await fetch(indexUrl)).text();
  const subMaps = [...indexXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const targets = subMaps.length ? subMaps : [indexUrl];
  const urls = new Set();
  for (const sm of targets) {
    const xml = await (await fetch(sm)).text();
    for (const m of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
      if (!m[1].endsWith('.xml')) urls.add(m[1].trim());
    }
  }
  return [...urls];
}

export async function submit(urlList, key, dryRun) {
  const body = {
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${key}.txt`,
    urlList,
  };
  if (dryRun) {
    console.log(JSON.stringify(body, null, 2));
    return;
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  // 200 OK / 202 Accepted = success. 400/403/422/429 = problem.
  const text = await res.text();
  console.log(`IndexNow → ${res.status} ${res.statusText} (${urlList.length} URLs)${text ? `\n${text}` : ''}`);
  if (!res.ok) process.exitCode = 1;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const useSitemap = args.includes('--sitemap');
  let urls = args.filter((a) => a.startsWith('http'));

  if (useSitemap) urls = await urlsFromSitemap();

  if (!urls.length) {
    console.error('No URLs to submit. Pass URLs or --sitemap.');
    process.exit(1);
  }

  const key = await resolveKey();
  for (let i = 0; i < urls.length; i += MAX_URLS) {
    await submit(urls.slice(i, i + MAX_URLS), key, dryRun);
  }
}

// Only run the CLI when executed directly, not when imported (e.g. by indexnow-diff.mjs).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
