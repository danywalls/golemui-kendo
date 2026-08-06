#!/usr/bin/env node
// ===================================================
// Marks the compiled ES module output (dist/lib) as ESM.
//
// tsconfig.lib.json emits ES2022 modules, but the package root has no
// "type": "module". Without a nested package.json declaring it, Node would
// treat dist/lib/*.js as CommonJS and fail on the ESM import/export syntax.
// ===================================================

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const libDir = join(packageRoot, 'dist', 'lib');

mkdirSync(libDir, { recursive: true });
writeFileSync(join(libDir, 'package.json'), JSON.stringify({ type: 'module' }, null, 2) + '\n');
console.log('Wrote dist/lib/package.json with type: module');
