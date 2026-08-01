import { Rule, SchematicContext, Tree, apply, url, move, mergeWith, chain, applyTemplates } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { spawnSync } from 'child_process';
import * as path from 'path';
import type { Schema } from './schema';

const KENDO_DEPENDENCIES: Record<string, string> = {
  '@golemui/angular': '^1.0.0',
  '@golemui/core': '^1.0.0',
  '@golemui/gui-angular': '^1.0.0',
  '@golemui/gui-shared': '^1.0.0',
  '@progress/kendo-angular-buttons': '^24.0.0',
  '@progress/kendo-angular-inputs': '^24.0.0',
  '@progress/kendo-theme-default': '^14.0.0',
};

const KENDO_LICENSING = '@progress/kendo-licensing';
const KENDO_LICENSING_VERSION = '^1.11.2';
const LOCALIZE_POLYFILL = '@angular/localize/init';
const LOCALIZE_FALLBACK_VERSION = '^20.0.0 || ^21.0.0 || ^22.0.0';

const KENDO_STYLES = [
  '@golemui/gui-components/index.css',
  '@progress/kendo-theme-default/dist/all.css',
];

function getAngularVersionString(tree: Tree): string | undefined {
  const packageJsonPath = '/package.json';
  const packageJsonBuffer = tree.read(packageJsonPath);
  if (!packageJsonBuffer) return undefined;

  const packageJson = JSON.parse(packageJsonBuffer.toString());
  const version = packageJson.dependencies?.['@angular/core'] ?? packageJson.devDependencies?.['@angular/core'];
  return typeof version === 'string' ? version : undefined;
}

function addPackageJsonDependencies(tree: Tree, kendoLicense: boolean): void {
  const packageJsonPath = '/package.json';
  const packageJsonBuffer = tree.read(packageJsonPath);
  if (!packageJsonBuffer) return;

  const packageJson = JSON.parse(packageJsonBuffer.toString());
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }

  for (const [pkg, version] of Object.entries(KENDO_DEPENDENCIES)) {
    if (!packageJson.dependencies[pkg]) {
      packageJson.dependencies[pkg] = version;
    }
  }

  if (!packageJson.dependencies['@angular/localize']) {
    packageJson.dependencies['@angular/localize'] = getAngularVersionString(tree) ?? LOCALIZE_FALLBACK_VERSION;
  }

  if (kendoLicense && !packageJson.dependencies[KENDO_LICENSING]) {
    packageJson.dependencies[KENDO_LICENSING] = KENDO_LICENSING_VERSION;
  }

  tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function addStyles(angularJson: Record<string, unknown>, projectName: string): void {
  const project = angularJson['projects'] as Record<string, Record<string, unknown>> | undefined;
  if (!project?.[projectName]) return;

  const build = project[projectName]['architect'] as Record<string, unknown> | undefined
    ?? project[projectName]['targets'] as Record<string, unknown> | undefined;
  if (!build) return;

  const options = (build['build'] as Record<string, unknown> | undefined)?.['options'] as Record<string, unknown> | undefined;
  if (!options) return;

  const styles = (options['styles'] as string[]) ?? [];
  const existing = new Set(styles);
  for (const style of KENDO_STYLES) {
    if (!existing.has(style)) {
      styles.push(style);
    }
  }
  options['styles'] = styles;
}

function addLocalizePolyfill(angularJson: Record<string, unknown>, projectName: string): void {
  const project = angularJson['projects'] as Record<string, Record<string, unknown>> | undefined;
  if (!project?.[projectName]) return;

  const build = project[projectName]['architect'] as Record<string, unknown> | undefined
    ?? project[projectName]['targets'] as Record<string, unknown> | undefined;
  if (!build) return;

  const options = (build['build'] as Record<string, unknown> | undefined)?.['options'] as Record<string, unknown> | undefined;
  if (!options) return;

  const polyfills = options['polyfills'];
  if (Array.isArray(polyfills)) {
    if (!polyfills.includes(LOCALIZE_POLYFILL)) {
      polyfills.push(LOCALIZE_POLYFILL);
    }
  } else if (polyfills && typeof polyfills === 'object') {
    const staticPolyfills = (polyfills as Record<string, unknown>)['static'];
    if (Array.isArray(staticPolyfills)) {
      if (!staticPolyfills.includes(LOCALIZE_POLYFILL)) {
        staticPolyfills.push(LOCALIZE_POLYFILL);
      }
    } else {
      (polyfills as Record<string, unknown>)['static'] = [LOCALIZE_POLYFILL];
    }
  } else {
    options['polyfills'] = [LOCALIZE_POLYFILL];
  }
}

function activateKendoLicense(context: SchematicContext): void {
  const commands: Array<[string, string]> = [
    ['kendo-ui-license', 'refresh'],
    ['kendo-ui-license', 'activate'],
  ];

  context.logger.info('Activating your Kendo UI for Angular license...');
  context.logger.info('A browser window will open to sign in with your Telerik account.');

  for (const [cli, action] of commands) {
    try {
      const result = spawnSync('npx', [cli, action], { stdio: 'inherit', shell: process.platform === 'win32' });
      if (result.status !== 0) {
        context.logger.warn(`"npx ${cli} ${action}" exited with code ${result.status}.`);
      }
    } catch (error) {
      context.logger.warn(`Could not run "npx ${cli} ${action}" automatically.`);
      context.logger.warn('Run it manually after install: npx kendo-ui-license refresh && npx kendo-ui-license activate');
      return;
    }
  }
}

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularJsonPath = '/angular.json';

    const angularJsonBuffer = tree.read(angularJsonPath);
    if (!angularJsonBuffer) {
      throw new Error('Could not find angular.json');
    }

    const angularJson = JSON.parse(angularJsonBuffer.toString());
    const projects = angularJson['projects'] as Record<string, Record<string, unknown>> | undefined;
    if (!projects) {
      throw new Error('No projects found in angular.json');
    }

    const projectKeys = Object.keys(projects);
    const projectName = options.project ?? projectKeys[0];
    const projectConfig = projectName ? projects[projectName] : undefined;
    if (!projectName || !projectConfig) {
      throw new Error(`Project "${projectName}" not found in angular.json`);
    }

    const sourceRoot = (projectConfig['sourceRoot'] as string | undefined) ?? 'src';
    const defaultWidgetsPath = `${sourceRoot}/app/kendo-widgets`;
    const widgetsPath = options.widgetsPath ?? defaultWidgetsPath;
    const examplePath = `${sourceRoot}/app/example`;

    context.logger.info('Adding GolemUI and Kendo UI dependencies to package.json...');
    addPackageJsonDependencies(tree, !!options.kendoLicense);

    context.logger.info('Installing packages...');
    context.addTask(new NodePackageInstallTask());

    addStyles(angularJson, projectName);
    addLocalizePolyfill(angularJson, projectName);
    tree.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 2));

    if (options.kendoLicense) {
      if (process.stdin.isTTY) {
        activateKendoLicense(context);
      } else {
        context.logger.info('Kendo license activation skipped (non-interactive terminal).');
        context.logger.info('Run manually after install: npx kendo-ui-license refresh && npx kendo-ui-license activate');
      }
    } else {
      context.logger.warn('Kendo UI for Angular requires a commercial license for production use. Run "ng add golemui-kendo --kendoLicense" to install and activate one.');
    }

    const widgetFiles = apply(url('./files/widgets'), [
      move(widgetsPath),
    ]);
    const rules: Rule[] = [mergeWith(widgetFiles)];

    if (!options.skipExample) {
      let widgetsImportPath = path.relative(examplePath, path.join(widgetsPath, 'kendo-widget-loaders')).replace(/\\/g, '/');
      if (!widgetsImportPath.startsWith('.')) {
        widgetsImportPath = `./${widgetsImportPath}`;
      }

      context.logger.info('Generating example form...');
      const exampleFiles = apply(url('./files/example'), [
        applyTemplates({
          widgetsImportPath,
        }),
        move(examplePath),
      ]);
      rules.push(mergeWith(exampleFiles));
    }

    return chain(rules);
  };
}
