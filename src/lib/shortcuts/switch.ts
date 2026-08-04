import { createShortcutType } from '@golemui/dx';
import type { BooleanValidator } from '@golemui/gui-validators';
import type { KendoSwitchProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';
import {
  autoLabelDefaults,
  createKeyedInputFactory,
  mapToInputWidget,
  type GslLabelledConfig,
  type KendoInputDecoratorBase,
  type KeyedEntry,
} from './shared';

export interface SwitchDecorator
  extends KendoInputDecoratorBase<BooleanValidator>,
    KendoSwitchProps {}

export type GslSwitchConfig = GslLabelledConfig<SwitchDecorator>;
export type SwitchEntry = KeyedEntry<SwitchDecorator>;

/** Boolean toggle, rendered as `kendo-switch`. */
export const _kendoSwitch = createKeyedInputFactory<SwitchDecorator>(KENDO_ITEM_TYPES.switch);

export const switchShortcutType = createShortcutType<SwitchEntry, SwitchDecorator, GslSwitchConfig>({
  itemType: KENDO_ITEM_TYPES.switch,
  kind: 'input',
  entryShape: 'keyed',
  sensibleDefaults: autoLabelDefaults<SwitchDecorator>(),
  mapToWidget: (def) => mapToInputWidget(def, KENDO_WIDGET_TYPES.switch, 'boolean'),
});

export const _gslSwitches = switchShortcutType.gsl;
export const _gslSwitchByUid = switchShortcutType.gslByUid;
