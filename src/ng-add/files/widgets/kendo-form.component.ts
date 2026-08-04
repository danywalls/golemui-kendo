import { Component, input, output, viewChild, type Type } from '@angular/core';
import { provideWidgetSet, WidgetSetFormComponent, type AngularWidgetSet } from '@golemui/angular';
import type { FormEvent, FormHealth, FormSubmitEvent } from '@golemui/core';
import { initValidators } from '@golemui/gui-validators';
import { resolveFormInput, type KendoFormInitConfig } from 'golemui-kendo';
import { kendoWidgetLoaders } from './kendo-widget-loaders';

/**
 * The widget set definition: the three-piece contract between the Kendo
 * catalog and GolemUI's generic widget set form component. Resolution, loader
 * and dependency merging, and validator wiring all happen inside
 * `<gui-widget-set-form>`.
 */
const kendoWidgetSet: AngularWidgetSet<KendoFormInitConfig> = {
  widgetLoaders: kendoWidgetLoaders,
  validators: initValidators,
  resolveFormInput,
};

/**
 * The Kendo form host: a thin wrapper that pins the widget set provider and
 * the typed `config` input.
 *
 * @example
 * <kendo-form [config]="config" (formSubmit)="save($event)"></kendo-form>
 */
@Component({
  selector: 'kendo-form',
  imports: [WidgetSetFormComponent],
  providers: [provideWidgetSet(kendoWidgetSet)],
  template: `
    <gui-widget-set-form
      [config]="config()"
      [autocomplete]="autocomplete()"
      [formHealthBoundary]="formHealthBoundary()"
      (formHealth)="formHealth.emit($event)"
      (formEvent)="formEvent.emit($event)"
      (formSubmit)="formSubmit.emit($event)"
    ></gui-widget-set-form>
  `,
})
export class KendoFormComponent {
  config = input.required<KendoFormInitConfig>();
  autocomplete = input<string | undefined>(undefined);
  /** Wraps the form and renders the error UI for an errored FormHealth. */
  formHealthBoundary = input<Type<unknown> | undefined>(undefined);

  formHealth = output<FormHealth>();
  formEvent = output<FormEvent>();
  formSubmit = output<FormSubmitEvent>();

  private coreForm = viewChild(WidgetSetFormComponent);

  setData(data: Record<string, any>): void {
    this.coreForm()?.setData(data);
  }

  setMeta(meta: Record<string, any>): void {
    this.coreForm()?.setMeta(meta);
  }
}
