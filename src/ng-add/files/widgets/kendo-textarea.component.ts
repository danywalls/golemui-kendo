import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import {
  ErrorComponent,
  HintComponent,
  TextAreaComponent,
} from '@progress/kendo-angular-inputs';

interface KendoTextAreaProps {
  placeholder?: string;
  hint?: string;
  rows?: number;
  resizable?: 'auto' | 'none' | 'vertical' | 'horizontal' | 'both';
  clearButton?: boolean;
}

@Component({
  selector: 'app-kendo-textarea',
  imports: [TextAreaComponent, HintComponent, ErrorComponent],
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
    <kendo-textarea
      [focusableId]="widget.uid"
      [value]="templateData.value ?? ''"
      [placeholder]="templateData.placeholder ?? ''"
      [disabled]="templateData.disabled ?? false"
      [readonly]="templateData.readonly ?? false"
      [rows]="templateData.rows ?? 3"
      [resizable]="templateData.resizable ?? 'auto'"
      (valueChange)="adapter.valueChanged($event)"
      (blur)="adapter.onBlur()"
    ></kendo-textarea>
    @if (templateData.touched && errors.length) {
      <kendo-formerror>{{ errors.join(' ') }}</kendo-formerror>
    }
  `,
})
export class KendoTextAreaComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<string>;

  protected readonly adapter: InputWidgetAdapter<string, KendoTextAreaProps> =
    inject(InputWidgetAdapter);

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
