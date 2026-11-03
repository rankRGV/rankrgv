#!/usr/bin/env node
/**
 * Builds the OKF (Open Knowledge Format v0.1) bundle at /okf/ from the built
 * site. Runs after `astro build` and `sitemap-lastmod.mjs`.
 *
 * Why: the bundle used to be a one-time export from an outside crawler, so it
 * went stale every time a page changed. Building it from dist/ keeps it in
 * sync with exactly what the site serves, on every local and Vercel build.
 *
 * How:
 *   - Every URL in the sitemap becomes one markdown file. Body = the page's
 *     <main> converted to markdown (scripts, forms, svgs, buttons dropped).
 *   - Frontmatter: type (Article for blog posts, else Page), title,
 *     description, resource, timestamp (the sitemap <lastmod>, when present).
 *   - Internal links point at the matching bundle file (/okf/....md); links
 *     to pages outside the bundle point at the live URL.
 *   - index.md lists every file, grouped by section.
 *
 * Nothing here is committed: the bundle is a build output. Do not hand edit.
 *
 * Usage: node scripts/okf-build.mjs   (wired into `npm run build`)
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';
import { tables } from 'turndown-plugin-gfm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://rankrgv.com';
const OUT_DIRS = [join(ROOT, 'dist'), join(ROOT, '.vercel', 'output', 'static')].filter(existsSync);

const decode = (s = '') =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

// "/" -> home.md, "/blog/x/" -> blog/x.md
const fileFor = (path) => {
  const p = path.replace(/^\/+|\/+$/g, '');
  return p ? `${p}.md` : 'home.md';
};

const htmlFor = (dir, path) => {
  const p = decodeURIComponent(path).replace(/^\/+|\/+$/g, '');
  const f = join(dir, p, 'index.html');
  return existsSync(f) ? f : null;
};

const sectionOf = (path) => {
  if (path === '/') return 'Core pages';
  if (path.startsWith('/es/')) return 'Español';
  if (path.startsWith('/blog/')) return path === '/blog/' ? 'Core pages' : 'Blog';
  if (path.startsWith('/service-areas/')) return 'Service areas';
  if (/^\/(pricing|get-started|contact|about)\//.test(path)) return 'Core pages';
  return 'Services';
};
const SECTION_ORDER = ['Core pages', 'Services', 'Service areas', 'Blog', 'Español'];

function makeTurndown(bundlePaths) {
  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
  td.use(tables);
  td.remove(['script', 'style', 'noscript', 'svg', 'form', 'iframe', 'button', 'picture', 'video', 'template']);
  // Turndown's built-in image rule wins over remove(), so drop images explicitly.
  td.addRule('img', { filter: 'img', replacement: () => '' });
  td.addRule('summary', {
    filter: 'summary',
    replacement: (content) => `\n\n**${content.trim()}**\n\n`,
  });
  td.addRule('links', {
    filter: 'a',
    replacement: (content, node) => {
      const text = content.replace(/\s+/g, ' ').trim();
      let href = node.getAttribute('href') || '';
      if (!text) return '';
      if (!href || href.startsWith('#')) return text;
      if (href.startsWith(SITE)) href = href.slice(SITE.length) || '/';
      if (href.startsWith('/')) {
        const [pathOnly, rest = ''] = href.split(/(?=[?#])/);
        const path = pathOnly.endsWith('/') ? pathOnly : `${pathOnly}/`;
        href = !rest && bundlePaths.has(path) ? `/okf/${fileFor(path)}` : `${SITE}${href}`;
      }
      return `[${text}](${href})`;
    },
  });
  return td;
}

function pageToMarkdown(html, td) {
  const doc = parse(html);
  const title = decode(doc.querySelector('title')?.text.trim());
  const description = decode(doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim());
  const main = doc.querySelector('main') || doc.querySelector('body');
  main.querySelectorAll('[aria-hidden="true"], [data-okf-skip]').forEach((el) => el.remove());
  // Flex rows put label and value in sibling spans; keep a space between them.
  const body = td
    .turndown(main.innerHTML.replace(/<\/(span|a|strong|em)>/gi, '</$1> '))
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { title, description, body };
}

async function main() {
  if (!OUT_DIRS.length) throw new Error('No build output found. Run astro build first.');
  const dist = OUT_DIRS[0];
  const xml = await readFile(join(dist, 'sitemap-0.xml'), 'utf8');
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, u]) => ({
    path: (u.match(/<loc>([^<]+)<\/loc>/)?.[1] || '').replace(SITE, '') || '/',
    lastmod: u.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.slice(0, 10),
  }));
  const bundlePaths = new Set(entries.map((e) => e.path));
  const td = makeTurndown(bundlePaths);

  const files = new Map();
  const listed = [];
  for (const { path, lastmod } of entries) {
    const src = htmlFor(dist, path);
    if (!src) continue;
    const { title, description, body } = pageToMarkdown(await readFile(src, 'utf8'), td);
    const isPost = path.startsWith('/blog/') && path !== '/blog/';
    const fm = [
      '---',
      `type: ${isPost ? 'Article' : 'Page'}`,
      `title: ${JSON.stringify(title)}`,
      description && `description: ${JSON.stringify(description)}`,
      `resource: ${JSON.stringify(`${SITE}${path}`)}`,
      lastmod && `timestamp: ${JSON.stringify(lastmod)}`,
      '---',
    ].filter(Boolean);
    const file = fileFor(path);
    files.set(file, `${fm.join('\n')}\n\n${body}\n`);
    listed.push({ file, title, description, section: sectionOf(path) });
  }

  const index = [
    '---',
    'okf_version: "0.1"',
    '---',
    '',
    '# Knowledge Bundle for rankrgv.com',
    '',
    'RankRGV is a McAllen based local SEO and marketing agency for the Rio Grande Valley. Each file below is one page of rankrgv.com as markdown. This bundle is rebuilt from the live site content on every deploy.',
    '',
  ];
  for (const section of SECTION_ORDER) {
    const items = listed.filter((l) => l.section === section);
    if (!items.length) continue;
    index.push(`## ${section}`, '');
    for (const l of items) index.push(`- [${l.title}](${l.file})${l.description ? ` - ${l.description}` : ''}`);
    index.push('');
  }
  files.set('index.md', index.join('\n'));

  for (const dir of OUT_DIRS) {
    const okf = join(dir, 'okf');
    await rm(okf, { recursive: true, force: true });
    for (const [file, content] of files) {
      const out = join(okf, file);
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, content);
    }
  }
  console.log(`okf-build: ${files.size - 1} pages + index.md written to /okf/.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
