#!/usr/bin/env node
/**
 * IndexNow sitemap-diff — submit only URLs that are NEW since the last run.
 *
 * Fetches the LIVE sitemap, compares it to a committed snapshot, and pings
 * IndexNow with whatever was added. Then rewrites the snapshot. Deploy-agnostic:
 * it catches any change that adds a URL to the sitemap (auto-published blog
 * posts, new city/service pages), regardless of how the deploy happened.
 *
 * Note: this sitemap has no <lastmod>, so edits to EXISTING pages aren't
 * detected here — ping those manually with indexnow.mjs <url>.
 *
 * Usage:
 *   node scripts/indexnow-diff.mjs            # diff + submit additions
 *   node scripts/indexnow-diff.mjs --dry-run  # show what would be submitted
 *
 * First run with no snapshot just writes the baseline and submits nothing.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveKey, urlsFromSitemap, submit, MAX_URLS } from './indexnow.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = join(__dirname, '.indexnow-snapshot.json');

async function readSnapshot() {
  try {
    const data = JSON.parse(await readFile(SNAPSHOT, 'utf8'));
    return new Set(data.urls || []);
  } catch {
    return null; // no snapshot yet → first run
  }
}

async function writeSnapshot(urls) {
  const payload = { updated: new Date().toISOString(), urls: [...urls].sort() };
  await writeFile(SNAPSHOT, JSON.stringify(payload, null, 2) + '\n');
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const current = new Set(await urlsFromSitemap());
  const previous = await readSnapshot();

  if (previous === null) {
    if (!dryRun) await writeSnapshot(current);
    console.log(`No snapshot found — baseline written (${current.size} URLs). Nothing submitted.`);
    return;
  }

  const added = [...current].filter((u) => !previous.has(u));

  if (!added.length) {
    console.log(`No new URLs (${current.size} in sitemap). Nothing to submit.`);
    if (!dryRun) await writeSnapshot(current); // keep snapshot fresh (handles removals)
    return;
  }

  console.log(`${added.length} new URL(s):\n${added.map((u) => `  + ${u}`).join('\n')}`);

  const key = await resolveKey();
  for (let i = 0; i < added.length; i += MAX_URLS) {
    await submit(added.slice(i, i + MAX_URLS), key, dryRun);
  }

  if (!dryRun) await writeSnapshot(current);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
