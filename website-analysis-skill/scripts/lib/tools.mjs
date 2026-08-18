import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const WINDOWS_CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];

function runVersion(command, args = ['--version']) {
  try {
    return execFileSync(command, args, { encoding: 'utf8', timeout: 10_000, windowsHide: true }).trim();
  } catch {
    return null;
  }
}

export function findChrome(environment = process.env) {
  const candidates = [
    environment.CHROME_PATH,
    ...(process.platform === 'win32' ? WINDOWS_CHROME_PATHS : [
      '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ]),
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

export function findLighthouse(skillRoot) {
  const cliModule = path.join(skillRoot, 'node_modules', 'lighthouse', 'cli', 'index.js');
  const windowsBin = path.join(skillRoot, 'node_modules', '.bin', 'lighthouse.cmd');
  const unixBin = path.join(skillRoot, 'node_modules', '.bin', 'lighthouse');
  if (existsSync(cliModule)) return cliModule;
  if (existsSync(windowsBin)) return windowsBin;
  if (existsSync(unixBin)) return unixBin;
  return null;
}

export function detectChromeVersion(chromePath) {
  if (!chromePath) return null;
  if (process.platform === 'win32') {
    const escaped = chromePath.replace(/'/g, "''");
    const powershell = path.join(process.env.WINDIR || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
    return runVersion(powershell, ['-NoProfile', '-Command', `(Get-Item -LiteralPath '${escaped}').VersionInfo.ProductVersion`]);
  }
  return runVersion(chromePath);
}

function versionAtLeast(version, minimum) {
  const actual = String(version).split('.').map(Number);
  const required = String(minimum).split('.').map(Number);
  for (let index = 0; index < Math.max(actual.length, required.length); index += 1) {
    const left = actual[index] ?? 0;
    const right = required[index] ?? 0;
    if (left !== right) return left > right;
  }
  return true;
}

export function checkTools(skillRoot, options = {}) {
  const nodeVersion = process.versions.node;
  const chromePath = findChrome(options.environment);
  const lighthousePath = findLighthouse(skillRoot);
  let lighthouseVersion = null;
  try {
    lighthouseVersion = JSON.parse(readFileSync(path.join(skillRoot, 'node_modules', 'lighthouse', 'package.json'), 'utf8')).version;
  } catch {}
  const chromeVersion = detectChromeVersion(chromePath);
  const playwrightAvailable = existsSync(path.join(skillRoot, 'node_modules', 'playwright-core'))
    || existsSync(path.join(skillRoot, 'node_modules', 'playwright'));

  return {
    checkedAt: new Date().toISOString(),
    node: { available: versionAtLeast(nodeVersion, '22.19.0'), version: nodeVersion, required: '>=22.19.0' },
    lighthouse: { available: Boolean(lighthousePath), path: lighthousePath, version: lighthouseVersion, required: '13.4.1' },
    chrome: { available: Boolean(chromePath), path: chromePath, version: chromeVersion, baseline: '150.0.7871.129' },
    playwright: { available: playwrightAvailable, required: false },
    network: { available: null, note: 'Target reachability is checked during public audits.' },
    sandboxWarnings: [
      'Package installation may require network permission.',
      'Chrome launch and local server processes may require sandbox approval.',
      'Outbound access to the audited URL may be restricted.',
    ],
  };
}

export function requiredToolFailures(capabilities, { needsLighthouse = false, needsNetwork = false } = {}) {
  const failures = [];
  if (!capabilities.node.available) failures.push('Node.js 22.19 or newer is required by Lighthouse 13.4.1.');
  if (needsLighthouse && !capabilities.lighthouse.available) failures.push('Lighthouse 13.4.1 is not installed; run npm install in the skill directory.');
  if (needsLighthouse && !capabilities.chrome.available) failures.push('Chrome/Chromium was not found; set CHROME_PATH to the executable.');
  if (needsNetwork) failures.push('Confirm that the sandbox permits outbound access to the target before relying on public-URL checks.');
  return failures;
}
