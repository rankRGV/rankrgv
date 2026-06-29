# IndexNow

Notifies Bing, Yandex, Naver, and Seznam the moment content changes. One ping
hits every IndexNow partner. Google does **not** use IndexNow — see
[Google Indexing](#google-indexing) below for that side.

## What's set up here

| Piece | Path | Purpose |
|-------|------|---------|
| Key file | `public/d19c27e36c735779a34908bece0a145b.txt` | Proves domain ownership. Astro copies it to `rankrgv.com/d19c27e36c735779a34908bece0a145b.txt` on build. |
| Submitter | `scripts/indexnow.mjs` | Zero-dep Node script that POSTs URLs to IndexNow (manual / ad-hoc). |
| Auto-diff | `scripts/indexnow-diff.mjs` | Compares live sitemap to a snapshot and submits only NEW URLs. |
| Snapshot | `scripts/.indexnow-snapshot.json` | Last-seen sitemap URL set. Committed by CI — don't hand-edit. |
| Manual workflow | `.github/workflows/indexnow.yml` | `workflow_dispatch` to submit URLs or the full sitemap on demand. |
| Auto workflow | `.github/workflows/indexnow-diff.yml` | Scheduled 8:30 AM CT (30 min after publish cron). Runs the diff, commits the snapshot. |

## How the automation works

1. `Scheduled Publish` fires 8 AM CT → Vercel rebuilds → new blog posts go live in the sitemap.
2. `IndexNow Auto-Submit` fires 8:30 AM CT → fetches the live sitemap → diffs against
   `.indexnow-snapshot.json` → POSTs only the added URLs → commits the refreshed snapshot.

It's deploy-agnostic: any change that adds a URL to the sitemap gets caught on the next run,
no matter how it was deployed. **Edits to existing pages aren't detected** (the sitemap has no
`<lastmod>`) — ping those manually with `indexnow.mjs <url>`.

## Use it

```bash
# After publishing / updating specific pages:
node scripts/indexnow.mjs https://rankrgv.com/blog/new-post/

# Submit everything in the sitemap (one-time, or after a big change):
node scripts/indexnow.mjs --sitemap

# Preview the payload without sending:
node scripts/indexnow.mjs --dry-run https://rankrgv.com/blog/new-post/
```

Or run it from GitHub → Actions → **IndexNow Submit** → Run workflow.

**Rule:** only submit URLs that actually changed. Re-pinging the whole site on
every deploy gets you throttled and adds nothing.

## Verify it's live (after deploy)

```bash
curl https://rankrgv.com/d19c27e36c735779a34908bece0a145b.txt
# → d19c27e36c735779a34908bece0a145b
```

## Google Indexing

Google isn't an IndexNow partner. The only programmatic option is Google's
**Indexing API**, which is officially scoped to `JobPosting`/`BroadcastEvent`
pages only — using it for blog/service pages works in practice (common
practice among SEOs) but is outside Google's documented terms. If Google ever
enforces the scope on this property, submissions just silently stop helping;
there's no penalty, sitemap-based crawling still works as a fallback.

| Piece | Path | Purpose |
|-------|------|---------|
| Submitter | `scripts/google-index.mjs` | Authenticates with a service-account JSON, POSTs `URL_UPDATED` to the Indexing API. No-ops (doesn't error) if the credential isn't configured. |
| Wired into | `scripts/indexnow-diff.mjs` | Same `added` URL list from the sitemap diff gets submitted to both IndexNow and Google in one run. |

### One-time setup

1. In Google Cloud Console, enable the **Web Search Indexing API** on the project tied to your service account.
2. In Search Console → Settings → Users and permissions, add the service account's email (`...@<project>.iam.gserviceaccount.com`) as an **Owner** on the `rankrgv.com` property. (Indexing API requires Owner, not just a viewer/restricted role.)
3. Add the service account JSON as a GitHub Actions secret — **don't paste the JSON into chat, a commit, or anywhere outside this command**:
   ```bash
   gh secret set GOOGLE_SERVICE_ACCOUNT_JSON --repo rankRGV/rankrgv < /path/to/service-account.json
   ```
4. That's it — `indexnow-diff.yml` already passes the secret through as an env var on the next scheduled run.

### Manual test

```bash
# Confirm it no-ops safely with no credential set:
node scripts/google-index.mjs --dry-run https://rankrgv.com/blog/some-post/

# With the secret set locally:
GOOGLE_SERVICE_ACCOUNT_JSON="$(cat /path/to/service-account.json)" \
  node scripts/google-index.mjs https://rankrgv.com/blog/some-post/
```

## Reuse on another client site

1. Generate a key: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
2. Save it as `public/<key>.txt` (file contents === the key).
3. Copy `scripts/indexnow.mjs` over. Set the host either with env vars or edit the default:
   ```bash
   INDEXNOW_HOST=tektonhomesolutions.com node scripts/indexnow.mjs --sitemap
   ```
The script auto-discovers the key from `public/<key>.txt`, so nothing else changes.
