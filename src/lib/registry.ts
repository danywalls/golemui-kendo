import { createItemTypeRegistry, registerShortcutType, type ShortcutTypeDefinition } from '@golemui/dx';

import { buttonShortcutType } from './shortcuts/button';
import { checkboxShortcutType } from './shortcuts/checkbox';
import { datePickerShortcutType } from './shortcuts/date-picker';
import { displayShortcutType } from './shortcuts/display';
import { dropDownListShortcutType } from './shortcuts/drop-down-list';
import { flexShortcutType } from './shortcuts/flex';
import { numericTextBoxShortcutType } from './shortcuts/numeric-text-box';
import { passwordBoxShortcutType } from './shortcuts/password-box';
import { radioGroupShortcutType } from './shortcuts/radio-group';
import { repeaterShortcutType } from './shortcuts/repeater';
import { switchShortcutType } from './shortcuts/switch';
import { textAreaShortcutType } from './shortcuts/text-area';
import { textBoxShortcutType } from './shortcuts/text-box';

const kendoShortcutTypes: ShortcutTypeDefinition<any, any, any>[] = [
  // inputs
  textBoxShortcutType,
  passwordBoxShortcutType,
  textAreaShortcutType,
  numericTextBoxShortcutType,
  checkboxShortcutType,
  switchShortcutType,
  radioGroupShortcutType,
  dropDownListShortcutType,
  datePickerShortcutType,
  repeaterShortcutType,
  // actions
  buttonShortcutType,
  // displays
  displayShortcutType,
  // layouts
  flexShortcutType,
];

export const kendoRegistry = createItemTypeRegistry();

for (const shortcutType of kendoShortcutTypes) {
  registerShortcutType(kendoRegistry, shortcutType);
}
