import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import {
  ErrorComponent,
  HintComponent,
  TextBoxComponent,
} from '@progress/kendo-angular-inputs';

interface KendoTextInputProps {
  placeholder?: string;
  hint?: string;
  kuiSize?: 'small' | 'medium' | 'large';
  clearButton?: boolean;
}

@Component({
  selector: 'app-kendo-textinput',
  imports: [TextBoxComponent, HintComponent, ErrorComponent],
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
    <kendo-textbox
      [focusableId]="widget.uid"
      [type]="inputType"
      [value]="templateData.value ?? ''"
      [placeholder]="templateData.placeholder ?? ''"
      [disabled]="templateData.disabled ?? false"
      [readonly]="templateData.readonly ?? false"
      [size]="templateData.kuiSize ?? 'medium'"
      [clearButton]="templateData.clearButton ?? false"
      [showErrorIcon]="!!(templateData.touched && errors.length)"
      (valueChange)="adapter.valueChanged($event)"
      (blur)="adapter.onBlur()"
    ></kendo-textbox>
    @if (templateData.touched && errors.length) {
      <kendo-formerror>{{ errors.join(' ') }}</kendo-formerror>
    }
  `,
})
export class KendoTextInputComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<string>;

  protected readonly adapter: InputWidgetAdapter<string, KendoTextInputProps> =
    inject(InputWidgetAdapter);

  protected get inputType(): 'text' | 'password' {
    return this.widget.type === 'kendo-passwordbox' ? 'password' : 'text';
  }

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
