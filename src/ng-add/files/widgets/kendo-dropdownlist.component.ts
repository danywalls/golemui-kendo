import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import type { KendoDropDownListProps, KendoOption } from 'golemui-kendo';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { KendoFieldComponent } from './kendo-field.component';

@Component({
  selector: 'app-kendo-dropdownlist',
  imports: [DropDownListComponent, KendoFieldComponent],
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
      <kendo-dropdownlist
        [id]="widget.uid"
        [data]="templateData.options ?? []"
        textField="text"
        valueField="value"
        [valuePrimitive]="true"
        [value]="templateData.value"
        [defaultItem]="defaultItem"
        [disabled]="templateData.disabled ?? false"
        [readonly]="templateData.readonly ?? false"
        [filterable]="templateData.filterable ?? false"
        [size]="templateData.kuiSize ?? 'medium'"
        [rounded]="templateData.rounded ?? 'medium'"
        [fillMode]="templateData.fillMode ?? 'solid'"
        (valueChange)="adapter.valueChanged($event)"
        (filterChange)="adapter.filterChanged($event)"
        (blur)="adapter.onBlur()"
      ></kendo-dropdownlist>
    </app-kendo-field>
  `,
})
export class KendoDropDownListComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<unknown>;

  protected readonly adapter: InputWidgetAdapter<unknown, KendoDropDownListProps> =
    inject(InputWidgetAdapter);

  /**
   * Kendo's `defaultItem` has to match the data shape, so the author's plain
   * placeholder string is wrapped into an option with an empty value.
   */
  protected get defaultItem(): KendoOption | undefined {
    const text = this.adapter.templateData().defaultItem;
    return text ? { text, value: null } : undefined;
  }

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
