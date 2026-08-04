import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { HostTree } from '@angular-devkit/schematics';
import * as path from 'path';
import { describe, beforeEach, it, expect } from 'vitest';

const collectionPath = path.join(__dirname, '../../collection.json');

/** Every component the schematic copies into the consumer's app. */
const WIDGET_FILES = [
  'kendo-field.component.ts',
  'kendo-textinput.component.ts',
  'kendo-textarea.component.ts',
  'kendo-numerictextbox.component.ts',
  'kendo-checkbox.component.ts',
  'kendo-switch.component.ts',
  'kendo-radiogroup.component.ts',
  'kendo-dropdownlist.component.ts',
  'kendo-datepicker.component.ts',
  'kendo-button.component.ts',
  'kendo-flex.component.ts',
  'kendo-repeater.component.ts',
  'kendo-renderer.component.ts',
  'kendo-form.component.ts',
  'kendo-widget-loaders.ts',
];

function angularJson(polyfills: unknown): string {
  return JSON.stringify(
    {
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
                polyfills,
                styles: ['src/styles.scss'],
              },
            },
          },
        },
      },
    },
    null,
    2,
  );
}

describe('ng-add schematic', () => {
  let appTree: UnitTestTree;
  const runner = new SchematicTestRunner('golemui-kendo', collectionPath);

  beforeEach(() => {
    appTree = new UnitTestTree(new HostTree());
    appTree.create('/angular.json', angularJson(['zone.js']));
    appTree.create(
      '/package.json',
      JSON.stringify({ name: 'test-app', version: '0.0.0', dependencies: { '@angular/core': '^22.1.0' } }, null, 2),
    );
  });

  it('should add the GolemUI and Kendo dependencies to package.json', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@golemui/angular']).toBeDefined();
    expect(packageJson.dependencies['@golemui/core']).toBeDefined();
    expect(packageJson.dependencies['@golemui/dx']).toBeDefined();
    expect(packageJson.dependencies['@golemui/gui-validators']).toBeDefined();
    expect(packageJson.dependencies['@progress/kendo-angular-buttons']).toBeDefined();
    expect(packageJson.dependencies['@progress/kendo-angular-dateinputs']).toBeDefined();
    expect(packageJson.dependencies['@progress/kendo-angular-dropdowns']).toBeDefined();
    expect(packageJson.dependencies['@progress/kendo-angular-inputs']).toBeDefined();
    expect(packageJson.dependencies['@progress/kendo-theme-default']).toBeDefined();
  });

  // The generated widget components import '@golemui/dx' types indirectly through
  // golemui-kendo, and the DX pipeline is a runtime dependency of the catalog.
  it('should declare every package the generated code imports', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@golemui/gui-validators']).toBeDefined();
    expect(packageJson.dependencies['@angular/localize']).toBeDefined();
  });

  it('should trigger NodePackageInstallTask', async () => {
    await runner.runSchematic('ng-add', {}, appTree);
    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
  });

  it('should add the Kendo theme to angular.json styles', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: true }, appTree);
    const content = JSON.parse(tree.readContent('/angular.json'));
    const styles = content.projects['test-app'].architect.build.options.styles as string[];

    expect(styles).toContain('@progress/kendo-theme-default/dist/all.css');
  });

  // The old schematic added a stylesheet from a package it never installed.
  it('should only add styles from packages it installs', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: true }, appTree);
    const content = JSON.parse(tree.readContent('/angular.json'));
    const styles = content.projects['test-app'].architect.build.options.styles as string[];
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    for (const style of styles.filter((entry) => !entry.startsWith('src/'))) {
      const packageName = style.startsWith('@')
        ? style.split('/').slice(0, 2).join('/')
        : style.split('/')[0];
      expect(packageJson.dependencies[packageName], packageName).toBeDefined();
    }
  });

  it('should generate every widget file at the default path based on sourceRoot', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: true }, appTree);

    for (const file of WIDGET_FILES) {
      expect(tree.exists(`/src/app/kendo-widgets/${file}`), file).toBe(true);
    }
  });

  // `flex` and `repeater` are reserved core widget types: a form with any layout
  // or collection fails to render if the loader map is missing them.
  it('should register the reserved core widget types in the loader map', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: true }, appTree);
    const loaders = tree.readContent('/src/app/kendo-widgets/kendo-widget-loaders.ts');

    expect(loaders).toContain('KENDO_WIDGET_TYPES.flex');
    expect(loaders).toContain('KENDO_WIDGET_TYPES.repeater');
    expect(loaders).toContain('KENDO_WIDGET_TYPES.renderer');
  });

  it('should generate an example form that uses the kendo namespace', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: false }, appTree);
    const example = tree.readContent('/src/app/example/example-form.component.ts');

    expect(example).toContain("import { KendoFormComponent } from '../kendo-widgets/kendo-form.component';");
    expect(example).toContain("from 'golemui-kendo'");
    expect(example).toContain('kendo.inputs.textBox(');
    expect(example).toContain('kendo.actions.submitButton(');
    // The old gui-centric API is gone.
    expect(example).not.toContain('@golemui/gui-shared');
    expect(example).not.toContain('gui.inputs.custom');
  });

  it('should skip the example form when skipExample is true', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: true }, appTree);
    expect(tree.exists('/src/app/example/example-form.component.ts')).toBe(false);
  });

  it('should compute the relative import path for a custom widgetsPath', async () => {
    const tree = await runner.runSchematic(
      'ng-add',
      { widgetsPath: 'src/custom-widgets', skipExample: false },
      appTree,
    );

    expect(tree.exists('/src/custom-widgets/kendo-textinput.component.ts')).toBe(true);
    expect(tree.readContent('/src/app/example/example-form.component.ts')).toContain(
      "import { KendoFormComponent } from '../../custom-widgets/kendo-form.component';",
    );
  });

  // Left to peer resolution, npm picks a different patch of @angular/animations
  // than the installed @angular/common and the install fails outright.
  it('should pin @angular/localize and @angular/animations to the @angular/core version', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@angular/localize']).toBe('^22.1.0');
    expect(packageJson.dependencies['@angular/animations']).toBe('^22.1.0');
  });

  it('should add @angular/localize/init to array-shaped build polyfills', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const content = JSON.parse(tree.readContent('/angular.json'));
    const polyfills = content.projects['test-app'].architect.build.options.polyfills as string[];

    expect(polyfills).toContain('@angular/localize/init');
  });

  it('should add @angular/localize/init to object-shaped build polyfills', async () => {
    appTree.overwrite('/angular.json', angularJson({ static: ['zone.js'], dynamic: [] }));

    const tree = await runner.runSchematic('ng-add', {}, appTree);
    const content = JSON.parse(tree.readContent('/angular.json'));
    const polyfills = content.projects['test-app'].architect.build.options.polyfills as {
      static: string[];
    };

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

  // Kendo v24 types value/min/max as non-nullable number, so `?? null` bindings
  // fail to compile in the consumer's app.
  it('should generate the numerictextbox widget without null bindings', async () => {
    const tree = await runner.runSchematic('ng-add', { skipExample: true }, appTree);
    const content = tree.readContent('/src/app/kendo-widgets/kendo-numerictextbox.component.ts');

    expect(content).not.toContain('?? null');
    expect(content).toContain('[value]="numericValue"');
    expect(content).toContain('[min]="numericMin"');
    expect(content).toContain('[max]="numericMax"');
    expect(content).toContain('protected get numericValue(): number');
  });
});
