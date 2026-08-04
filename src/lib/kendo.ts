import { createImplementation, createSelectors, type DxAdapter } from '@golemui/dx';

import { kendoRegistry } from './registry';
import { _gslButtonByUid, _gslButtons, _kendoButton, _kendoSubmitButton } from './shortcuts/button';
import { _gslCheckboxByUid, _gslCheckboxes, _kendoCheckbox } from './shortcuts/checkbox';
import { _gslDatePickerByUid, _gslDatePickers, _kendoDatePicker } from './shortcuts/date-picker';
import { _gslRendererByUid, _gslRenderers, _kendoDisplay } from './shortcuts/display';
import {
  _gslDropDownListByUid,
  _gslDropDownLists,
  _kendoDropDownList,
} from './shortcuts/drop-down-list';
import {
  _gslFlexByUid,
  _gslFlexes,
  _kendoColumn,
  _kendoFlex,
  _kendoRow,
} from './shortcuts/flex';
import {
  _gslNumericTextBoxByUid,
  _gslNumericTextBoxes,
  _kendoNumericTextBox,
} from './shortcuts/numeric-text-box';
import {
  _gslPasswordBoxByUid,
  _gslPasswordBoxes,
  _kendoPasswordBox,
} from './shortcuts/password-box';
import { _gslRadioGroupByUid, _gslRadioGroups, _kendoRadioGroup } from './shortcuts/radio-group';
import { _gslRepeaterByUid, _gslRepeaters, _kendoRepeater } from './shortcuts/repeater';
import { _gslSwitchByUid, _gslSwitches, _kendoSwitch } from './shortcuts/switch';
import { _gslTextAreaByUid, _gslTextAreas, _kendoTextArea } from './shortcuts/text-area';
import { _gslTextBoxByUid, _gslTextBoxes, _kendoTextBox } from './shortcuts/text-box';

/**
 * The selector surface. Umbrella methods (`inputs`, `actions`, `displays`,
 * `layouts` and their `ByUid` variants) are generated for free, as are the four
 * scope methods (`tag`, `tagsAnd`, `tagsOr`, `state`).
 */
const kendoSelectors = createSelectors({
  textBoxes: _gslTextBoxes,
  textBoxByUid: _gslTextBoxByUid,
  passwordBoxes: _gslPasswordBoxes,
  passwordBoxByUid: _gslPasswordBoxByUid,
  textAreas: _gslTextAreas,
  textAreaByUid: _gslTextAreaByUid,
  numericTextBoxes: _gslNumericTextBoxes,
  numericTextBoxByUid: _gslNumericTextBoxByUid,
  checkboxes: _gslCheckboxes,
  checkboxByUid: _gslCheckboxByUid,
  switches: _gslSwitches,
  switchByUid: _gslSwitchByUid,
  radioGroups: _gslRadioGroups,
  radioGroupByUid: _gslRadioGroupByUid,
  dropDownLists: _gslDropDownLists,
  dropDownListByUid: _gslDropDownListByUid,
  datePickers: _gslDatePickers,
  datePickerByUid: _gslDatePickerByUid,
  repeaters: _gslRepeaters,
  repeaterByUid: _gslRepeaterByUid,
  buttons: _gslButtons,
  buttonByUid: _gslButtonByUid,
  renderers: _gslRenderers,
  rendererByUid: _gslRendererByUid,
  flexes: _gslFlexes,
  flexByUid: _gslFlexByUid,
});

/**
 * The two decisions the generic DX pipeline leaves to a widget set: what a bare
 * function in a form definition becomes, and what the synthetic form root is.
 */
const kendoAdapter: DxAdapter = {
  bareItemToWidget: (renderFn) => _kendoDisplay(renderFn),
  rootEntry: (children) => _kendoFlex(children, { uid: '#root', direction: 'column', gap: 16 }),
};

export const kendoImplementation = createImplementation({
  name: 'kendo',
  registry: kendoRegistry,
  facade: {
    inputs: {
      textBox: _kendoTextBox,
      passwordBox: _kendoPasswordBox,
      textArea: _kendoTextArea,
      numericTextBox: _kendoNumericTextBox,
      checkbox: _kendoCheckbox,
      switch: _kendoSwitch,
      radioGroup: _kendoRadioGroup,
      dropDownList: _kendoDropDownList,
      datePicker: _kendoDatePicker,
      repeater: _kendoRepeater,
    },
    actions: {
      button: _kendoButton,
      submitButton: _kendoSubmitButton,
    },
    displays: {
      render: _kendoDisplay,
    },
    layouts: {
      flex: _kendoFlex,
      row: _kendoRow,
      column: _kendoColumn,
    },
  },
  selectors: kendoSelectors,
  adapter: kendoAdapter,
});

/**
 * The Kendo authoring namespace.
 *
 * @example
 * import { kendo } from 'golemui-kendo';
 *
 * const form = [
 *   kendo.inputs.textBox('email', { validator: { required: true, format: 'email' } }),
 *   kendo.inputs.passwordBox('password', { validator: { required: true, minLength: 8 } }),
 *   kendo.actions.submitButton({ label: 'Sign in', disabled: { when: '$formIsInvalid' } }),
 * ];
 *
 * const selectors = [kendo.selectors.tag('billing').inputs({ suppressAutomaticLabels: true })];
 */
export const kendo = kendoImplementation.namespace;

/** The DX form-definition service bound to the Kendo registry and adapter. */
export const formDefs = kendoImplementation.formDefs;

/**
 * Normalizes any accepted form input (a `kendo.*` builder array, a JSON form
 * definition, or a pre-built `Form`) into what the core form component needs.
 * The generated `<kendo-form>` wrapper is its only expected caller.
 */
export const resolveFormInput = kendoImplementation.resolveFormInput;
