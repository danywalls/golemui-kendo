import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import { KENDO_WIDGET_TYPES, type KendoTextBoxProps } from 'golemui-kendo';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { KendoFieldComponent } from './kendo-field.component';

/**
 * Renders both `kendo-textbox` and `kendo-passwordbox`: the two widget types
 * differ only in the underlying input's `type` attribute.
 */
@Component({
  selector: 'app-kendo-textinput',
  imports: [TextBoxComponent, KendoFieldComponent],
  providers: [InputWidgetAdapter],
  host: {
    class: 'kendo-widget',
    '[style.flex]': 'adapter.templateData().size',
  },
  template: `
    @let templateData = adapter.templateData();
    @let errors = templateData.errors ?? [];
    @let showErrors = !!templateData.touched && errors.length > 0;

    <app-kendo-field
      [label]="templateData.label"
      [hint]="templateData.hint"
      [errors]="errors"
      [touched]="templateData.touched ?? false"
      [required]="!!templateData.validator?.required"
      [for]="widget.uid"
    >
      <kendo-textbox
        [focusableId]="widget.uid"
        [type]="inputType"
        [value]="templateData.value ?? ''"
        [placeholder]="templateData.placeholder ?? ''"
        [disabled]="templateData.disabled ?? false"
        [readonly]="templateData.readonly ?? false"
        [size]="templateData.kuiSize ?? 'medium'"
        [rounded]="templateData.rounded ?? 'medium'"
        [fillMode]="templateData.fillMode ?? 'solid'"
        [clearButton]="templateData.clearButton ?? false"
        [maxlength]="maxLength"
        [title]="templateData.title ?? ''"
        [showErrorIcon]="showErrors"
        (valueChange)="adapter.valueChanged($event)"
        (blur)="adapter.onBlur()"
      ></kendo-textbox>
    </app-kendo-field>
  `,
})
export class KendoTextInputComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<string>;

  protected readonly adapter: InputWidgetAdapter<string, KendoTextBoxProps> =
    inject(InputWidgetAdapter);

  protected get inputType(): 'text' | 'password' {
    return this.widget.type === KENDO_WIDGET_TYPES.passwordBox ? 'password' : 'text';
  }

  // Kendo types maxlength as a non-nullable number but has no default, so an
  // unset limit has to reach it as undefined rather than as a sentinel.
  protected get maxLength(): number {
    return this.adapter.templateData().maxlength as number;
  }

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
