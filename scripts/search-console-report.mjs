#!/usr/bin/env node
/**
 * Google Search Console — read-only Search Analytics report puller.
 *
 * Reuses the same service account already granted Owner on the rankrgv.com
 * property for the Indexing API (see scripts/google-index.mjs / INDEXNOW.md).
 * Owner also covers the Search Analytics API read scope, so no new OAuth
 * grant is needed — just a different scope on the same credential.
 *
 * Requires GOOGLE_SERVICE_ACCOUNT_JSON in the environment (never paste the
 * JSON into chat/commits — same rule as the indexing script).
 *
 * Usage:
 *   GOOGLE_SERVICE_ACCOUNT_JSON="$(cat /path/to/service-account.json)" \
 *     node scripts/search-console-report.mjs [--site https://rankrgv.com/] [--days 90] [--out report.json]
 *
 * If the property is a Domain property (not URL-prefix), pass
 * --site sc-domain:rankrgv.com instead.
 */

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { GoogleAuth } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

function getCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set. See scripts/INDEXNOW.md for how to source it locally.');
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is set but is not valid JSON.');
  }
}

async function getToken() {
  const auth = new GoogleAuth({ credentials: getCredentials(), scopes: SCOPES });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

async function query(siteUrl, token, body) {
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Search Console API ${res.status}: ${JSON.stringify(json)}`);
  }
  return json.rows ?? [];
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag, fallback) => {
    const i = args.indexOf(flag);
    return i === -1 ? fallback : args[i + 1];
  };

  const siteUrl = getArg('--site', 'https://rankrgv.com/');
  const days = parseInt(getArg('--days', '90'), 10);
  const outFile = getArg('--out', null);

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);
  // GSC data has a ~2-3 day reporting lag; end a few days back for completeness.
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() - 3);

  const prevStart = new Date(startDate);
  prevStart.setDate(prevStart.getDate() - days);
  const prevEnd = new Date(startDate);
  prevEnd.setDate(prevEnd.getDate() - 1);

  console.error(`Fetching Search Console data for ${siteUrl} (${isoDate(startDate)} to ${isoDate(endDate)})...`);

  const token = await getToken();

  const [totals, byQuery, byPage, recentByPage, previousByPage] = await Promise.all([
    query(siteUrl, token, {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      dimensions: [],
    }),
    query(siteUrl, token, {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      dimensions: ['query'],
      rowLimit: 50,
    }),
    query(siteUrl, token, {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      dimensions: ['page'],
      rowLimit: 100,
    }),
    query(siteUrl, token, {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      dimensions: ['page'],
      rowLimit: 5000,
    }),
    query(siteUrl, token, {
      startDate: isoDate(prevStart),
      endDate: isoDate(prevEnd),
      dimensions: ['page'],
      rowLimit: 5000,
    }),
  ]);

  // Build a period-over-period comparison per page to surface drops/gains.
  const prevMap = new Map(previousByPage.map((r) => [r.keys[0], r]));
  const comparison = recentByPage.map((r) => {
    const prev = prevMap.get(r.keys[0]);
    const prevClicks = prev?.clicks ?? 0;
    return {
      page: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
      prevClicks,
      clicksDelta: r.clicks - prevClicks,
    };
  }).sort((a, b) => a.clicksDelta - b.clicksDelta);

  const report = {
    site: siteUrl,
    period: { start: isoDate(startDate), end: isoDate(endDate), days },
    previousPeriod: { start: isoDate(prevStart), end: isoDate(prevEnd) },
    totals: totals[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    topQueries: byQuery,
    topPages: byPage,
    biggestDrops: comparison.filter((c) => c.clicksDelta < 0).slice(0, 15),
    biggestGains: comparison.filter((c) => c.clicksDelta > 0).sort((a, b) => b.clicksDelta - a.clicksDelta).slice(0, 15),
    zeroClickIndexedPages: recentByPage.filter((r) => r.clicks === 0).map((r) => r.keys[0]),
  };

  const json = JSON.stringify(report, null, 2);
  if (outFile) {
    await writeFile(outFile, json, 'utf8');
    console.error(`Report written to ${outFile}`);
  } else {
    console.log(json);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
