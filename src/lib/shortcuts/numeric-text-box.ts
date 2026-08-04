import { createShortcutType } from '@golemui/dx';
import type { NumberValidator } from '@golemui/gui-validators';
import type { KendoNumericTextBoxProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';
import {
  autoLabelAndPlaceholderDefaults,
  createKeyedInputFactory,
  mapToInputWidget,
  type GslLabelledPlaceholderConfig,
  type KendoInputDecoratorBase,
  type KeyedEntry,
} from './shared';

export interface NumericTextBoxDecorator
  extends KendoInputDecoratorBase<NumberValidator>,
    KendoNumericTextBoxProps {}

export type GslNumericTextBoxConfig = GslLabelledPlaceholderConfig<NumericTextBoxDecorator>;
export type NumericTextBoxEntry = KeyedEntry<NumericTextBoxDecorator>;

/** Numeric field with spinners, rendered as `kendo-numerictextbox`. */
export const _kendoNumericTextBox = createKeyedInputFactory<NumericTextBoxDecorator>(
  KENDO_ITEM_TYPES.numericTextBox,
);

export const numericTextBoxShortcutType = createShortcutType<
  NumericTextBoxEntry,
  NumericTextBoxDecorator,
  GslNumericTextBoxConfig
>({
  itemType: KENDO_ITEM_TYPES.numericTextBox,
  kind: 'input',
  entryShape: 'keyed',
  sensibleDefaults: autoLabelAndPlaceholderDefaults<NumericTextBoxDecorator>(),
  mapToWidget: (def) => mapToInputWidget(def, KENDO_WIDGET_TYPES.numericTextBox, 'number'),
});

export const _gslNumericTextBoxes = numericTextBoxShortcutType.gsl;
export const _gslNumericTextBoxByUid = numericTextBoxShortcutType.gslByUid;
