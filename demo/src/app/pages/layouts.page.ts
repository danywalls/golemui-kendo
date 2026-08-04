import { Component } from '@angular/core';
import { kendo, type KendoFormInitConfig } from 'golemui-kendo';
import { DemoPageComponent } from '../components/demo-page.component';

const layoutsForm = [
  kendo.layouts.row([
    kendo.inputs.textBox('street', { label: 'Street', size: 3 }),
    kendo.inputs.textBox('number', { label: 'No.', size: 1 }),
  ]),

  kendo.layouts.row([
    kendo.inputs.textBox('postalCode', { label: 'Postal code' }),
    kendo.inputs.textBox('city', { label: 'City' }),
    kendo.inputs.textBox('region', { label: 'Region' }),
  ]),

  // A column inside a row: the left half stacks two fields, the right half one.
  kendo.layouts.row([
    kendo.layouts.column([
      kendo.inputs.textBox('contactName', { label: 'Contact name' }),
      kendo.inputs.textBox('contactPhone', { label: 'Contact phone' }),
    ]),
    kendo.layouts.column([
      kendo.inputs.textArea('deliveryNotes', { label: 'Delivery notes', rows: 5 }),
    ]),
  ]),

  // `flex` takes the raw props, so any arrangement the CSS model supports is
  // available without a new widget type.
  kendo.layouts.flex(
    [
      kendo.inputs.checkbox('billingSameAsShipping', { label: 'Billing = shipping' }),
      kendo.inputs.checkbox('giftWrap', { label: 'Gift wrap' }),
      kendo.inputs.checkbox('priority', { label: 'Priority' }),
    ],
    { direction: 'row', wrap: true, gap: 24, justify: 'space-between' },
  ),

  kendo.layouts.row([kendo.actions.submitButton({ label: 'Save address' })], { justify: 'end' }),
];

@Component({
  selector: 'app-layouts-page',
  imports: [DemoPageComponent],
  template: `
    <app-demo-page
      title="Layouts"
      blurb="flex, row and column nest freely. The reserved 'flex' widget type is what GolemUI core mints for the synthetic form root, so it is the one type name the catalog cannot rename. Use the size property to set a widget's flex ratio inside its parent."
      [config]="config"
    />
  `,
})
export class LayoutsPage {
  protected config: KendoFormInitConfig = { formDef: layoutsForm };
}
