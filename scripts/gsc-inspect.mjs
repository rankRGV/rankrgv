#!/usr/bin/env node
/**
 * Google Search Console — URL Inspection (read-only).
 *
 * Asks Google whether each URL is indexed, and if not, why ("Crawled -
 * currently not indexed", "Discovered - currently not indexed", etc.), plus
 * the last crawl time and the canonical Google chose.
 *
 * Credentials: same as search-console-report.mjs (GOOGLE_SERVICE_ACCOUNT_JSON,
 * or the key file at ~/.secrets/rankrgv-gsc-service-account.json).
 * Quota: 2,000 inspections/day per property.
 *
 * Usage:
 *   node scripts/gsc-inspect.mjs                      # every URL in the live sitemap
 *   node scripts/gsc-inspect.mjs --filter service-areas
 *   node scripts/gsc-inspect.mjs --url https://rankrgv.com/local-seo/
 *   node scripts/gsc-inspect.mjs --out scripts/.gsc-inspect.json
 */

import { writeFile } from 'node:fs/promises';
import { GoogleAuth } from 'google-auth-library';
import { getCredentials } from './search-console-report.mjs';

const SITE = 'https://rankrgv.com/';
const SITEMAP = 'https://rankrgv.com/sitemap-0.xml';

const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1];
};

async function sitemapUrls() {
  const xml = await (await fetch(SITEMAP)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const single = getArg('--url');
  const filter = getArg('--filter');
  const outFile = getArg('--out');

  let urls = single ? [single] : await sitemapUrls();
  if (filter) urls = urls.filter((u) => u.includes(filter));

  const auth = new GoogleAuth({
    credentials: getCredentials(),
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const token = (await (await auth.getClient()).getAccessToken()).token;

  const results = [];
  for (const url of urls) {
    const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
    });
    const json = await res.json();
    if (!res.ok) {
      console.log(`ERROR  ${url}  ${res.status} ${json.error?.message ?? ''}`);
      results.push({ url, error: json.error ?? res.status });
      continue;
    }
    const r = json.inspectionResult?.indexStatusResult ?? {};
    const row = {
      url,
      verdict: r.verdict,
      coverageState: r.coverageState,
      lastCrawlTime: r.lastCrawlTime ?? null,
      googleCanonical: r.googleCanonical ?? null,
      robotsTxtState: r.robotsTxtState,
      indexingState: r.indexingState,
    };
    results.push(row);
    console.log(`${(row.verdict ?? '').padEnd(8)} ${(row.coverageState ?? '').padEnd(40)} ${(row.lastCrawlTime ?? 'never crawled').slice(0, 10)}  ${url}`);
  }

  const indexed = results.filter((r) => r.verdict === 'PASS').length;
  console.log(`\n${indexed}/${results.length} indexed`);
  if (outFile) {
    await writeFile(outFile, JSON.stringify({ inspectedAt: new Date().toISOString(), results }, null, 2));
    console.log(`Written to ${outFile}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
