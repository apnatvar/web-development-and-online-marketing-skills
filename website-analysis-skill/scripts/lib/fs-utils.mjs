import { access, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_IGNORES = new Set([
  '.git', '.next', '.nuxt', '.svelte-kit', 'node_modules', 'coverage',
  'audit-results', '.cache', '.turbo', 'vendor',
]);

const SENSITIVE_FILE_PATTERNS = [
  /^\.env(?:\.|$)/i,
  /(?:^|[-_.])(secret|secrets|credential|credentials)(?:[-_.]|$)/i,
  /\.(?:pem|key|p12|pfx)$/i,
];

export async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function readJson(target) {
  return JSON.parse(await readFile(target, 'utf8'));
}

export async function writeJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function ensureDirectory(target) {
  await mkdir(target, { recursive: true });
  return target;
}

export function isSensitiveFilename(filename) {
  return SENSITIVE_FILE_PATTERNS.some((pattern) => pattern.test(filename));
}

export async function walkFiles(root, options = {}) {
  const {
    ignores = DEFAULT_IGNORES,
    maximumFiles = 20000,
    maximumFileBytes = 2_000_000,
    includeSensitive = false,
  } = options;
  const resolvedRoot = path.resolve(root);
  const found = [];
  const queue = [resolvedRoot];

  while (queue.length > 0 && found.length < maximumFiles) {
    const current = queue.shift();
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (ignores.has(entry.name)) continue;
      if (!includeSensitive && isSensitiveFilename(entry.name)) continue;
      const absolute = path.join(current, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        queue.push(absolute);
      } else if (entry.isFile()) {
        const details = await stat(absolute);
        if (details.size <= maximumFileBytes) found.push(absolute);
      }
      if (found.length >= maximumFiles) break;
    }
  }
  return found;
}

export function toPosix(value) {
  return value.split(path.sep).join('/');
}

export function relativeDisplay(root, target) {
  return toPosix(path.relative(path.resolve(root), path.resolve(target))) || '.';
}

export function safeSlug(value, fallback = 'page') {
  const slug = String(value)
    .replace(/^https?:\/\//i, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 80);
  return slug || fallback;
}

export async function writeText(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, value, 'utf8');
}
