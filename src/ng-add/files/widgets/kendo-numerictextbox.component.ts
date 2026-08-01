import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import {
  ErrorComponent,
  HintComponent,
  NumericTextBoxComponent,
} from '@progress/kendo-angular-inputs';

interface KendoNumericInputProps {
  placeholder?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  format?: string;
  spinners?: boolean;
}

@Component({
  selector: 'app-kendo-numerictextbox',
  imports: [NumericTextBoxComponent, HintComponent, ErrorComponent],
  providers: [InputWidgetAdapter],
  host: {
    class: 'kendo-widget gui-field',
    '[style.flex]': 'adapter.templateData().size',
  },
  template: `
    @let templateData = adapter.templateData();
    @let errors = templateData.errors ?? [];

    @if (templateData.label) {
      <label class="k-label" [for]="widget.uid">
        {{ templateData.label }}
        @if (templateData.validator?.required) {
          <span class="k-required">*</span>
        }
      </label>
    }
    @if (templateData.hint) {
      <kendo-formhint>{{ templateData.hint }}</kendo-formhint>
    }
    <kendo-numerictextbox
      [focusableId]="widget.uid"
      [value]="numericValue"
      [placeholder]="templateData.placeholder ?? ''"
      [disabled]="templateData.disabled ?? false"
      [readonly]="templateData.readonly ?? false"
      [min]="numericMin"
      [max]="numericMax"
      [step]="templateData.step ?? 1"
      [format]="templateData.format ?? 'n0'"
      [spinners]="templateData.spinners ?? true"
      (valueChange)="adapter.valueChanged($event)"
      (blur)="adapter.onBlur()"
    ></kendo-numerictextbox>
    @if (templateData.touched && errors.length) {
      <kendo-formerror>{{ errors.join(' ') }}</kendo-formerror>
    }
  `,
})
export class KendoNumericInputComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<number>;

  protected readonly adapter: InputWidgetAdapter<number, KendoNumericInputProps> =
    inject(InputWidgetAdapter);

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
