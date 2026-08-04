import { Component } from '@angular/core';
import { kendo, type KendoFormInitConfig } from 'golemui-kendo';
import { DemoPageComponent } from '../components/demo-page.component';

const COUNTRIES = [
  { text: 'Spain', value: 'es' },
  { text: 'Ireland', value: 'ie' },
  { text: 'Argentina', value: 'ar' },
  { text: 'Japan', value: 'jp' },
];

/**
 * Every widget the catalog registers, in one form. Note that none of these calls
 * pass a label: the pipeline derives one from the data path unless you set it.
 */
const catalogForm = [
  kendo.layouts.row([
    kendo.inputs.textBox('firstName', { validator: { required: true } }),
    kendo.inputs.textBox('lastName'),
  ]),

  kendo.inputs.textBox('email', {
    label: 'Email address',
    placeholder: 'you@example.com',
    hint: 'We only use this to send the receipt.',
    clearButton: true,
    validator: { required: true, format: 'email' },
  }),

  kendo.inputs.passwordBox('password', {
    hint: 'At least 8 characters.',
    validator: { required: true, minLength: 8 },
  }),

  kendo.layouts.row([
    kendo.inputs.numericTextBox('age', {
      min: 18,
      max: 120,
      validator: { required: true, min: 18 },
    }),
    kendo.inputs.numericTextBox('budget', {
      label: 'Budget',
      format: 'c2',
      step: 50,
      min: 0,
      spinners: false,
    }),
  ]),

  kendo.layouts.row([
    kendo.inputs.dropDownList('country', {
      defaultItem: 'Pick a country',
      filterable: true,
      options: COUNTRIES,
      validator: { required: true },
    }),
    kendo.inputs.datePicker('startDate', { label: 'Start date', hint: 'Stored as an ISO date.' }),
  ]),

  kendo.inputs.radioGroup('plan', {
    label: 'Plan',
    layout: 'horizontal',
    options: [
      { text: 'Free', value: 'free' },
      { text: 'Pro', value: 'pro' },
      { text: 'Enterprise', value: 'enterprise', disabled: true },
    ],
    validator: { required: true },
  }),

  kendo.inputs.textArea('bio', {
    placeholder: 'Tell us about yourself...',
    rows: 3,
    maxlength: 280,
  }),

  kendo.layouts.row([
    kendo.inputs.switch('newsletter', { label: 'Newsletter', onLabel: 'YES', offLabel: 'NO' }),
    kendo.inputs.checkbox('terms', {
      label: 'I accept the terms',
      validator: { required: true },
    }),
  ]),

  kendo.layouts.row(
    [
      kendo.actions.button({ label: 'Cancel', fillMode: 'outline' }),
      kendo.actions.submitButton({ label: 'Create account', disabled: { when: '$formIsInvalid' } }),
    ],
    { justify: 'end' },
  ),
];

@Component({
  selector: 'app-catalog-page',
  imports: [DemoPageComponent],
  template: `
    <app-demo-page
      title="Catalog"
      blurb="Every widget type the Kendo set registers. Labels and placeholders are derived from the data path unless you set them, and validators are written without a type discriminator because each widget already knows its value type."
      [config]="config"
    />
  `,
})
export class CatalogPage {
  protected config: KendoFormInitConfig = {
    formDef: catalogForm,
    data: { country: 'es', plan: 'pro', newsletter: true },
    validateOn: 'eager',
  };
}
