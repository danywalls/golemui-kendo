import type {
  FormWidget,
  FunctionWidgetParams,
  LayoutWidget,
  NonFunctionWidget,
} from '@golemui/core';
import {
  buildTypedValidator,
  createGslSelector,
  type BuildWidgetContext,
  type DefOrCallback,
  type DxCommonFields,
  type DxInputBase,
  type DxValidator,
  type GslConfigBase,
  type ItemTypeHandler,
  type MergeResult,
  type ParsedEntry,
  type ShortcutTypeDefinition,
  type ValidShortcut,
} from '@golemui/dx';
import type { ArrayValidator } from '@golemui/gui-validators';
import type { KendoRepeaterProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';

export interface RepeaterDecorator extends DxInputBase, DxCommonFields, KendoRepeaterProps {
  validator?: DxValidator<ArrayValidator>;
}

export type GslRepeaterConfig = GslConfigBase<RepeaterDecorator>;
export type RepeaterEntry = {
  key: string;
  def: DefOrCallback<RepeaterDecorator>;
  children: ValidShortcut[];
};

/**
 * A repeating group of widgets bound to an array in the form data.
 *
 * @example
 * kendo.inputs.repeater(
 *   'guests',
 *   [kendo.inputs.textBox('name'), kendo.inputs.numericTextBox('age')],
 *   { title: 'Guest', limit: 5 },
 * );
 */
export function _kendoRepeater(
  path: string,
  template: ValidShortcut[],
  props?: RepeaterDecorator,
  tags?: string[],
): ValidShortcut {
  return {
    type: 'ITEMS',
    itemType: KENDO_ITEM_TYPES.repeater,
    items: [{ key: path, def: props ?? {}, children: template }],
    tags: tags ?? [],
  };
}

function mapToWidget(def: RepeaterDecorator): NonFunctionWidget {
  const {
    uid,
    path,
    label,
    disabled,
    readonly,
    validator,
    tags: _tags,
    size: _size,
    states: _states,
    include: _include,
    exclude: _exclude,
    defaultValue: _defaultValue,
    onLoad: _onLoad,
    onChange: _onChange,
    onFilter: _onFilter,
    onBlur: _onBlur,
    ...repeaterProps
  } = def as RepeaterDecorator & Record<string, unknown>;
  const { on: _on, ...cleanProps } = repeaterProps as Record<string, unknown>;

  return {
    uid: uid ?? '',
    kind: 'input',
    type: KENDO_WIDGET_TYPES.repeater,
    path: path ?? '',
    ...(label != null ? { label } : {}),
    ...(disabled != null ? { disabled } : {}),
    ...(readonly != null ? { readonly } : {}),
    ...(validator != null
      ? { validator: buildTypedValidator(validator as Record<string, unknown>, 'array') }
      : {}),
    props: {
      ...cleanProps,
      // Replaced with the walked children in buildCustomWidget. Present here so
      // a repeater mapped without children is still a well-formed widget.
      template: emptyTemplate(),
    },
  } as NonFunctionWidget;
}

function emptyTemplate(): LayoutWidget {
  return {
    kind: 'layout',
    type: KENDO_WIDGET_TYPES.flex,
    uid: '',
    children: [],
    props: { direction: 'column' },
  } as LayoutWidget;
}

/**
 * Prepends `{path}.items.` to every path in the template so authors can write
 * child paths relative to the repeated item.
 *
 * Idempotent: a child path may already be absolute (when a selector rewrote it),
 * and double-prefixing would break the repeater item path grammar in core.
 */
function prefixTemplatePaths(widgets: FormWidget[], prefix: string): void {
  for (const widget of widgets) {
    if (typeof widget === 'function') {
      continue;
    }
    const nonFunctionWidget = widget as NonFunctionWidget & {
      path?: string;
      children?: FormWidget[];
      props?: Record<string, any>;
    };

    if (
      typeof nonFunctionWidget.path === 'string' &&
      nonFunctionWidget.path &&
      !nonFunctionWidget.path.startsWith(prefix)
    ) {
      nonFunctionWidget.path = prefix + nonFunctionWidget.path;
    }

    if (Array.isArray(nonFunctionWidget.children)) {
      prefixTemplatePaths(nonFunctionWidget.children, prefix);
    }

    // Nested repeaters carry their own template; each nesting level uses a
    // different prefix, so recursing here is additive rather than duplicative.
    const nestedTemplate = nonFunctionWidget.props?.['template'];
    if (Array.isArray(nestedTemplate?.children)) {
      prefixTemplatePaths(nestedTemplate.children as FormWidget[], prefix);
    }
  }
}

function buildCustomWidget(mergeResult: MergeResult, context: BuildWidgetContext): FormWidget {
  const walkedChildren = context.walkChildren(context.children ?? []);

  // The path is always static (it comes from the entry key); for a dynamic
  // merge result the walker has already baked it into the function's return.
  const repeaterPath =
    mergeResult.kind === 'static'
      ? ((mergeResult.def['path'] as string) ?? '')
      : ((mergeResult.fn({} as FunctionWidgetParams<any>)?.['path'] as string) ?? '');

  if (repeaterPath) {
    prefixTemplatePaths(walkedChildren, `${repeaterPath}.items.`);
  }

  const template: LayoutWidget = { ...emptyTemplate(), children: walkedChildren };

  if (mergeResult.kind === 'static') {
    const mapped = context.mapStaticDef(mergeResult.def, KENDO_ITEM_TYPES.repeater);
    return { ...mapped, props: { ...mapped.props, template } } as NonFunctionWidget;
  }

  const runtimeFn = mergeResult.fn;
  return ((params: FunctionWidgetParams<any>) => {
    const mapped = context.mapStaticDef(runtimeFn(params), KENDO_ITEM_TYPES.repeater);
    return { ...mapped, props: { ...mapped.props, template } };
  }) as FormWidget;
}

function parseEntry(entry: RepeaterEntry): ParsedEntry<RepeaterDecorator> {
  return { baseDef: entry.def, path: entry.key, children: entry.children };
}

const handler: ItemTypeHandler<RepeaterEntry, RepeaterDecorator, GslRepeaterConfig> = {
  parseEntry,
  rollUpSensibleDefaults: () => ({}) as GslRepeaterConfig,
  applySensibleDefaults: (def) => def,
  mapToWidget: mapToWidget as ItemTypeHandler<
    RepeaterEntry,
    RepeaterDecorator,
    GslRepeaterConfig
  >['mapToWidget'],
  buildCustomWidget,
  getChildren: (entry) => entry.children,
};

export const _gslRepeaters = createGslSelector<RepeaterDecorator, GslRepeaterConfig>(
  KENDO_ITEM_TYPES.repeater,
);

export const _gslRepeaterByUid = (uid: string, config: GslRepeaterConfig) =>
  _gslRepeaters(config, (decorator) => decorator.uid === uid);

export const repeaterShortcutType: ShortcutTypeDefinition<
  RepeaterEntry,
  RepeaterDecorator,
  GslRepeaterConfig
> = {
  itemType: KENDO_ITEM_TYPES.repeater,
  kind: 'input',
  handler,
  gsl: _gslRepeaters,
  gslByUid: _gslRepeaterByUid,
};
