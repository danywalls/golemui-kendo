import { createShortcutType } from '@golemui/dx';
import type { StringValidator } from '@golemui/gui-validators';
import type { KendoRadioGroupProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';
import {
  autoLabelDefaults,
  createKeyedInputFactory,
  mapToInputWidget,
  type GslLabelledConfig,
  type KendoInputDecoratorBase,
  type KeyedEntry,
} from './shared';

export interface RadioGroupDecorator
  extends KendoInputDecoratorBase<StringValidator>,
    KendoRadioGroupProps {}

export type GslRadioGroupConfig = GslLabelledConfig<RadioGroupDecorator>;
export type RadioGroupEntry = KeyedEntry<RadioGroupDecorator>;

/** Single choice from a visible list, rendered as `kendo-radiogroup`. */
export const _kendoRadioGroup = createKeyedInputFactory<RadioGroupDecorator>(
  KENDO_ITEM_TYPES.radioGroup,
);

export const radioGroupShortcutType = createShortcutType<
  RadioGroupEntry,
  RadioGroupDecorator,
  GslRadioGroupConfig
>({
  itemType: KENDO_ITEM_TYPES.radioGroup,
  kind: 'input',
  entryShape: 'keyed',
  sensibleDefaults: autoLabelDefaults<RadioGroupDecorator>(),
  mapToWidget: (def) => mapToInputWidget(def, KENDO_WIDGET_TYPES.radioGroup, 'string'),
});

export const _gslRadioGroups = radioGroupShortcutType.gsl;
export const _gslRadioGroupByUid = radioGroupShortcutType.gslByUid;
