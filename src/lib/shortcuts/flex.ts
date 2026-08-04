import type { FormWidget, FunctionWidgetParams, LayoutWidget, NonFunctionWidget } from '@golemui/core';
import {
  createShortcutType,
  type BuildWidgetContext,
  type DefOrCallback,
  type DxCommonFields,
  type DxLayoutBase,
  type GslConfigBase,
  type MergeResult,
  type ValidShortcut,
} from '@golemui/dx';
import type { KendoFlexProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';

export interface FlexDecorator extends DxLayoutBase, DxCommonFields, KendoFlexProps {}

export type GslFlexConfig = GslConfigBase<FlexDecorator>;
export type FlexEntry = { def: DefOrCallback<FlexDecorator>; children: ValidShortcut[] };

/** A flex container. Stacks its children in a column unless told otherwise. */
export function _kendoFlex(
  children: ValidShortcut[],
  props?: FlexDecorator,
  tags?: string[],
): ValidShortcut {
  return {
    type: 'ITEMS',
    itemType: KENDO_ITEM_TYPES.flex,
    items: [{ def: props ?? {}, children }],
    tags: tags ?? [],
  };
}

/** A flex container laying its children out left to right. */
export function _kendoRow(
  children: ValidShortcut[],
  props?: Omit<FlexDecorator, 'direction'>,
  tags?: string[],
): ValidShortcut {
  return _kendoFlex(children, { gap: 16, ...(props ?? {}), direction: 'row' }, tags);
}

/** A flex container laying its children out top to bottom. */
export function _kendoColumn(
  children: ValidShortcut[],
  props?: Omit<FlexDecorator, 'direction'>,
  tags?: string[],
): ValidShortcut {
  return _kendoFlex(children, { ...(props ?? {}), direction: 'column' }, tags);
}

function mapToWidget(def: FlexDecorator): NonFunctionWidget {
  const {
    uid,
    tags: _tags,
    size: _size,
    onChange: _onChange,
    states: _states,
    include: _include,
    exclude: _exclude,
    ...rest
  } = def;
  const { on: _on, ...flexProps } = rest as Record<string, unknown>;

  return {
    uid: uid ?? '',
    kind: 'layout',
    type: KENDO_WIDGET_TYPES.flex,
    props: { direction: 'column', ...flexProps },
    children: [],
  } as LayoutWidget;
}

function buildCustomWidget(mergeResult: MergeResult, context: BuildWidgetContext): FormWidget {
  const children = context.walkChildren(context.children ?? []);

  if (mergeResult.kind === 'static') {
    const mapped = context.mapStaticDef(mergeResult.def, KENDO_ITEM_TYPES.flex) as LayoutWidget;
    return { ...mapped, children };
  }

  const runtimeFn = mergeResult.fn;
  return ((params: FunctionWidgetParams<any>) => {
    const mapped = context.mapStaticDef(
      runtimeFn(params),
      KENDO_ITEM_TYPES.flex,
    ) as LayoutWidget;
    return { ...mapped, children };
  }) as FormWidget;
}

export const flexShortcutType = createShortcutType<FlexEntry, FlexDecorator, GslFlexConfig>({
  itemType: KENDO_ITEM_TYPES.flex,
  kind: 'layout',
  entryShape: 'compound',
  mapToWidget,
  buildCustomWidget,
  getChildren: (entry) => entry.children,
});

export const _gslFlexes = flexShortcutType.gsl;
export const _gslFlexByUid = flexShortcutType.gslByUid;
