// ===================================================
// golemui-kendo — the Progress Kendo UI widget set for GolemUI.
//
// Authoring goes through the `kendo` namespace:
//
//   import { kendo } from 'golemui-kendo';
//   const form = [kendo.inputs.textBox('email'), kendo.actions.submitButton()];
//
// The Angular components that render these widgets are generated into your app
// by `ng add golemui-kendo`, so you own and can restyle them. They import their
// prop types from this package, which keeps both sides of the boundary in sync.
// ===================================================

// --- Authoring API ---

export { kendo, kendoImplementation, formDefs, resolveFormInput } from './kendo';
export { kendoRegistry } from './registry';
export type { KendoFormInitConfig } from './form-config';

// --- Widget vocabulary ---

export { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from './widget-types';
export type { KendoItemType, KendoWidgetType } from './widget-types';

// --- Widget props, shared with the generated Angular components ---

export type {
  KendoButtonFillMode,
  KendoButtonProps,
  KendoButtonSize,
  KendoCheckboxProps,
  KendoDatePickerProps,
  KendoDropDownListProps,
  KendoFillMode,
  KendoFlexProps,
  KendoHintProps,
  KendoInputAppearanceProps,
  KendoNumericTextBoxProps,
  KendoOption,
  KendoPasswordBoxProps,
  KendoRadioGroupProps,
  KendoRepeaterProps,
  KendoRounded,
  KendoSize,
  KendoSwitchProps,
  KendoTextAreaProps,
  KendoTextBoxProps,
  KendoTextInputProps,
  KendoThemeColor,
} from './widget-props';

// --- Decorators, for typing helper functions that build form fragments ---

export type { ButtonDecorator, GslButtonConfig } from './shortcuts/button';
export type { CheckboxDecorator, GslCheckboxConfig } from './shortcuts/checkbox';
export type { DatePickerDecorator, GslDatePickerConfig } from './shortcuts/date-picker';
export type {
  DisplayDecorator,
  GslDisplayConfig,
  KendoRenderResult,
} from './shortcuts/display';
export type { DropDownListDecorator, GslDropDownListConfig } from './shortcuts/drop-down-list';
export type { FlexDecorator, GslFlexConfig } from './shortcuts/flex';
export type {
  GslNumericTextBoxConfig,
  NumericTextBoxDecorator,
} from './shortcuts/numeric-text-box';
export type { GslPasswordBoxConfig, PasswordBoxDecorator } from './shortcuts/password-box';
export type { GslRadioGroupConfig, RadioGroupDecorator } from './shortcuts/radio-group';
export type { GslRepeaterConfig, RepeaterDecorator } from './shortcuts/repeater';
export type { GslSwitchConfig, SwitchDecorator } from './shortcuts/switch';
export type { GslTextAreaConfig, TextAreaDecorator } from './shortcuts/text-area';
export type { GslTextBoxConfig, TextBoxDecorator } from './shortcuts/text-box';

// --- Extension points, for adding widget types on top of this catalog ---

export {
  autoLabelAndPlaceholderDefaults,
  autoLabelDefaults,
  createKeyedInputFactory,
  mapToInputWidget,
} from './shortcuts/shared';
export type {
  GslLabelledConfig,
  GslLabelledPlaceholderConfig,
  KendoInputDecoratorBase,
  KeyedEntry,
  KeyedInputFactory,
} from './shortcuts/shared';
