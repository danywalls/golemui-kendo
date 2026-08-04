export const KENDO_WIDGET_TYPES = {
  textBox: 'kendo-textbox',
  passwordBox: 'kendo-passwordbox',
  textArea: 'kendo-textarea',
  numericTextBox: 'kendo-numerictextbox',
  checkbox: 'kendo-checkbox',
  switch: 'kendo-switch',
  radioGroup: 'kendo-radiogroup',
  dropDownList: 'kendo-dropdownlist',
  datePicker: 'kendo-datepicker',
  button: 'kendo-button',

  /**
   * Reserved by @golemui/core: the synthetic root layout and every collection
   * template resolve to this exact type string.
   */
  flex: 'flex',
  /** Reserved by @golemui/core: collection semantics are keyed on this type string. */
  repeater: 'repeater',
  /** Minted by the DX layer for `kendo.displays.render(...)`. */
  renderer: 'renderer',
} as const satisfies Record<string, string>;

export type KendoWidgetType = (typeof KENDO_WIDGET_TYPES)[keyof typeof KENDO_WIDGET_TYPES];

/**
 * The DX item types, one per registered shortcut. These are the names selectors
 * match on, and the keys of the item type registry.
 */
export const KENDO_ITEM_TYPES = {
  textBox: 'KENDO_TEXT_BOX',
  passwordBox: 'KENDO_PASSWORD_BOX',
  textArea: 'KENDO_TEXT_AREA',
  numericTextBox: 'KENDO_NUMERIC_TEXT_BOX',
  checkbox: 'KENDO_CHECKBOX',
  switch: 'KENDO_SWITCH',
  radioGroup: 'KENDO_RADIO_GROUP',
  dropDownList: 'KENDO_DROP_DOWN_LIST',
  datePicker: 'KENDO_DATE_PICKER',
  repeater: 'KENDO_REPEATER',
  button: 'KENDO_BUTTON',
  display: 'KENDO_DISPLAY',
  flex: 'KENDO_FLEX',
} as const satisfies Record<string, string>;

export type KendoItemType = (typeof KENDO_ITEM_TYPES)[keyof typeof KENDO_ITEM_TYPES];
