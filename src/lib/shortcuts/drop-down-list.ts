import { createShortcutType } from '@golemui/dx';
import type { StringValidator } from '@golemui/gui-validators';
import type { KendoDropDownListProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';
import {
  autoLabelDefaults,
  createKeyedInputFactory,
  mapToInputWidget,
  type GslLabelledConfig,
  type KendoInputDecoratorBase,
  type KeyedEntry,
} from './shared';

export interface DropDownListDecorator
  extends KendoInputDecoratorBase<StringValidator>,
    KendoDropDownListProps {}

export type GslDropDownListConfig = GslLabelledConfig<DropDownListDecorator>;
export type DropDownListEntry = KeyedEntry<DropDownListDecorator>;

/** Single choice from a popup list, rendered as `kendo-dropdownlist`. */
export const _kendoDropDownList = createKeyedInputFactory<DropDownListDecorator>(
  KENDO_ITEM_TYPES.dropDownList,
);

export const dropDownListShortcutType = createShortcutType<
  DropDownListEntry,
  DropDownListDecorator,
  GslDropDownListConfig
>({
  itemType: KENDO_ITEM_TYPES.dropDownList,
  kind: 'input',
  entryShape: 'keyed',
  sensibleDefaults: autoLabelDefaults<DropDownListDecorator>(),
  mapToWidget: (def) => mapToInputWidget(def, KENDO_WIDGET_TYPES.dropDownList, 'string'),
});

export const _gslDropDownLists = dropDownListShortcutType.gsl;
export const _gslDropDownListByUid = dropDownListShortcutType.gslByUid;
