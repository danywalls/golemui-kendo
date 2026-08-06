#!/usr/bin/env node
// ===================================================
// Links a local golemui checkout into the demo app.
//
// Packs the @golemui/* packages from a local checkout into .golemui-packages/
// and installs them into demo/node_modules so the demo runs against local
// golemui changes instead of the published versions.
//
// Usage:
//   npm run link:golemui -- /path/to/golemui
//   GOLEMUI_REPO=/path/to/golemui npm run link:golemui
// ===================================================

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const golemuiRepo = process.argv[2] || process.env.GOLEMUI_REPO;

if (!golemuiRepo) {
  console.error('Usage: npm run link:golemui -- <path-to-golemui-checkout>');
  console.error('       or set the GOLEMUI_REPO environment variable.');
  process.exit(1);
}

const here = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = join(here, '.golemui-packages');
const demoDir = join(here, 'demo');
const PACKAGES = ['core', 'dx', 'gui-validators', 'angular'];

mkdirSync(packagesDir, { recursive: true });

const candidateDirs = (name) => [
  join(golemuiRepo, 'packages', name),
  join(golemuiRepo, 'dist', name),
  join(golemuiRepo, name),
];

function pack(name) {
  for (const dir of candidateDirs(name)) {
    const pkgJson = join(dir, 'package.json');
    if (!existsSync(pkgJson)) continue;
    try {
      const actualName = JSON.parse(readFileSync(pkgJson, 'utf8')).name;
      const packed = execFileSync('npm', ['pack', '--pack-destination', packagesDir], {
        cwd: dir,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'inherit'],
      });
      const tarball = join(packagesDir, packed.trim().split('\n').pop());
      console.log(`Packed ${actualName} -> ${tarball}`);
      return tarball;
    } catch (err) {
      console.warn(`Failed to pack ${name} from ${dir}: ${err.message}`);
    }
  }
  console.warn(`Skipping @golemui/${name}: no packable source found under ${golemuiRepo}`);
  return null;
}

let linked = 0;
for (const name of PACKAGES) {
  const tarball = pack(name);
  if (!tarball) continue;
  execFileSync(
    'npm',
    ['install', '--no-save', '--no-audit', '--no-fund', '--prefix', demoDir, tarball],
    { stdio: 'inherit' }
  );
  linked++;
}

if (linked === 0) {
  console.error(`No @golemui packages were found under ${golemuiRepo}`);
  process.exit(1);
}
console.log(`Linked ${linked} @golemui package(s) into the demo app.`);
