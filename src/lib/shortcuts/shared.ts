import type { Localizable, NonFunctionWidget } from '@golemui/core';
import type { Validator } from '@golemui/gui-validators';
import {
  buildTypedValidator,
  extractWidgetProps,
  processAutoLabel,
  processAutoPlaceholder,
  type DefOrCallback,
  type DxCommonFields,
  type DxInputBase,
  type DxRuntimeParams,
  type DxValidator,
  type GslConfigBase,
  type SensibleDefaultsSpec,
  type ValidShortcut,
} from '@golemui/dx';

/**
 * The decorator shape every standard Kendo input decorator satisfies: the DX
 * input base (path, label, disabled, readonly, events), the DX common fields
 * (uid, tags, size, states, include, exclude), plus its own validator.
 */
export interface KendoInputDecoratorBase<TValidator extends Validator>
  extends DxInputBase,
    DxCommonFields {
  validator?: DxValidator<TValidator>;
}

/** A standard keyed entry: the data path is the key, the rest is the decorator. */
export interface KeyedEntry<TDecorator> {
  key: string;
  def: DefOrCallback<TDecorator>;
}

/** The GSL config of an input that auto-derives its label from the data path. */
export interface GslLabelledConfig<TDecorator> extends GslConfigBase<TDecorator> {
  suppressAutomaticLabels?: boolean;
}

/**
 * The GSL config of an input that auto-derives both its label and its
 * placeholder from the data path.
 */
export interface GslLabelledPlaceholderConfig<TDecorator> extends GslLabelledConfig<TDecorator> {
  suppressAutomaticPlaceholders?: boolean;
}

/**
 * Sensible defaults for inputs that show a label but have no placeholder
 * (checkbox, switch, radio group).
 */
export function autoLabelDefaults<
  TDecorator extends { path?: string; label?: Localizable | null },
>(): SensibleDefaultsSpec<TDecorator, GslLabelledConfig<TDecorator>> {
  return {
    base: { suppressAutomaticLabels: false },
    fields: ['suppressAutomaticLabels'],
    apply: (def, config) => processAutoLabel(def, config),
  };
}

/** Sensible defaults for inputs that show both a label and a placeholder. */
export function autoLabelAndPlaceholderDefaults<
  TDecorator extends { path?: string; label?: Localizable | null; placeholder?: string },
>(): SensibleDefaultsSpec<TDecorator, GslLabelledPlaceholderConfig<TDecorator>> {
  return {
    base: { suppressAutomaticLabels: false, suppressAutomaticPlaceholders: false },
    fields: ['suppressAutomaticLabels', 'suppressAutomaticPlaceholders'],
    apply: (def, config) => processAutoPlaceholder(processAutoLabel(def, config), config),
  };
}

/**
 * Maps a merged decorator onto a core input widget: the fields core knows about
 * are lifted to the top level, everything else becomes `props`.
 */
export function mapToInputWidget<TDecorator extends DxInputBase & DxCommonFields>(
  def: TDecorator,
  widgetType: string,
  valueType: Validator['type'],
): NonFunctionWidget {
  const decorator = def as TDecorator & { validator?: Record<string, unknown> };
  return {
    uid: def.uid ?? '',
    kind: 'input',
    type: widgetType,
    path: def.path ?? '',
    ...(def.label != null ? { label: def.label } : {}),
    ...(def.disabled != null ? { disabled: def.disabled } : {}),
    ...(def.readonly != null ? { readonly: def.readonly } : {}),
    ...(decorator.validator != null
      ? { validator: buildTypedValidator(decorator.validator, valueType) }
      : {}),
    props: extractWidgetProps(def),
  } as NonFunctionWidget;
}

/**
 * The call signature of a standard keyed input factory. Every Kendo input in
 * the `kendo.inputs` facade has exactly these three overloads.
 */
export interface KeyedInputFactory<TDecorator> {
  /** `kendo.inputs.textBox('email')` — the label and placeholder come from the path. */
  (path: string): ValidShortcut;
  /** `kendo.inputs.textBox('email', { label: 'Email address' })` */
  (path: string, props: TDecorator, tags?: string[]): ValidShortcut;
  /** `kendo.inputs.textBox('city', ({ $form }) => ({ disabled: !$form.country }))` */
  (
    path: string,
    callback: (params: DxRuntimeParams) => Partial<TDecorator>,
    tags?: string[],
  ): ValidShortcut;
}

/**
 * Builds the `(path, props?, tags?)` factory of a standard keyed input.
 *
 * The `path` deliberately does NOT go into the decorator: the DX walker injects
 * it from the entry key, and a decorator that also carried it would fight the
 * walker on runtime callbacks.
 */
export function createKeyedInputFactory<TDecorator>(
  itemType: string,
): KeyedInputFactory<TDecorator> {
  return ((
    path: string,
    propsOrCallback?: TDecorator | ((params: DxRuntimeParams) => Partial<TDecorator>),
    tags?: string[],
  ): ValidShortcut => ({
    type: 'ITEMS',
    itemType,
    items: [{ key: path, def: propsOrCallback ?? ({} as TDecorator) }],
    tags: tags ?? [],
  })) as KeyedInputFactory<TDecorator>;
}
