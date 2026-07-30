import type { Type } from '@angular/core';
import type { WidgetLoaders, WithWidget } from '@golemui/core';

export const kendoWidgetLoaders: WidgetLoaders<Type<WithWidget>> = {
  'kendo-textbox': async () =>
    (await import('./kendo-textinput.component')).KendoTextInputComponent,
  'kendo-passwordbox': async () =>
    (await import('./kendo-textinput.component')).KendoTextInputComponent,
  'kendo-textarea': async () =>
    (await import('./kendo-textarea.component')).KendoTextAreaComponent,
  'kendo-numerictextbox': async () =>
    (await import('./kendo-numerictextbox.component')).KendoNumericInputComponent,
  'kendo-checkbox': async () =>
    (await import('./kendo-checkbox.component')).KendoCheckboxComponent,
  'kendo-switch': async () =>
    (await import('./kendo-switch.component')).KendoSwitchComponent,
  'kendo-button': async () =>
    (await import('./kendo-button.component')).KendoButtonComponent,
};
