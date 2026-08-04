import type { WidgetSetFormInitConfig } from '@golemui/dx';
import type { CustomValidatorSchemas } from '@golemui/gui-validators';

export interface KendoFormInitConfig extends WidgetSetFormInitConfig {
  /** Named validators referenced by `validator: { type: 'custom', ... }`. */
  customValidators?: CustomValidatorSchemas;
}
