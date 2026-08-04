import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import type { KendoSwitchProps } from 'golemui-kendo';
import { SwitchComponent } from '@progress/kendo-angular-inputs';
import { KendoFieldComponent } from './kendo-field.component';

@Component({
  selector: 'app-kendo-switch',
  imports: [SwitchComponent, KendoFieldComponent],
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
      <span class="kendo-switch__inline">
        <kendo-switch
          [focusableId]="widget.uid"
          [checked]="templateData.value === true"
          [disabled]="templateData.disabled ?? false"
          [size]="templateData.kuiSize ?? 'medium'"
          [onLabel]="templateData.onLabel ?? 'ON'"
          [offLabel]="templateData.offLabel ?? 'OFF'"
          (valueChange)="adapter.valueChanged($event)"
          (blur)="adapter.onBlur()"
        ></kendo-switch>
        @if (templateData.label) {
          <label class="k-label" [attr.for]="widget.uid">
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
    .kendo-switch__inline {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  `,
})
export class KendoSwitchComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<boolean>;

  protected readonly adapter: InputWidgetAdapter<boolean, KendoSwitchProps> =
    inject(InputWidgetAdapter);

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
