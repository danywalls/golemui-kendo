import { createShortcutType } from '@golemui/dx';
import type { StringValidator } from '@golemui/gui-validators';
import type { KendoPasswordBoxProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';
import {
  autoLabelAndPlaceholderDefaults,
  createKeyedInputFactory,
  mapToInputWidget,
  type GslLabelledPlaceholderConfig,
  type KendoInputDecoratorBase,
  type KeyedEntry,
} from './shared';

export interface PasswordBoxDecorator
  extends KendoInputDecoratorBase<StringValidator>,
    KendoPasswordBoxProps {}

export type GslPasswordBoxConfig = GslLabelledPlaceholderConfig<PasswordBoxDecorator>;
export type PasswordBoxEntry = KeyedEntry<PasswordBoxDecorator>;

/** Masked text field, rendered as `kendo-passwordbox`. */
export const _kendoPasswordBox = createKeyedInputFactory<PasswordBoxDecorator>(
  KENDO_ITEM_TYPES.passwordBox,
);

export const passwordBoxShortcutType = createShortcutType<
  PasswordBoxEntry,
  PasswordBoxDecorator,
  GslPasswordBoxConfig
>({
  itemType: KENDO_ITEM_TYPES.passwordBox,
  kind: 'input',
  entryShape: 'keyed',
  sensibleDefaults: autoLabelAndPlaceholderDefaults<PasswordBoxDecorator>(),
  mapToWidget: (def) => mapToInputWidget(def, KENDO_WIDGET_TYPES.passwordBox, 'string'),
});

export const _gslPasswordBoxes = passwordBoxShortcutType.gsl;
export const _gslPasswordBoxByUid = passwordBoxShortcutType.gslByUid;
