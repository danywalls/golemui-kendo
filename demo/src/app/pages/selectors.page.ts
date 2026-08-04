import { Component } from '@angular/core';
import { kendo, type KendoFormInitConfig } from 'golemui-kendo';
import { DemoPageComponent } from '../components/demo-page.component';

// Tags are the third argument of every factory. They carry no meaning of their
// own: they exist so selectors can address a group of widgets after the fact.
const selectorsForm = [
  kendo.inputs.textBox('cardHolder', {}, ['billing']),
  kendo.inputs.textBox('cardNumber', { uid: 'cardNumber' }, ['billing', 'sensitive']),
  kendo.inputs.textBox('cvc', {}, ['billing', 'sensitive']),

  kendo.inputs.textBox('shippingName'),
  kendo.inputs.textBox('shippingCity'),

  kendo.inputs.numericTextBox('quantity', { min: 1, max: 99 }),

  kendo.actions.submitButton({ label: 'Pay' }),
];

const selectors = [
  // Umbrella: every widget registered with kind 'input', whatever its type.
  kendo.selectors.inputs({ override: { kuiSize: 'medium' } }),

  // By tag: only the widgets carrying 'billing'.
  kendo.selectors.tag('billing').inputs({ suppressAutomaticPlaceholders: true }),

  // By several tags at once.
  kendo.selectors.tagsAnd(['billing', 'sensitive']).textBoxes({
    override: { hint: 'Never stored in plain text.' },
  }),

  // By exact widget type: numeric text boxes only.
  kendo.selectors.numericTextBoxes({ override: { spinners: false } }),

  // By uid. Selector matching runs before the pipeline assigns uids, so this
  // only reaches widgets whose uid was set explicitly in the definition.
  kendo.selectors.textBoxByUid('cardNumber', {
    override: { label: 'Card number', placeholder: '4242 4242 4242 4242' },
  }),

  // An override can also be computed from the widget as authored.
  kendo.selectors.textBoxes({
    override: (current) => ({ title: `Field: ${current.path ?? 'unnamed'}` }),
  }),
];

@Component({
  selector: 'app-selectors-page',
  imports: [DemoPageComponent],
  template: `
    <app-demo-page
      title="Selectors"
      blurb="Selectors decorate widgets after they are declared, so cross-cutting rules live in one place instead of being repeated on every field. They match by umbrella kind, by exact widget type, by tag, or by explicit uid, and the override can be a value or a function of the current widget."
      [config]="config"
    />
  `,
})
export class SelectorsPage {
  protected config: KendoFormInitConfig = {
    formDef: selectorsForm,
    formSelectors: selectors,
  };
}
