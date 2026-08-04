import { createShortcutType } from '@golemui/dx';
import type { StringValidator } from '@golemui/gui-validators';
import type { KendoTextBoxProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';
import {
  autoLabelAndPlaceholderDefaults,
  createKeyedInputFactory,
  mapToInputWidget,
  type GslLabelledPlaceholderConfig,
  type KendoInputDecoratorBase,
  type KeyedEntry,
} from './shared';

export interface TextBoxDecorator
  extends KendoInputDecoratorBase<StringValidator>,
    KendoTextBoxProps {}

export type GslTextBoxConfig = GslLabelledPlaceholderConfig<TextBoxDecorator>;
export type TextBoxEntry = KeyedEntry<TextBoxDecorator>;

/** Single-line text field, rendered as `kendo-textbox`. */
export const _kendoTextBox = createKeyedInputFactory<TextBoxDecorator>(KENDO_ITEM_TYPES.textBox);

export const textBoxShortcutType = createShortcutType<
  TextBoxEntry,
  TextBoxDecorator,
  GslTextBoxConfig
>({
  itemType: KENDO_ITEM_TYPES.textBox,
  kind: 'input',
  entryShape: 'keyed',
  sensibleDefaults: autoLabelAndPlaceholderDefaults<TextBoxDecorator>(),
  mapToWidget: (def) => mapToInputWidget(def, KENDO_WIDGET_TYPES.textBox, 'string'),
});

export const _gslTextBoxes = textBoxShortcutType.gsl;
export const _gslTextBoxByUid = textBoxShortcutType.gslByUid;
