import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import { ErrorComponent, SwitchComponent } from '@progress/kendo-angular-inputs';

interface KendoSwitchProps {
  onLabel?: string;
  offLabel?: string;
}

@Component({
  selector: 'app-kendo-switch',
  imports: [SwitchComponent, ErrorComponent],
  providers: [InputWidgetAdapter],
  host: {
    class: 'kendo-widget gui-field',
    '[style.flex]': 'adapter.templateData().size',
  },
  template: `
    @let templateData = adapter.templateData();
    @let errors = templateData.errors ?? [];

    <div class="k-switch-wrap">
      @if (templateData.label) {
        <label class="k-switch-label" [for]="widget.uid">{{ templateData.label }}</label>
      }
      <kendo-switch
        [focusableId]="widget.uid"
        [checked]="templateData.value === true"
        [disabled]="templateData.disabled ?? false"
        [onLabel]="templateData.onLabel ?? 'ON'"
        [offLabel]="templateData.offLabel ?? 'OFF'"
        (valueChange)="adapter.valueChanged($event)"
        (blur)="adapter.onBlur()"
      ></kendo-switch>
    </div>
    @if (templateData.touched && errors.length) {
      <kendo-formerror>{{ errors.join(' ') }}</kendo-formerror>
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
