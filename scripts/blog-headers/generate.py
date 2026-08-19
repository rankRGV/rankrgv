"""
generate.py — Coded brand-graphic blog header generator for RankRGV.

Reads every post in src/content/blog/, builds a category-themed 1200x630
HTML card (no AI image model involved — pure CSS/SVG in RankRGV's brand
tokens), then renders each to PNG via Playwright.

Usage:
    "C:\\Users\\Eddie\\.notebooklm-venv\\Scripts\\python.exe" generate.py

Output: ../../public/images/blog/<slug>.png (1200x630, 2x scale)
"""

import os
import re
import sys
from pathlib import Path

os.environ.setdefault("PYTHONUTF8", "1")

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("ERROR: Playwright not found. Run: pip install playwright && playwright install chromium")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent
BLOG_CONTENT = ROOT / ".." / ".." / "src" / "content" / "blog"
HTML_OUT = ROOT / "html"
PNG_OUT = ROOT / ".." / ".." / "public" / "images" / "blog"

HTML_OUT.mkdir(parents=True, exist_ok=True)
PNG_OUT.mkdir(parents=True, exist_ok=True)

# ── Category themes — matches categoryColors in blog/index.astro ──────────
THEMES = {
    "local-seo": {
        "label": "Local SEO",
        "accent": "#1d4ed8",
        "accent_light": "#3b82f6",
        "glow": "rgba(29, 78, 216, 0.45)",
    },
    "google-maps": {
        "label": "Google Maps",
        "accent": "#f59e0b",
        "accent_light": "#fbbf24",
        "glow": "rgba(245, 158, 11, 0.40)",
    },
    "web-design": {
        "label": "Web Design",
        "accent": "#7c3aed",
        "accent_light": "#a78bfa",
        "glow": "rgba(124, 58, 237, 0.45)",
    },
    "business-automation": {
        "label": "Business Automation",
        "accent": "#10b981",
        "accent_light": "#34d399",
        "glow": "rgba(16, 185, 129, 0.40)",
    },
}

# ── Abstract SVG motifs — geometric, not photorealistic. One per category. ──
def motif_local_seo(accent, accent_light):
    return f"""
    <svg width="520" height="520" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="260" cy="260" r="180" stroke="{accent_light}" stroke-opacity="0.18" stroke-width="1.5"/>
      <circle cx="260" cy="260" r="130" stroke="{accent_light}" stroke-opacity="0.14" stroke-width="1.5"/>
      <g transform="translate(180,140)">
        <path d="M80 0C35.8 0 0 35.8 0 80c0 60 80 140 80 140s80-80 80-140C160 35.8 124.2 0 80 0z" fill="{accent}" fill-opacity="0.9"/>
        <circle cx="80" cy="80" r="34" fill="#0f172a"/>
      </g>
      <g stroke="{accent_light}" stroke-width="3" stroke-linecap="round" stroke-opacity="0.55">
        <path d="M300 150 Q330 120 300 90"/>
        <path d="M325 175 Q370 120 325 65"/>
      </g>
    </svg>
    """

def motif_google_maps(accent, accent_light):
    return f"""
    <svg width="560" height="520" viewBox="0 0 560 520" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="380" width="500" height="6" rx="3" fill="{accent_light}" fill-opacity="0.2"/>
      <g transform="translate(150,60)">
        <path d="M70 0C31.3 0 0 31.3 0 70c0 52.5 70 122.5 70 122.5S140 122.5 140 70C140 31.3 108.7 0 70 0z" fill="{accent}"/>
        <circle cx="70" cy="70" r="28" fill="#0f172a"/>
        <text x="70" y="80" font-family="Inter, sans-serif" font-weight="800" font-size="30" fill="{accent}" text-anchor="middle">1</text>
      </g>
      <g transform="translate(20,180)" opacity="0.72">
        <path d="M55 0C24.6 0 0 24.6 0 55c0 41.3 55 96.3 55 96.3S110 96.3 110 55C110 24.6 85.4 0 55 0z" fill="{accent_light}"/>
        <circle cx="55" cy="55" r="22" fill="#0f172a"/>
        <text x="55" y="63" font-family="Inter, sans-serif" font-weight="800" font-size="24" fill="{accent_light}" text-anchor="middle">2</text>
      </g>
      <g transform="translate(340,200)" opacity="0.5">
        <path d="M50 0C22.4 0 0 22.4 0 50c0 37.5 50 87.5 50 87.5S100 87.5 100 50C100 22.4 77.6 0 50 0z" fill="{accent_light}"/>
        <circle cx="50" cy="50" r="20" fill="#0f172a"/>
        <text x="50" y="58" font-family="Inter, sans-serif" font-weight="800" font-size="22" fill="{accent_light}" text-anchor="middle">3</text>
      </g>
    </svg>
    """

def motif_web_design(accent, accent_light):
    return f"""
    <svg width="540" height="460" viewBox="0 0 540 460" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="480" height="340" rx="16" fill="#0f172a" stroke="{accent_light}" stroke-opacity="0.35" stroke-width="2"/>
      <rect x="10" y="10" width="480" height="44" rx="16" fill="{accent}" fill-opacity="0.18"/>
      <circle cx="34" cy="32" r="6" fill="{accent_light}" fill-opacity="0.6"/>
      <circle cx="54" cy="32" r="6" fill="{accent_light}" fill-opacity="0.4"/>
      <circle cx="74" cy="32" r="6" fill="{accent_light}" fill-opacity="0.25"/>
      <rect x="34" y="80" width="180" height="18" rx="4" fill="{accent}" fill-opacity="0.85"/>
      <rect x="34" y="112" width="280" height="10" rx="3" fill="{accent_light}" fill-opacity="0.35"/>
      <rect x="34" y="132" width="240" height="10" rx="3" fill="{accent_light}" fill-opacity="0.35"/>
      <rect x="34" y="168" width="120" height="40" rx="8" fill="{accent}"/>
      <rect x="330" y="80" width="140" height="140" rx="10" fill="{accent_light}" fill-opacity="0.15" stroke="{accent_light}" stroke-opacity="0.3"/>
    </svg>
    """

MOTIFS = {
    "local-seo": motif_local_seo,
    "google-maps": motif_google_maps,
    "web-design": motif_web_design,
    "business-automation": motif_web_design,  # reuse until a dedicated post exists
}

CARD_TEMPLATE = """<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@700;800;900&display=swap" rel="stylesheet">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: 1200px; height: 630px; overflow: hidden; }}
  body {{
    font-family: 'Inter', system-ui, sans-serif;
    background-color: #0f172a;
    background-image: radial-gradient(circle at 1px 1px, rgba(59,130,246,0.22) 1px, transparent 0);
    background-size: 32px 32px;
    position: relative;
  }}
  .glow {{
    position: absolute;
    top: -140px;
    right: -140px;
    width: 620px;
    height: 620px;
    border-radius: 50%;
    background: radial-gradient(circle, {glow} 0%, transparent 70%);
    filter: blur(10px);
  }}
  .motif {{
    position: absolute;
    right: 20px;
    bottom: -20px;
    opacity: 0.9;
  }}
  .content {{
    position: relative;
    z-index: 2;
    padding: 72px 64px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}
  .badge {{
    display: inline-flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    padding: 9px 20px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid {accent}66;
    color: {accent_light};
    font-weight: 800;
    font-size: 19px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }}
  .dot {{
    width: 9px; height: 9px; border-radius: 50%; background: {accent};
  }}
  h1 {{
    color: #ffffff;
    font-weight: 900;
    font-size: {title_size}px;
    line-height: 1.14;
    max-width: 600px;
    letter-spacing: -0.01em;
  }}
  .footer {{
    display: flex;
    align-items: center;
    gap: 12px;
  }}
  .logo {{
    font-weight: 900;
    font-size: 24px;
    color: #ffffff;
  }}
  .logo span {{ color: {accent_light}; }}
  .tagline {{
    color: rgba(255,255,255,0.55);
    font-size: 16px;
    font-weight: 700;
  }}
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="motif">{motif_svg}</div>
  <div class="content">
    <div class="badge"><span class="dot"></span>{category_label}</div>
    <h1>{title}</h1>
    <div class="footer">
      <div class="logo">Rank<span>RGV</span></div>
      <div class="tagline">rankrgv.com</div>
    </div>
  </div>
</body>
</html>
"""


def frontmatter(md_text: str) -> dict:
    m = re.match(r"^---\n(.*?)\n---", md_text, re.S)
    if not m:
        return {}
    fm = {}
    for line in m.group(1).splitlines():
        match = re.match(r'^(\w+):\s*"?([^"]*)"?\s*$', line)
        if match:
            fm[match.group(1)] = match.group(2)
    return fm


def title_font_size(title: str) -> int:
    length = len(title)
    if length <= 30:
        return 60
    if length <= 45:
        return 52
    if length <= 65:
        return 44
    return 38


def build_cards():
    cards = []
    for md_file in sorted(BLOG_CONTENT.glob("*.md")):
        fm = frontmatter(md_file.read_text(encoding="utf-8"))
        title = fm.get("title", md_file.stem)
        category = fm.get("category", "local-seo")
        theme = THEMES.get(category, THEMES["local-seo"])
        motif_fn = MOTIFS.get(category, motif_local_seo)

        html = CARD_TEMPLATE.format(
            accent=theme["accent"],
            accent_light=theme["accent_light"],
            glow=theme["glow"],
            motif_svg=motif_fn(theme["accent"], theme["accent_light"]),
            category_label=theme["label"],
            title=title,
            title_size=title_font_size(title),
        )
        out_html = HTML_OUT / f"{md_file.stem}.html"
        out_html.write_text(html, encoding="utf-8")
        cards.append(md_file.stem)
    return cards


def render_cards(slugs):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            viewport={"width": 1200, "height": 630},
            device_scale_factor=2,
        )
        for slug in slugs:
            page = context.new_page()
            html_file = HTML_OUT / f"{slug}.html"
            page.goto(html_file.as_uri(), wait_until="networkidle")
            out_path = PNG_OUT / f"{slug}.png"
            page.screenshot(path=str(out_path), clip={"x": 0, "y": 0, "width": 1200, "height": 630})
            page.close()
            print(f"  OK {slug}.png")
        browser.close()


if __name__ == "__main__":
    print("Building HTML cards from blog frontmatter...")
    slugs = build_cards()
    print(f"Built {len(slugs)} cards. Rendering to PNG (1200x630 @2x)...")
    render_cards(slugs)
    print(f"\nDone. {len(slugs)} header images saved to: {PNG_OUT}")
