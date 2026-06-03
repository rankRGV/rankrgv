# IndexNow

Notifies Bing, Yandex, Naver, and Seznam the moment content changes. One ping
hits every IndexNow partner. Google does **not** use IndexNow — keep submitting
sitemaps to Google Search Console as usual.

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

## Reuse on another client site

1. Generate a key: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
2. Save it as `public/<key>.txt` (file contents === the key).
3. Copy `scripts/indexnow.mjs` over. Set the host either with env vars or edit the default:
   ```bash
   INDEXNOW_HOST=tektonhomesolutions.com node scripts/indexnow.mjs --sitemap
   ```
The script auto-discovers the key from `public/<key>.txt`, so nothing else changes.
