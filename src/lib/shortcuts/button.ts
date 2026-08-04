import type { ActionWidget, NonFunctionWidget } from '@golemui/core';
import {
  createShortcutType,
  eventWiringService,
  type DefOrCallback,
  type DxActionBase,
  type DxCommonFields,
  type DxRuntimeParams,
  type GslConfigBase,
  type ValidShortcut,
} from '@golemui/dx';
import type { KendoButtonProps } from '../widget-props';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from '../widget-types';

export interface ButtonDecorator extends DxActionBase, DxCommonFields, KendoButtonProps {
  /** Arbitrary payload handed to `onClick`. */
  data?: unknown;
  /**
   * Runs when the button is clicked. Return a string to dispatch a host-managed
   * event of that name instead of running the handler.
   */
  onClick?: (data: any) => void | string;
}

export type GslButtonConfig = GslConfigBase<ButtonDecorator>;
export type ButtonEntry = DefOrCallback<ButtonDecorator>;

/**
 * A Kendo button, rendered as `kendo-button`.
 *
 * @example
 * kendo.actions.button({ label: 'Save', actionType: 'submit' });
 * @example
 * kendo.actions.button({ label: 'Reset', onClick: () => 'resetRequested' });
 */
export function _kendoButton(props: ButtonDecorator, tags?: string[]): ValidShortcut;
export function _kendoButton(
  callback: (params: DxRuntimeParams) => Partial<ButtonDecorator>,
  tags?: string[],
): ValidShortcut;
export function _kendoButton(entry: ButtonEntry, tags?: string[]): ValidShortcut {
  return {
    type: 'ITEMS',
    itemType: KENDO_ITEM_TYPES.button,
    items: [entry],
    tags: tags ?? [],
  };
}

/**
 * A submit button. `actionType: 'submit'` is the semantic core reads to decide
 * which action submits the form, so it is set here rather than left to callers.
 */
export function _kendoSubmitButton(
  props: Omit<ButtonDecorator, 'actionType'> = {},
  tags?: string[],
): ValidShortcut {
  return _kendoButton({ themeColor: 'primary', ...props, actionType: 'submit' }, tags);
}

function mapToWidget(def: ButtonDecorator): NonFunctionWidget {
  const {
    uid,
    label,
    actionType,
    disabled,
    on,
    onClick: _onClick,
    data: _data,
    tags: _tags,
    size: _size,
    states: _states,
    include: _include,
    exclude: _exclude,
    ...buttonProps
  } = def as ButtonDecorator & { on?: { click: string } };

  return {
    uid: uid ?? '',
    kind: 'action',
    type: KENDO_WIDGET_TYPES.button,
    ...(label != null ? { label } : {}),
    ...(actionType != null ? { actionType } : {}),
    ...(disabled != null ? { disabled } : {}),
    ...(on != null ? { on } : {}),
    props: buttonProps,
  } as ActionWidget;
}

export const buttonShortcutType = createShortcutType<ButtonEntry, ButtonDecorator, GslButtonConfig>({
  itemType: KENDO_ITEM_TYPES.button,
  kind: 'action',
  entryShape: 'bare',
  mapToWidget,
  afterMerge: (mergeResult, context) =>
    eventWiringService.extractOnClickFromMergeResult(
      mergeResult,
      context.eventRegistry,
      context.eventIdGenerator,
    ),
});

export const _gslButtons = buttonShortcutType.gsl;
export const _gslButtonByUid = buttonShortcutType.gslByUid;
