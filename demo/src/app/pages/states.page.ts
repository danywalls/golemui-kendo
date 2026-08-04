import { Component } from '@angular/core';
import { kendo, type KendoFormInitConfig } from 'golemui-kendo';
import { DemoPageComponent } from '../components/demo-page.component';

// A state is a named reactive expression. Widgets can appear only while a state
// is active, and can carry per-state property overrides.
const states = {
  business: '$form.accountType === "business"',
  review: '$form.confirmed === true',
} as const;

const statesForm = [
  kendo.inputs.radioGroup('accountType', {
    label: 'Account type',
    layout: 'horizontal',
    options: [
      { text: 'Personal', value: 'personal' },
      { text: 'Business', value: 'business' },
    ],
  }),

  kendo.inputs.textBox('fullName', { label: 'Full name', states: { review: { readonly: true } } }),

  // Only rendered while the `business` state is active.
  kendo.inputs.textBox('companyName', {
    label: 'Company name',
    states: { business: { visible: true } },
  }),
  kendo.inputs.textBox('vatNumber', {
    label: 'VAT number',
    states: { business: { visible: true }, review: { readonly: true } },
  }),

  // `include`/`exclude` take a reactive expression directly when a named state
  // would be overkill.
  kendo.inputs.textArea('purchaseOrder', {
    label: 'Purchase order',
    rows: 2,
    include: { when: '$form.accountType === "business" && $form.budget > 1000' },
  }),

  kendo.inputs.numericTextBox('budget', { label: 'Budget', min: 0, step: 100 }),

  kendo.inputs.checkbox('confirmed', {
    label: 'Everything above is correct',
  }),

  kendo.actions.submitButton({
    label: 'Submit',
    disabled: { when: '$form.confirmed !== true' },
  }),
];

@Component({
  selector: 'app-states-page',
  imports: [DemoPageComponent],
  template: `
    <app-demo-page
      title="States"
      blurb="Declare named states as reactive expressions in formConfig, then attach per-state overrides to any widget. 'visible' becomes a core include condition; every other property becomes a state-suffixed prop that wins while the state is active. Pick 'business' to reveal two fields, then tick the confirmation to make the visible fields read-only."
      [config]="config"
    />
  `,
})
export class StatesPage {
  protected config: KendoFormInitConfig = {
    formDef: statesForm,
    formConfig: { states },
    data: { accountType: 'personal', budget: 0 },
  };
}
