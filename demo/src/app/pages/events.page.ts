import { Component } from '@angular/core';
import { kendo, type KendoOption, type KendoFormInitConfig } from 'golemui-kendo';
import { DemoPageComponent } from '../components/demo-page.component';
import { PriceSummaryComponent } from '../components/price-summary.component';

const CITIES_BY_COUNTRY: Record<string, KendoOption<string>[]> = {
  es: [
    { text: 'Barcelona', value: 'bcn' },
    { text: 'Madrid', value: 'mad' },
  ],
  ie: [
    { text: 'Dublin', value: 'dub' },
    { text: 'Cork', value: 'ork' },
  ],
  ar: [
    { text: 'Buenos Aires', value: 'bue' },
    { text: 'Cordoba', value: 'cor' },
  ],
};

const UNIT_PRICE = 24.5;

const eventsForm = [
  kendo.inputs.dropDownList('country', {
    label: 'Country',
    defaultItem: 'Pick a country',
    options: [
      { text: 'Spain', value: 'es' },
      { text: 'Ireland', value: 'ie' },
      { text: 'Argentina', value: 'ar' },
    ],
    // `update` pushes a property change into another widget, which is how one
    // field repopulates another without the host holding any form state. It
    // dispatches OVERRIDE_WIDGET_PROP, so it changes widget props, not values.
    onChange: (event) => {
      const country = event.data['country'] as string | undefined;
      event.update({ path: 'city', options: country ? (CITIES_BY_COUNTRY[country] ?? []) : [] });
    },
  }),

  kendo.inputs.dropDownList('city', {
    label: 'City',
    defaultItem: 'Pick a city',
    options: [],
    disabled: { when: '!$form.country' },
  }),

  kendo.inputs.numericTextBox('quantity', { label: 'Quantity', min: 1, max: 50 }),

  kendo.inputs.textBox('couponCode', ({ $form }) => ({
    label: 'Coupon code',
    hint: ($form['quantity'] ?? 0) >= 10 ? 'Bulk orders already get 10% off.' : 'Optional.',
  })),

  kendo.displays.render(({ $form }) => ({
    component: PriceSummaryComponent,
    api: { label: 'Order total', total: (($form['quantity'] as number) ?? 0) * UNIT_PRICE },
  })),

  kendo.layouts.row(
    [
      kendo.actions.button({ label: 'Request a quote', onClick: () => 'quoteRequested' }),
      kendo.actions.submitButton({ label: 'Order' }),
    ],
    { justify: 'end' },
  ),
];

@Component({
  selector: 'app-events-page',
  imports: [DemoPageComponent],
  template: `
    <app-demo-page
      title="Events"
      blurb="onChange and onClick handlers receive the form's data plus an update() that pushes property changes into other widgets. A handler that just returns a string names a host-managed event instead, which arrives on the (formEvent) output. Pick a country to repopulate the city list, and change the quantity to watch the rendered summary and the coupon hint follow along."
      [config]="config"
    />
  `,
})
export class EventsPage {
  protected config: KendoFormInitConfig = {
    formDef: eventsForm,
    data: { quantity: 2 },
  };
}
