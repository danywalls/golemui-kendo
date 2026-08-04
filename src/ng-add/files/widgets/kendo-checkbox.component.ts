import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import type { KendoCheckboxProps } from 'golemui-kendo';
import { CheckBoxComponent } from '@progress/kendo-angular-inputs';
import { KendoFieldComponent } from './kendo-field.component';

/**
 * The label sits beside the box rather than above it, so this widget projects
 * its own label and leaves the field shell to render only hint and errors.
 */
@Component({
  selector: 'app-kendo-checkbox',
  imports: [CheckBoxComponent, KendoFieldComponent],
  providers: [InputWidgetAdapter],
  host: {
    class: 'kendo-widget',
    '[style.flex]': 'adapter.templateData().size',
  },
  template: `
    @let templateData = adapter.templateData();

    <app-kendo-field
      [hint]="templateData.hint"
      [errors]="templateData.errors ?? []"
      [touched]="templateData.touched ?? false"
    >
      <span class="k-checkbox-wrap kendo-checkbox__inline">
        <kendo-checkbox
          [focusableId]="widget.uid"
          [checkedState]="templateData.value === true"
          [disabled]="templateData.disabled ?? false"
          [size]="templateData.kuiSize ?? 'medium'"
          (checkedStateChange)="onCheckedChange($event)"
          (blur)="adapter.onBlur()"
        ></kendo-checkbox>
        @if (templateData.label) {
          <label class="k-checkbox-label" [attr.for]="widget.uid">
            {{ templateData.label }}
            @if (templateData.validator?.required) {
              <span class="k-required">*</span>
            }
          </label>
        }
      </span>
    </app-kendo-field>
  `,
  styles: `
    .kendo-checkbox__inline {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  `,
})
export class KendoCheckboxComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<boolean>;

  protected readonly adapter: InputWidgetAdapter<boolean, KendoCheckboxProps> =
    inject(InputWidgetAdapter);

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }

  // checkedState can be 'indeterminate'; the form value is strictly boolean.
  protected onCheckedChange(state: unknown): void {
    this.adapter.valueChanged(state === true);
  }
}
