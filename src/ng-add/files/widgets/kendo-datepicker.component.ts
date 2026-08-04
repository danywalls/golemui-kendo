import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter } from '@golemui/angular';
import type { InputWidget, WithWidget } from '@golemui/core';
import type { KendoDatePickerProps } from 'golemui-kendo';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { KendoFieldComponent } from './kendo-field.component';

/**
 * Kendo works in `Date` objects but GolemUI form data has to stay
 * JSON-serializable, so the value is stored as an ISO date string
 * (`YYYY-MM-DD`) and converted at this boundary.
 */
@Component({
  selector: 'app-kendo-datepicker',
  imports: [DatePickerComponent, KendoFieldComponent],
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
      <kendo-datepicker
        [focusableId]="widget.uid"
        [value]="dateValue"
        [min]="minDate"
        [max]="maxDate"
        [placeholder]="templateData.placeholder ?? ''"
        [format]="templateData.format ?? 'dd/MM/yyyy'"
        [disabled]="templateData.disabled ?? false"
        [readonly]="templateData.readonly ?? false"
        [weekNumber]="templateData.weekNumber ?? false"
        [size]="templateData.kuiSize ?? 'medium'"
        [rounded]="templateData.rounded ?? 'medium'"
        [fillMode]="templateData.fillMode ?? 'solid'"
        (valueChange)="onDateChange($event)"
        (blur)="adapter.onBlur()"
      ></kendo-datepicker>
    </app-kendo-field>
  `,
})
export class KendoDatePickerComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<string>;

  protected readonly adapter: InputWidgetAdapter<string, KendoDatePickerProps> =
    inject(InputWidgetAdapter);

  protected get dateValue(): Date {
    return toDate(this.adapter.templateData().value) as Date;
  }

  protected get minDate(): Date {
    return toDate(this.adapter.templateData().min) as Date;
  }

  protected get maxDate(): Date {
    return toDate(this.adapter.templateData().max) as Date;
  }

  protected onDateChange(date: Date | null): void {
    this.adapter.valueChanged(date ? toIsoDate(date) : null);
  }

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}

function toDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

/** Local calendar date, so a timezone west of UTC cannot shift the day back. */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
