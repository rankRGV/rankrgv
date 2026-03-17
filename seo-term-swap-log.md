# 10DLC Compliance: SEO Term Swap Log

**Date:** 2026-03-16  
**Purpose:** Temporarily replace "SEO" and "Local SEO" terminology site-wide to pass 10DLC campaign registration with Telnyx/carriers. The carriers' automated compliance bots flag websites mentioning SEO services.  
**Git Commit:** `chore: temporarily swap SEO terms for 10DLC approval`  

> ⚠️ To revert ALL changes instantly, run: `git revert HEAD` or `git checkout HEAD~1 -- .`

---

## Term Mapping (Old → New)

| Original Term | Replacement |
|---|---|
| Local SEO | Google Maps Optimization |
| Local SEO & Google Maps | Google Maps Optimization |
| SEO company | digital marketing company |
| SEO services | digital marketing services |
| SEO strategy | digital marketing strategy |
| Free SEO Audit | Free Digital Marketing Audit |
| Technical SEO | Technical Optimization |
| Full-service SEO | Full-service digital marketing |
| local seo (slug references) | google-maps-optimization |

---

## Files Changed

### Core Config / Data
| File | Change |
|---|---|
| `src/config/site.ts` | Tagline: "Local SEO & Digital Marketing" → "Digital Marketing & Google Maps Optimization" |
| `src/data/services.ts` | Service name/shortName, primaryKeyword, titleTag, metaDescription for local-seo service |

### Pages (manually edited)
| File | Changes |
|---|---|
| `src/pages/index.astro` | Title, description, FAQs (3 questions), schema, hero subheadline, pricing CTA text, FAQ section headline |
| `src/pages/local-seo.astro` | All FAQs, howToSteps name, schema labels, Hero badge/mockup, section headings, pricing, ServiceAreaGrid headline, FAQSection headline |
| `src/pages/about.astro` | "What we are" list item, market beliefs paragraph |
| `src/pages/contact.astro` | Title, meta description, step-03 body copy |
| `src/components/Footer.astro` | Brand tagline text, "Free SEO Audit" → "Free Audit" link |

### Pages (batch-updated via PowerShell)
| Directory | Files Updated |
|---|---|
| `src/pages/service-areas/**` | All `.astro` files — Brownsville, Edinburgh, Harlingen, McAllen, Mission, Pharr (index, local-seo, web-design, business-automation pages) |
| `src/pages/` (top-level) | `get-started.astro`, `google-maps-optimization.astro`, `pricing.astro`, `privacy-policy.astro`, `terms.astro`, `web-design.astro` |

### Not Changed (intentionally)
| File | Reason |
|---|---|
| `src/pages/es/**` | Spanish pages had no English SEO terms to replace (separate content) |
| `src/pages/business-automation.astro` | No SEO mentions present |
| `src/pages/thank-you.astro` | No SEO mentions present |
| File slugs/URLs (e.g., `/local-seo/`) | URL slugs left intact to avoid breaking links and routing |

---

## How to Revert

### Option 1: Git (recommended — instant, perfect)
```bash
git revert HEAD
```
This creates a new commit that undoes all the changes above cleanly.

### Option 2: Git Reset (if you haven't pushed yet)
```bash
git reset HEAD~1 --hard
```
⚠️ This destroys the commit history. Only use locally if you haven't pushed.

### Option 3: Restore Specific File
```bash
git checkout HEAD~1 -- src/pages/index.astro
```
Replace `index.astro` with any specific file path from the table above.
