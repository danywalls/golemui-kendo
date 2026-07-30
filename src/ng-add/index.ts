import { Rule, SchematicContext, Tree, apply, url, move, mergeWith, chain, applyTemplates } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
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

const KENDO_STYLES = [
  '@golemui/gui-components/index.css',
  '@progress/kendo-theme-default/dist/all.css',
];

function addPackageJsonDependencies(tree: Tree): void {
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
    addPackageJsonDependencies(tree);

    context.logger.info('Installing packages...');
    context.addTask(new NodePackageInstallTask());

    addStyles(angularJson, projectName);
    tree.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 2));

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
