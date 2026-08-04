import { Component, computed, input } from '@angular/core';
import { ErrorComponent, HintComponent } from '@progress/kendo-angular-inputs';

/**
 * The chrome every Kendo input widget shares: label, required marker, hint and
 * validation errors around a projected control.
 *
 * Kendo's own `<kendo-formfield>` derives its state from an Angular `NgControl`,
 * which GolemUI widgets do not have (the form state lives in the GolemUI store),
 * so the pieces are composed directly instead.
 */
@Component({
  selector: 'app-kendo-field',
  imports: [HintComponent, ErrorComponent],
  host: { class: 'kendo-field' },
  template: `
    @if (label()) {
      <label class="k-label" [attr.for]="for()">
        {{ label() }}
        @if (required()) {
          <span class="k-required">*</span>
        }
      </label>
    }

    <ng-content />

    @if (hint() && !showErrors()) {
      <kendo-formhint>{{ hint() }}</kendo-formhint>
    }
    @if (showErrors()) {
      <kendo-formerror>{{ errors().join(' ') }}</kendo-formerror>
    }
  `,
  styles: `
    .kendo-field {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  `,
})
export class KendoFieldComponent {
  label = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);
  errors = input<string[]>([]);
  touched = input<boolean>(false);
  required = input<boolean>(false);
  /** The id of the projected control, so the label points at it. */
  for = input<string | undefined>(undefined);

  protected showErrors = computed(() => this.touched() && this.errors().length > 0);
}
