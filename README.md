# @golemui/kendo 🚀

[![npm version](https://img.shields.io/npm/v/@golemui/kendo.svg)](https://www.npmjs.com/package/@golemui/kendo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Angular CLI](https://img.shields.io/badge/Angular-v20+-dd0031.svg)](https://angular.dev)

Community-driven **Progress Kendo UI** integration for [GolemUI](https://golemui.com/) in Angular applications.

[GolemUI](https://golemui.com/) is a powerful schema-driven UI engine for building dynamic forms and user interfaces. `@golemui/kendo` provides ready-to-use adapter components for Kendo UI widgets, allowing developers to use Kendo UI components natively within GolemUI forms (`<gui-form>`).

---

## 📦 Quick Start

Add `@golemui/kendo` to your existing Angular project:

```bash
ng add @golemui/kendo
```

### What this command does automatically:
1. 📥 **Installs Dependencies**: Adds `@golemui/angular`, `@golemui/core`, `@golemui/gui-angular`, `@golemui/gui-shared`, and `@progress/kendo-angular-*` packages to your `package.json`.
2. 🎨 **Configures Styles**: Includes `@golemui/gui-components/index.css` and `@progress/kendo-theme-default/dist/all.css` in your `angular.json`.
3. ⚙️ **Generates Kendo Widgets**: Creates Kendo UI widget adapter components (`kendo-button`, `kendo-checkbox`, `kendo-textinput`) and the `kendoWidgetLoaders` mapping in your project.
4. 📝 **Generates Example Form** *(Optional)*: Creates an example component demonstrating GolemUI + Kendo UI integration.

---

## ⚙️ Options

You can pass options to customize the installation:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--project` | `string` | First project in `angular.json` | Target Angular project name |
| `--skipExample` | `boolean` | `false` | Skip generation of the example form component |
| `--widgetsPath` | `string` | `<sourceRoot>/app/kendo-widgets` | Directory path where Kendo widget adapters will be generated |

### Examples

```bash
# Skip generating the example component
ng add @golemui/kendo --skipExample

# Customize widget output directory
ng add @golemui/kendo --widgetsPath src/app/shared/kendo-widgets
```

---

## 💡 Usage Example

Once installed, use `kendoWidgetLoaders` with GolemUI's `<gui-form>`:

```typescript
import { Component } from '@angular/core';
import { FormComponent } from '@golemui/gui-angular';
import type { GuiFormInitConfig } from '@golemui/gui-shared';
import { gui } from '@golemui/gui-shared';
import { kendoWidgetLoaders } from './kendo-widgets/kendo-widget-loaders';

const loginFormDef = [
  gui.inputs.custom('kendo-textbox', 'email', {
    label: 'Email Address',
    props: { placeholder: 'user@example.com', clearButton: true },
    validator: { type: 'string', required: true, format: 'email' },
  }),
  gui.inputs.custom('kendo-passwordbox', 'password', {
    label: 'Password',
    props: { hint: 'At least 8 characters' },
    validator: { type: 'string', required: true, minLength: 8 },
  }),
  gui.inputs.custom('kendo-checkbox', 'rememberMe', {
    label: 'Remember Me',
  }),
  gui.actions.custom('kendo-button', {
    label: 'Sign In',
    actionType: 'submit',
    disabled: { when: '$formIsInvalid' },
  }),
];

@Component({
  selector: 'app-login-form',
  imports: [FormComponent],
  template: `
    <h2>Sign In</h2>
    <gui-form [config]="config" (formSubmit)="onFormSubmit($event)"></gui-form>
  `,
})
export class LoginFormComponent {
  protected config: GuiFormInitConfig = {
    formDef: loginFormDef,
    formConfig: { widgetLoaders: kendoWidgetLoaders },
  };

  protected onFormSubmit(event: any) {
    console.log('Submitted data:', event.data);
  }
}
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and submission process.

To run tests locally using [Vitest](https://vitest.dev/):

```bash
npm install
npm test
```

---

## 🔗 Related Projects & Links

* 🌐 **GolemUI Website**: [https://golemui.com](https://golemui.com/)
* 📦 **GolemUI Core Repository**: [https://github.com/golemui/golemui](https://github.com/golemui/golemui)
* 🎨 **Progress Kendo UI for Angular**: [https://www.telerik.com/kendo-angular-ui](https://www.telerik.com/kendo-angular-ui)

---

## 👤 Maintainer

Maintained with ❤️ by **Dany Paredes** ([@danyparedes](https://github.com/danywalls)) for the [GolemUI](https://golemui.com/) ecosystem.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
