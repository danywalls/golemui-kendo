import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import type { KendoRadioGroupProps } from 'golemui-kendo';
import { RadioButtonDirective } from '@progress/kendo-angular-inputs';
import { KendoFieldComponent } from './kendo-field.component';

@Component({
  selector: 'app-kendo-radiogroup',
  imports: [RadioButtonDirective, KendoFieldComponent],
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
    >
      <div
        role="radiogroup"
        class="kendo-radiogroup__options"
        [class.kendo-radiogroup__options--horizontal]="templateData.layout === 'horizontal'"
        [attr.aria-label]="templateData.label"
      >
        @for (option of templateData.options ?? []; track option.value) {
          <span class="kendo-radiogroup__option">
            <input
              kendoRadioButton
              type="radio"
              [attr.id]="optionId($index)"
              [attr.name]="widget.uid"
              [size]="templateData.kuiSize ?? 'medium'"
              [checked]="templateData.value === option.value"
              [disabled]="(templateData.disabled ?? false) || (option.disabled ?? false)"
              (change)="adapter.valueChanged(option.value)"
              (blur)="adapter.onBlur()"
            />
            <label class="k-radio-label" [attr.for]="optionId($index)">{{ option.text }}</label>
          </span>
        }
      </div>
    </app-kendo-field>
  `,
  styles: `
    .kendo-radiogroup__options {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .kendo-radiogroup__options--horizontal {
      flex-direction: row;
      gap: 16px;
    }
    .kendo-radiogroup__option {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
  `,
})
export class KendoRadioGroupComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<unknown>;

  protected readonly adapter: InputWidgetAdapter<unknown, KendoRadioGroupProps> =
    inject(InputWidgetAdapter);

  /** Radio inputs need distinct ids so each label targets its own option. */
  protected optionId(index: number): string {
    return `${this.widget.uid}-${index}`;
  }

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
