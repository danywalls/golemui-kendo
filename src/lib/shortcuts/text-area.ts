import { createShortcutType } from '@golemui/dx';
import type { StringValidator } from '@golemui/gui-validators';
import type { KendoTextAreaProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';
import {
  autoLabelAndPlaceholderDefaults,
  createKeyedInputFactory,
  mapToInputWidget,
  type GslLabelledPlaceholderConfig,
  type KendoInputDecoratorBase,
  type KeyedEntry,
} from './shared';

export interface TextAreaDecorator
  extends KendoInputDecoratorBase<StringValidator>,
    KendoTextAreaProps {}

export type GslTextAreaConfig = GslLabelledPlaceholderConfig<TextAreaDecorator>;
export type TextAreaEntry = KeyedEntry<TextAreaDecorator>;

/** Multi-line text field, rendered as `kendo-textarea`. */
export const _kendoTextArea = createKeyedInputFactory<TextAreaDecorator>(KENDO_ITEM_TYPES.textArea);

export const textAreaShortcutType = createShortcutType<
  TextAreaEntry,
  TextAreaDecorator,
  GslTextAreaConfig
>({
  itemType: KENDO_ITEM_TYPES.textArea,
  kind: 'input',
  entryShape: 'keyed',
  sensibleDefaults: autoLabelAndPlaceholderDefaults<TextAreaDecorator>(),
  mapToWidget: (def) => mapToInputWidget(def, KENDO_WIDGET_TYPES.textArea, 'string'),
});

export const _gslTextAreas = textAreaShortcutType.gsl;
export const _gslTextAreaByUid = textAreaShortcutType.gslByUid;
