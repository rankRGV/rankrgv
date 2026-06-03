# IndexNow

Notifies Bing, Yandex, Naver, and Seznam the moment content changes. One ping
hits every IndexNow partner. Google does **not** use IndexNow — keep submitting
sitemaps to Google Search Console as usual.

## What's set up here

| Piece | Path | Purpose |
|-------|------|---------|
| Key file | `public/d19c27e36c735779a34908bece0a145b.txt` | Proves domain ownership. Astro copies it to `rankrgv.com/d19c27e36c735779a34908bece0a145b.txt` on build. |
| Submitter | `scripts/indexnow.mjs` | Zero-dep Node script that POSTs URLs to IndexNow. |
| Workflow | `.github/workflows/indexnow.yml` | Manual `workflow_dispatch` trigger (structure ready for full automation). |

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
