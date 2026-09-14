import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';

const root = process.cwd();
const required = ['myst.yml', 'index.md', '.github/workflows/ci.yml', '.github/workflows/deploy.yml', 'pwa/service-worker.js'];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) throw new Error(`Missing required files: ${missing.join(', ')}`);

const config = YAML.parse(fs.readFileSync(path.join(root, 'myst.yml'), 'utf8'));
const errors = [];
if (!config.project?.title) errors.push('project.title is required');
if (!config.project?.short_title) errors.push('project.short_title is required');
if (config.project?.open_access !== true) errors.push('project.open_access must be true');
if (!config.project?.github) errors.push('project.github is required');
if (!Array.isArray(config.project?.toc) || !config.project.toc.length) errors.push('project.toc must contain at least one page');

function collectTocFiles(items) {
  return items.flatMap((item) => [
    ...(item.file ? [item.file] : []),
    ...(Array.isArray(item.children) ? collectTocFiles(item.children) : []),
  ]);
}

const tocFiles = collectTocFiles(config.project?.toc ?? []);
const duplicateTocFiles = tocFiles.filter((file, index) => tocFiles.indexOf(file) !== index);
if (duplicateTocFiles.length) errors.push(`Duplicate TOC files: ${[...new Set(duplicateTocFiles)].join(', ')}`);

for (const file of tocFiles) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`TOC file does not exist: ${file}`);
}

const chapterFiles = fs.readdirSync(path.join(root, 'chapters'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => `chapters/${file}`)
  .sort();
const unlistedChapters = chapterFiles.filter((file) => !tocFiles.includes(file));
if (unlistedChapters.length) errors.push(`Chapters missing from TOC: ${unlistedChapters.join(', ')}`);

for (const file of tocFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (/\{[{%]\s*(?:site|page)\./.test(source)) errors.push(`Legacy Jekyll expression remains in ${file}`);
  if (/(?:^|[('/"=])(?:\.\.\/)*old\//m.test(source)) errors.push(`Legacy old/ path remains in ${file}`);

  const targets = [
    ...[...source.matchAll(/\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g)].map((match) => match[1]),
    ...[...source.matchAll(/^\[[^\]]+\]:\s+(\S+)/gm)].map((match) => match[1]),
    ...[...source.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map((match) => match[1]),
  ];
  for (const rawTarget of targets) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(rawTarget)) continue;
    const target = rawTarget.replace(/^<|>$/g, '').split(/[?#]/, 1)[0];
    if (!path.extname(target)) continue;
    let decoded = target;
    try {
      decoded = decodeURIComponent(target);
    } catch {
      // MyST will report malformed URL encoding during the strict build.
    }
    const resolved = path.resolve(root, path.dirname(file), decoded);
    if (!fs.existsSync(resolved)) errors.push(`Missing local target in ${file}: ${rawTarget}`);
  }
}

if (tocFiles.length !== 126) errors.push(`Expected 126 site pages, found ${tocFiles.length}`);
if (errors.length) throw new Error(errors.join('\n'));

console.log(`Book structure, ${tocFiles.length} TOC pages, and old/ independence are valid.`);
