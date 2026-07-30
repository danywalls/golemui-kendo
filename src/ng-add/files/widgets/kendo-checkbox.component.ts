import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import { CheckBoxComponent, ErrorComponent } from '@progress/kendo-angular-inputs';

interface KendoCheckboxProps {
  kuiSize?: 'small' | 'medium' | 'large';
}

@Component({
  selector: 'app-kendo-checkbox',
  imports: [CheckBoxComponent, ErrorComponent],
  providers: [InputWidgetAdapter],
  host: {
    class: 'kendo-widget gui-field',
    '[style.flex]': 'adapter.templateData().size',
  },
  template: `
    @let templateData = adapter.templateData();
    @let errors = templateData.errors ?? [];

    <span class="k-checkbox-wrap">
      <kendo-checkbox
        [focusableId]="widget.uid"
        [checkedState]="templateData.value === true"
        [disabled]="templateData.disabled ?? false"
        [size]="templateData.kuiSize ?? 'medium'"
        (checkedStateChange)="onCheckedChange($event)"
        (blur)="adapter.onBlur()"
      ></kendo-checkbox>
      @if (templateData.label) {
        <label class="k-checkbox-label" [for]="widget.uid">{{ templateData.label }}</label>
      }
    </span>
    @if (templateData.touched && errors.length) {
      <kendo-formerror>{{ errors.join(' ') }}</kendo-formerror>
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
