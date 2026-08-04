import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import type { KendoNumericTextBoxProps } from 'golemui-kendo';
import { NumericTextBoxComponent } from '@progress/kendo-angular-inputs';
import { KendoFieldComponent } from './kendo-field.component';

@Component({
  selector: 'app-kendo-numerictextbox',
  imports: [NumericTextBoxComponent, KendoFieldComponent],
  providers: [InputWidgetAdapter],
  host: {
    class: 'kendo-widget',
    '[style.flex]': 'adapter.templateData().size',
  },
  template: `
    @let templateData = adapter.templateData();

    <app-kendo-field
      [label]="templateData.label"
      [hint]="templateData.hint"
      [errors]="templateData.errors ?? []"
      [touched]="templateData.touched ?? false"
      [required]="!!templateData.validator?.required"
      [for]="widget.uid"
    >
      <kendo-numerictextbox
        [focusableId]="widget.uid"
        [value]="numericValue"
        [min]="numericMin"
        [max]="numericMax"
        [placeholder]="templateData.placeholder ?? ''"
        [disabled]="templateData.disabled ?? false"
        [readonly]="templateData.readonly ?? false"
        [size]="templateData.kuiSize ?? 'medium'"
        [rounded]="templateData.rounded ?? 'medium'"
        [fillMode]="templateData.fillMode ?? 'solid'"
        [step]="templateData.step ?? 1"
        [format]="templateData.format ?? 'n0'"
        [spinners]="templateData.spinners ?? true"
        [autoCorrect]="templateData.autoCorrect ?? false"
        (valueChange)="adapter.valueChanged($event)"
        (blur)="adapter.onBlur()"
      ></kendo-numerictextbox>
    </app-kendo-field>
  `,
})
export class KendoNumericInputComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<number>;

  protected readonly adapter: InputWidgetAdapter<number, KendoNumericTextBoxProps> =
    inject(InputWidgetAdapter);

  // Kendo types value/min/max as non-nullable `number`, but all three are
  // genuinely absent until the user types or the author sets a bound. These
  // getters keep the runtime `undefined` while satisfying the template types.
  protected get numericValue(): number {
    return this.adapter.templateData().value as number;
  }

  protected get numericMin(): number {
    return this.adapter.templateData().min as number;
  }

  protected get numericMax(): number {
    return this.adapter.templateData().max as number;
  }

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
