import type { FormWidget, FunctionWidgetParams, NonFunctionWidget } from '@golemui/core';
import {
  createShortcutType,
  withForm,
  type BuildWidgetContext,
  type DefOrCallback,
  type DxCommonFields,
  type DxDisplayBase,
  type DxRuntimeParams,
  type GslConfigBase,
  type MergeResult,
  type ValidShortcut,
} from '@golemui/dx';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';

/**
 * What a display's `render` returns: the Angular component to instantiate plus
 * the inputs to hand it. The generated `kendo-renderer` component feeds these
 * straight into `ngComponentOutlet`.
 */
export interface KendoRenderResult<TComponent = unknown, TApi = unknown> {
  component: TComponent;
  api?: TApi;
}

export interface DisplayDecorator extends DxDisplayBase, DxCommonFields {
  render: (params: DxRuntimeParams) => KendoRenderResult;
}

export type GslDisplayConfig = GslConfigBase<DisplayDecorator>;
export type DisplayEntry = DefOrCallback<DisplayDecorator>;

/**
 * Renders an arbitrary Angular component inside the form.
 *
 * @example
 * kendo.displays.render(({ $form }) => ({
 *   component: OrderSummaryComponent,
 *   api: { total: $form.total },
 * }));
 */
export function _kendoDisplay(
  render: (params: DxRuntimeParams) => KendoRenderResult,
  tags?: string[],
): ValidShortcut {
  return {
    type: 'ITEMS',
    itemType: KENDO_ITEM_TYPES.display,
    items: [{ render }],
    tags: tags ?? [],
  };
}

function mapToWidget(def: DisplayDecorator): NonFunctionWidget {
  return {
    uid: def.uid ?? '',
    kind: 'display',
    type: KENDO_WIDGET_TYPES.renderer,
    props: { render: def.render },
  } as NonFunctionWidget;
}

function buildCustomWidget(mergeResult: MergeResult, _context: BuildWidgetContext): FormWidget {
  const resolveDef =
    mergeResult.kind === 'static'
      ? () => mergeResult.def as DisplayDecorator
      : (params?: FunctionWidgetParams<any>) => mergeResult.fn(params as any) as DisplayDecorator;

  return ((params?: FunctionWidgetParams<any>) => {
    const displayDef = resolveDef(params);
    return {
      uid: displayDef.uid ?? '',
      kind: 'display' as const,
      type: KENDO_WIDGET_TYPES.renderer,
      ...(displayDef.include != null ? { include: displayDef.include } : {}),
      ...(displayDef.exclude != null ? { exclude: displayDef.exclude } : {}),
      props: { render: displayDef.render(withForm(params)) },
    };
  }) as FormWidget;
}

export const displayShortcutType = createShortcutType<
  DisplayEntry,
  DisplayDecorator,
  GslDisplayConfig
>({
  itemType: KENDO_ITEM_TYPES.display,
  kind: 'display',
  entryShape: 'bare',
  mapToWidget,
  buildCustomWidget,
});

export const _gslRenderers = displayShortcutType.gsl;
export const _gslRendererByUid = displayShortcutType.gslByUid;
