import { createShortcutType } from '@golemui/dx';
import type { StringValidator } from '@golemui/gui-validators';
import type { KendoDatePickerProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';
import {
  autoLabelAndPlaceholderDefaults,
  createKeyedInputFactory,
  mapToInputWidget,
  type GslLabelledPlaceholderConfig,
  type KendoInputDecoratorBase,
  type KeyedEntry,
} from './shared';

export interface DatePickerDecorator
  extends KendoInputDecoratorBase<StringValidator>,
    KendoDatePickerProps {}

export type GslDatePickerConfig = GslLabelledPlaceholderConfig<DatePickerDecorator>;
export type DatePickerEntry = KeyedEntry<DatePickerDecorator>;

/** Date field with a calendar popup, rendered as `kendo-datepicker`. */
export const _kendoDatePicker = createKeyedInputFactory<DatePickerDecorator>(
  KENDO_ITEM_TYPES.datePicker,
);

export const datePickerShortcutType = createShortcutType<
  DatePickerEntry,
  DatePickerDecorator,
  GslDatePickerConfig
>({
  itemType: KENDO_ITEM_TYPES.datePicker,
  kind: 'input',
  entryShape: 'keyed',
  sensibleDefaults: autoLabelAndPlaceholderDefaults<DatePickerDecorator>(),
  mapToWidget: (def) => mapToInputWidget(def, KENDO_WIDGET_TYPES.datePicker, 'string'),
});

export const _gslDatePickers = datePickerShortcutType.gsl;
export const _gslDatePickerByUid = datePickerShortcutType.gslByUid;
