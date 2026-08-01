import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { HostTree } from '@angular-devkit/schematics';
import * as path from 'path';
import { describe, beforeEach, it, expect } from 'vitest';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('ng-add schematic', () => {
  let appTree: UnitTestTree;
  const runner = new SchematicTestRunner('golemui-kendo', collectionPath);

  beforeEach(() => {
    const hostTree = new HostTree();
    appTree = new UnitTestTree(hostTree);

    appTree.create('/angular.json', JSON.stringify({
      $schema: './node_modules/@angular/cli/lib/config/schema.json',
      version: 1,
      newProjectRoot: 'projects',
      projects: {
        'test-app': {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          prefix: 'app',
          architect: {
            build: {
              builder: '@angular/build:application',
              options: {
                browser: 'src/main.ts',
                polyfills: ['zone.js'],
                styles: ['src/styles.scss'],
              },
            },
          },
        },
      },
    }, null, 2));

    appTree.create('/package.json', JSON.stringify({
      name: 'test-app',
      version: '0.0.0',
      dependencies: {
        '@angular/core': '^22.1.0',
      },
    }, null, 2));
  });

  it('should add dependencies to package.json', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies['@golemui/angular']).toBeDefined();
    expect(packageJson.dependencies['@golemui/core']).toBeDefined();
    expect(packageJson.dependencies['@progress/kendo-angular-buttons']).toBeDefined();
    expect(packageJson.dependencies['@progress/kendo-angular-inputs']).toBeDefined();
    expect(packageJson.dependencies['@progress/kendo-theme-default']).toBeDefined();
  });

  it('should trigger NodePackageInstallTask', async () => {
    await runner.runSchematic('ng-add', {}, appTree);
    expect(runner.tasks.some(t => t.name === 'node-package')).toBe(true);
  });

  it('should add styles to angular.json', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: true }, appTree);
    const content = JSON.parse(tree.readContent('/angular.json'));
    const project = content.projects['test-app'];
    const styles = (project.architect?.build?.options?.styles ?? project.targets?.build?.options?.styles) as string[];
    expect(styles).toContain('@golemui/gui-components/index.css');
    expect(styles).toContain('@progress/kendo-theme-default/dist/all.css');
  });

  it('should generate widget files at default path based on sourceRoot', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: true }, appTree);
    expect(tree.exists('/src/app/kendo-widgets/kendo-textinput.component.ts')).toBe(true);
    expect(tree.exists('/src/app/kendo-widgets/kendo-textarea.component.ts')).toBe(true);
    expect(tree.exists('/src/app/kendo-widgets/kendo-numerictextbox.component.ts')).toBe(true);
    expect(tree.exists('/src/app/kendo-widgets/kendo-checkbox.component.ts')).toBe(true);
    expect(tree.exists('/src/app/kendo-widgets/kendo-switch.component.ts')).toBe(true);
    expect(tree.exists('/src/app/kendo-widgets/kendo-button.component.ts')).toBe(true);
    expect(tree.exists('/src/app/kendo-widgets/kendo-widget-loaders.ts')).toBe(true);
  });

  it('should generate example form when skipExample is false and interpolate correct import path', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: false }, appTree);
    const exampleFileContent = tree.readContent('/src/app/example/example-form.component.ts');
    expect(exampleFileContent).toContain("import { kendoWidgetLoaders } from '../kendo-widgets/kendo-widget-loaders';");
    expect(exampleFileContent).not.toContain('CUSTOM_ELEMENTS_SCHEMA');
  });

  it('should skip example form when skipExample is true', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: true }, appTree);
    expect(tree.exists('/src/app/example/example-form.component.ts')).toBe(false);
  });

  it('should accept custom widgetsPath and calculate relative import path in example form correctly', async () => {
    const tree = await runner.runSchematic('ng-add', {
      widgetsPath: 'src/custom-widgets',
      skipExample: false,
    }, appTree);

    expect(tree.exists('/src/custom-widgets/kendo-textinput.component.ts')).toBe(true);
    const exampleFileContent = tree.readContent('/src/app/example/example-form.component.ts');
    expect(exampleFileContent).toContain("import { kendoWidgetLoaders } from '../../custom-widgets/kendo-widget-loaders';");
  });

  it('should add @angular/localize dependency matching @angular/core version', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@angular/localize']).toBe('^22.1.0');
  });

  it('should add @angular/localize/init to build polyfills', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const content = JSON.parse(tree.readContent('/angular.json'));
    const project = content.projects['test-app'];
    const polyfills = (project.architect?.build?.options?.polyfills ?? project.targets?.build?.options?.polyfills) as string[];

    expect(polyfills).toContain('@angular/localize/init');
  });

  it('should add @angular/localize/init to static polyfills when polyfills is an object', async () => {
    appTree.overwrite('/angular.json', JSON.stringify({
      $schema: './node_modules/@angular/cli/lib/config/schema.json',
      version: 1,
      newProjectRoot: 'projects',
      projects: {
        'test-app': {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          prefix: 'app',
          architect: {
            build: {
              builder: '@angular/build:application',
              options: {
                browser: 'src/main.ts',
                polyfills: { static: ['zone.js'], dynamic: [] },
                styles: ['src/styles.scss'],
              },
            },
          },
        },
      },
    }, null, 2));

    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const content = JSON.parse(tree.readContent('/angular.json'));
    const project = content.projects['test-app'];
    const polyfills = (project.architect?.build?.options?.polyfills ?? project.targets?.build?.options?.polyfills) as { static: string[] };

    expect(polyfills.static).toContain('@angular/localize/init');
  });

  it('should add @progress/kendo-licensing when kendoLicense is true', async () => {
    const tree = await runner.runSchematic('ng-add', { kendoLicense: true }, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@progress/kendo-licensing']).toBe('^1.11.2');
  });

  it('should not add @progress/kendo-licensing when kendoLicense is false', async () => {
    const tree = await runner.runSchematic('ng-add', { kendoLicense: false }, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@progress/kendo-licensing']).toBeUndefined();
  });

  it('should generate numerictextbox widget without null bindings (Kendo v24 non-nullable number inputs)', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: true }, appTree);
    const content = tree.readContent('/src/app/kendo-widgets/kendo-numerictextbox.component.ts');

    expect(content).not.toContain('?? null');
    expect(content).toContain('[value]="numericValue"');
    expect(content).toContain('[min]="numericMin"');
    expect(content).toContain('[max]="numericMax"');
    expect(content).toContain('protected get numericValue(): number');
    expect(content).toContain('protected get numericMin(): number');
    expect(content).toContain('protected get numericMax(): number');
  });
});
