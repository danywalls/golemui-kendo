import { createShortcutType } from '@golemui/dx';
import type { BooleanValidator } from '@golemui/gui-validators';
import type { KendoCheckboxProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';
import {
  autoLabelDefaults,
  createKeyedInputFactory,
  mapToInputWidget,
  type GslLabelledConfig,
  type KendoInputDecoratorBase,
  type KeyedEntry,
} from './shared';

export interface CheckboxDecorator
  extends KendoInputDecoratorBase<BooleanValidator>,
    KendoCheckboxProps {}

export type GslCheckboxConfig = GslLabelledConfig<CheckboxDecorator>;
export type CheckboxEntry = KeyedEntry<CheckboxDecorator>;

/** Boolean checkbox, rendered as `kendo-checkbox`. */
export const _kendoCheckbox = createKeyedInputFactory<CheckboxDecorator>(KENDO_ITEM_TYPES.checkbox);

export const checkboxShortcutType = createShortcutType<
  CheckboxEntry,
  CheckboxDecorator,
  GslCheckboxConfig
>({
  itemType: KENDO_ITEM_TYPES.checkbox,
  kind: 'input',
  entryShape: 'keyed',
  sensibleDefaults: autoLabelDefaults<CheckboxDecorator>(),
  mapToWidget: (def) => mapToInputWidget(def, KENDO_WIDGET_TYPES.checkbox, 'boolean'),
});

export const _gslCheckboxes = checkboxShortcutType.gsl;
export const _gslCheckboxByUid = checkboxShortcutType.gslByUid;
