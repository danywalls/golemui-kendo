/** Kendo's `size` input, renamed to avoid clashing with GolemUI's layout `size`. */
export type KendoSize = 'small' | 'medium' | 'large';

/** Buttons additionally support `xsmall`. */
export type KendoButtonSize = 'xsmall' | KendoSize;

export type KendoRounded = 'small' | 'medium' | 'large' | 'full' | 'none';

export type KendoFillMode = 'solid' | 'flat' | 'outline';

/** Buttons additionally support `link` and `clear`. */
export type KendoButtonFillMode = KendoFillMode | 'link' | 'clear';

export type KendoThemeColor =
  | 'base'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'inverse';

/** One choice of a `radioGroup` or `dropDownList`. */
export interface KendoOption<TValue = unknown> {
  text: string;
  value: TValue;
  disabled?: boolean;
}

/** Props shared by the widgets that render a Kendo form hint under the control. */
export interface KendoHintProps {
  hint?: string;
}

export interface KendoTextBoxProps extends KendoHintProps {
  placeholder?: string;
  kuiSize?: KendoSize;
  rounded?: KendoRounded;
  fillMode?: KendoFillMode;
  clearButton?: boolean;
  maxlength?: number;
  title?: string;
}

export interface KendoPasswordBoxProps extends KendoHintProps {
  placeholder?: string;
  kuiSize?: KendoSize;
  rounded?: KendoRounded;
  fillMode?: KendoFillMode;
  clearButton?: boolean;
  maxlength?: number;
  title?: string;
}

export interface KendoTextAreaProps extends KendoHintProps {
  placeholder?: string;
  kuiSize?: KendoSize;
  rounded?: KendoRounded;
  fillMode?: KendoFillMode;
  rows?: number;
  resizable?: 'none' | 'both' | 'horizontal' | 'vertical' | 'auto';
  maxlength?: number;
}

export interface KendoNumericTextBoxProps extends KendoHintProps {
  placeholder?: string;
  kuiSize?: KendoSize;
  rounded?: KendoRounded;
  fillMode?: KendoFillMode;
  min?: number;
  max?: number;
  step?: number;
  /** A Kendo number format string, e.g. 'n2', 'c2', 'p0'. */
  format?: string;
  decimals?: number;
  spinners?: boolean;
  autoCorrect?: boolean;
}

export interface KendoCheckboxProps extends KendoHintProps {
  kuiSize?: KendoSize;
}

export interface KendoSwitchProps extends KendoHintProps {
  onLabel?: string;
  offLabel?: string;
  kuiSize?: KendoSize;
}

export interface KendoRadioGroupProps<TValue = unknown> extends KendoHintProps {
  options?: KendoOption<TValue>[];
  layout?: 'horizontal' | 'vertical';
  kuiSize?: KendoSize;
}

export interface KendoDropDownListProps<TValue = unknown> extends KendoHintProps {
  options?: KendoOption<TValue>[];
  /** Placeholder entry shown when nothing is selected. */
  defaultItem?: string;
  filterable?: boolean;
  kuiSize?: KendoSize;
  rounded?: KendoRounded;
  fillMode?: KendoFillMode;
}

export interface KendoDatePickerProps extends KendoHintProps {
  placeholder?: string;
  /** A Kendo date format string, e.g. 'dd/MM/yyyy'. */
  format?: string;
  /** ISO date string, e.g. '2020-01-01'. */
  min?: string;
  /** ISO date string, e.g. '2030-12-31'. */
  max?: string;
  weekNumber?: boolean;
  kuiSize?: KendoSize;
  rounded?: KendoRounded;
  fillMode?: KendoFillMode;
}

export interface KendoButtonProps {
  kuiSize?: KendoButtonSize;
  themeColor?: KendoThemeColor;
  fillMode?: KendoButtonFillMode;
  rounded?: KendoRounded;
  /** A Kendo font icon name, e.g. 'check', 'plus', 'trash'. */
  icon?: string;
  title?: string;
}

export interface KendoRepeaterProps {
  /** Heading above each repeated item, suffixed with the 1-based index. */
  title?: string;
  addLabel?: string;
  removeLabel?: string;
  /** Maximum number of items. The add button is disabled once reached. */
  limit?: number;
}

export interface KendoFlexProps {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justify?: 'start' | 'center' | 'end' | 'stretch' | 'space-between' | 'space-around';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap?: boolean;
  /** Gap between children, in pixels. */
  gap?: number;
  /** Padding around the children, in pixels. */
  padding?: number;
}
