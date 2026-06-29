#!/usr/bin/env node
/**
 * Google Indexing API submitter.
 *
 * Note: Google officially scopes this API to JobPosting/BroadcastEvent pages.
 * We use it for blog/service pages anyway (common practice), which works but
 * is outside Google's documented terms — if Google ever enforces the scope on
 * this property, submissions would silently stop helping (no penalty, just no effect).
 *
 * No-op (not an error) if GOOGLE_SERVICE_ACCOUNT_JSON isn't set, so callers
 * (e.g. indexnow-diff.mjs) can always call submit() without checking first.
 *
 * Usage:
 *   node scripts/google-index.mjs https://rankrgv.com/blog/some-post/
 *   node scripts/google-index.mjs --dry-run <urls>
 */

import { fileURLToPath } from 'node:url';
import { GoogleAuth } from 'google-auth-library';

const ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const SCOPES = ['https://www.googleapis.com/auth/indexing'];

let authClient = null;

function getCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is set but is not valid JSON.');
  }
}

async function getToken() {
  if (!authClient) {
    const credentials = getCredentials();
    if (!credentials) return null;
    const auth = new GoogleAuth({ credentials, scopes: SCOPES });
    authClient = await auth.getClient();
  }
  const { token } = await authClient.getAccessToken();
  return token;
}

export async function submit(urls, dryRun) {
  if (!urls.length) return;

  const token = await getToken();
  if (!token) {
    console.log('Google Indexing API: GOOGLE_SERVICE_ACCOUNT_JSON not set — skipping.');
    return;
  }

  for (const url of urls) {
    const body = { url, type: 'URL_UPDATED' };
    if (dryRun) {
      console.log(`[dry-run] Google Indexing API ← ${JSON.stringify(body)}`);
      continue;
    }
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log(`Google Indexing API → ${res.status} ${res.statusText} (${url})${res.ok ? '' : `\n${text}`}`);
    if (!res.ok) process.exitCode = 1;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const urls = args.filter((a) => a.startsWith('http'));

  if (!urls.length) {
    console.error('No URLs to submit. Pass one or more URLs.');
    process.exit(1);
  }

  await submit(urls, dryRun);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
