import type { Type } from '@angular/core';
import type { WidgetLoaders, WithWidget } from '@golemui/core';
import { KENDO_WIDGET_TYPES } from 'golemui-kendo';

/**
 * Maps every widget type the Kendo catalog emits to the component that renders
 * it. `flex` and `repeater` are reserved names GolemUI core mints on its own, so
 * they must be present for any form with a layout or a collection to render.
 *
 * Add your own entries here (or pass `customWidgetLoaders` to `<kendo-form>`) to
 * support `kendo.inputs.custom(...)`-style widgets of your own.
 */
export const kendoWidgetLoaders: WidgetLoaders<Type<WithWidget>> = {
  [KENDO_WIDGET_TYPES.textBox]: async () =>
    (await import('./kendo-textinput.component')).KendoTextInputComponent,
  [KENDO_WIDGET_TYPES.passwordBox]: async () =>
    (await import('./kendo-textinput.component')).KendoTextInputComponent,
  [KENDO_WIDGET_TYPES.textArea]: async () =>
    (await import('./kendo-textarea.component')).KendoTextAreaComponent,
  [KENDO_WIDGET_TYPES.numericTextBox]: async () =>
    (await import('./kendo-numerictextbox.component')).KendoNumericInputComponent,
  [KENDO_WIDGET_TYPES.checkbox]: async () =>
    (await import('./kendo-checkbox.component')).KendoCheckboxComponent,
  [KENDO_WIDGET_TYPES.switch]: async () =>
    (await import('./kendo-switch.component')).KendoSwitchComponent,
  [KENDO_WIDGET_TYPES.radioGroup]: async () =>
    (await import('./kendo-radiogroup.component')).KendoRadioGroupComponent,
  [KENDO_WIDGET_TYPES.dropDownList]: async () =>
    (await import('./kendo-dropdownlist.component')).KendoDropDownListComponent,
  [KENDO_WIDGET_TYPES.datePicker]: async () =>
    (await import('./kendo-datepicker.component')).KendoDatePickerComponent,
  [KENDO_WIDGET_TYPES.button]: async () =>
    (await import('./kendo-button.component')).KendoButtonComponent,

  // Reserved core widget types.
  [KENDO_WIDGET_TYPES.flex]: async () =>
    (await import('./kendo-flex.component')).KendoFlexComponent,
  [KENDO_WIDGET_TYPES.repeater]: async () =>
    (await import('./kendo-repeater.component')).KendoRepeaterComponent,
  [KENDO_WIDGET_TYPES.renderer]: async () =>
    (await import('./kendo-renderer.component')).KendoRendererComponent,
};
