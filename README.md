# golemui-kendo 🚀

[![npm version](https://img.shields.io/npm/v/golemui-kendo.svg)](https://www.npmjs.com/package/golemui-kendo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Angular CLI](https://img.shields.io/badge/Angular-v20+-dd0031.svg)](https://angular.dev)

Community-driven **Progress Kendo UI** widget set for [GolemUI](https://golemui.com/) in Angular applications.

[GolemUI](https://golemui.com/) is a powerful schema-driven UI engine for building dynamic forms and user interfaces. Since GolemUI 1.2.0, third-party widget sets can provide their **own authoring API** through [`@golemui/dx`](https://golemui.com/dx/extending/widget-sets/overview/). `golemui-kendo` uses exactly that: it ships a typed `kendo.*` authoring namespace with its own selectors, plus the Angular components that render it — generated into your app by `ng add`. No `gui.*` fallback, no `gui.inputs.custom(...)` indirection.

```typescript
import { kendo } from 'golemui-kendo';

const form = [
  kendo.inputs.textBox('email', { validator: { required: true, format: 'email' } }),
  kendo.inputs.passwordBox('password', { validator: { required: true, minLength: 8 } }),
  kendo.actions.submitButton({ label: 'Sign in', disabled: { when: '$formIsInvalid' } }),
];
```

---

## 📦 Quick Start

Add `golemui-kendo` to your existing Angular project:

```bash
ng add golemui-kendo
```

### What this command does automatically:

1. 📥 **Installs Dependencies**: Adds `@golemui/angular`, `@golemui/core`, `@golemui/dx`, `@golemui/gui-validators` (all `^1.2.0`) and the `@progress/kendo-angular-*` packages to your `package.json`.
2. 🌍 **Configures Localization**: Adds `@angular/localize` and `@angular/animations` (pinned to your Angular version) and registers `@angular/localize/init` in your `polyfills`, required by the Kendo widgets at runtime.
3. 🎨 **Configures Styles**: Includes `@progress/kendo-theme-default/dist/all.css` in your `angular.json`.
4. ⚙️ **Generates Kendo Widgets**: Creates the widget components (`kendo-textinput`, `kendo-dropdownlist`, `kendo-datepicker`, ...), the `<kendo-form>` host, and the `kendoWidgetLoaders` mapping in your project.
5. 📝 **Generates Example Form** *(Optional)*: Creates an example component demonstrating the `kendo.*` authoring API.

### One manual step

Kendo's popup-based widgets (`dropDownList`, `datePicker`) need Angular animations, so add `provideAnimations()` to your application providers:

```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), /* ... */],
};
```

Without it, those two widgets report "widget could not be loaded" while everything else renders normally.

---

## ⚙️ Options

You can pass options to customize the installation:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--project` | `string` | First project in `angular.json` | Target Angular project name |
| `--skipExample` | `boolean` | `false` | Skip generation of the example form component |
| `--widgetsPath` | `string` | `<sourceRoot>/app/kendo-widgets` | Directory path where Kendo widget components will be generated |
| `--kendoLicense` | `boolean` | `false` | Install `@progress/kendo-licensing` and activate your Kendo UI for Angular (Telerik) license |

### Examples

```bash
# Skip generating the example component
ng add golemui-kendo --skipExample

# Customize widget output directory
ng add golemui-kendo --widgetsPath src/app/shared/kendo-widgets

# Install and activate a Kendo UI for Angular (Telerik) license
ng add golemui-kendo --kendoLicense
```

> **License note**: Kendo UI for Angular is commercial software. If you answer **yes** to the `kendoLicense` prompt, the schematic installs `@progress/kendo-licensing` and tries to run `npx kendo-ui-license refresh && npx kendo-ui-license activate` (a browser window opens to sign in with your Telerik account). If activation can't run, `ng add` still completes and prints the manual commands. Without a license the app still renders, but you should not use Kendo widgets in production.

---

## 💡 Usage Example

Once installed, author forms with the `kendo.*` namespace and render them with the generated `<kendo-form>`:

```typescript
import { Component } from '@angular/core';
import type { FormSubmitEvent } from '@golemui/core';
import { kendo, type KendoFormInitConfig } from 'golemui-kendo';
import { KendoFormComponent } from './kendo-widgets/kendo-form.component';

const loginFormDef = [
  kendo.inputs.textBox('email', {
    label: 'Email Address',
    placeholder: 'user@example.com',
    clearButton: true,
    validator: { required: true, format: 'email' },
  }),
  kendo.inputs.passwordBox('password', {
    hint: 'At least 8 characters',
    validator: { required: true, minLength: 8 },
  }),
  kendo.inputs.checkbox('rememberMe', { label: 'Remember Me' }),
  kendo.actions.submitButton({ label: 'Sign In', disabled: { when: '$formIsInvalid' } }),
];

// Selectors decorate widgets after the fact: by type, tag, or uid.
const loginSelectors = [kendo.selectors.inputs({ override: { kuiSize: 'medium' } })];

@Component({
  selector: 'app-login-form',
  imports: [KendoFormComponent],
  template: `
    <h2>Sign In</h2>
    <kendo-form [config]="config" (formSubmit)="onFormSubmit($event)"></kendo-form>
  `,
})
export class LoginFormComponent {
  protected config: KendoFormInitConfig = {
    formDef: loginFormDef,
    formSelectors: loginSelectors,
  };

  protected onFormSubmit(event: FormSubmitEvent) {
    console.log('Submitted data:', event.data);
  }
}
```

### The widget catalog

| Group | Builders |
| :--- | :--- |
| `kendo.inputs` | `textBox`, `passwordBox`, `textArea`, `numericTextBox`, `checkbox`, `switch`, `radioGroup`, `dropDownList`, `datePicker`, `repeater` |
| `kendo.actions` | `button`, `submitButton` |
| `kendo.displays` | `render` (mount any Angular component) |
| `kendo.layouts` | `flex`, `row`, `column` |
| `kendo.selectors` | one method per widget type plus `inputs`, `actions`, `displays`, `layouts` umbrellas and the `tag` / `tagsAnd` / `tagsOr` / `state` scopes |

See [docs/architecture.md](docs/architecture.md) for how the set is wired together, and the [GolemUI widget set docs](https://golemui.com/dx/extending/widget-sets/overview/) for the underlying API.

### Extending the catalog

The prop types behind every built-in widget are exported from `golemui-kendo`, so a custom widget decorator stays consistent with the built-ins:

- `KendoHintProps` — a Kendo form hint rendered under the control
- `KendoInputAppearanceProps` — the `kuiSize` / `rounded` / `fillMode` appearance trio shared by most inputs
- `KendoTextInputProps` — the text input extras (`placeholder`, `clearButton`, `maxlength`, `title`)

```ts
import type { KendoHintProps, KendoInputAppearanceProps } from 'golemui-kendo';

interface MyCustomInputProps extends KendoHintProps, KendoInputAppearanceProps {
  // custom props...
}
```

---

## 🕹️ Demo

The [demo/](demo/) app is a runnable showcase with seven pages (catalog, layouts, selectors, states, repeater, events, JSON):

```bash
npm install
npm --prefix demo install
npm run demo
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and submission process.

```bash
npm install          # installs GolemUI 1.2.0 from npm
npm run build        # builds the library and the schematic
npm run typecheck    # typechecks the library, its tests, and the schematic
npm test             # rebuilds the schematic, then runs the vitest specs
```

---

## 🔗 Related Projects & Links

* 🌐 **GolemUI Website**: [https://golemui.com](https://golemui.com/)
* 📦 **GolemUI Core Repository**: [https://github.com/golemui/golemui](https://github.com/golemui/golemui)
* 🧩 **Widget Set Authoring Docs**: [https://golemui.com/dx/extending/widget-sets/overview/](https://golemui.com/dx/extending/widget-sets/overview/)
* 🎨 **Progress Kendo UI for Angular**: [https://www.telerik.com/kendo-angular-ui](https://www.telerik.com/kendo-angular-ui)

---

## 👤 Maintainer

Maintained with ❤️ by **Dany Paredes** ([@danyparedes](https://github.com/danywalls)) for the [GolemUI](https://golemui.com/) ecosystem.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
