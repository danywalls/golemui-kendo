import { Component } from '@angular/core';
import { KENDO_WIDGET_TYPES, type KendoFormInitConfig } from 'golemui-kendo';
import { DemoPageComponent } from '../components/demo-page.component';

const jsonForm = {
  form: {
    kind: 'layout',
    type: KENDO_WIDGET_TYPES.flex,
    uid: '#root',
    props: { direction: 'column', gap: 16 },
    children: [
      {
        kind: 'input',
        type: KENDO_WIDGET_TYPES.textBox,
        uid: 'email',
        path: 'email',
        label: 'Email address',
        validator: { type: 'string', required: true, format: 'email' },
        props: { placeholder: 'you@example.com', clearButton: true },
      },
      {
        kind: 'input',
        type: KENDO_WIDGET_TYPES.numericTextBox,
        uid: 'seats',
        path: 'seats',
        label: 'Seats',
        validator: { type: 'number', required: true, min: 1 },
        props: { min: 1, max: 200, spinners: true },
      },
      {
        kind: 'input',
        type: KENDO_WIDGET_TYPES.checkbox,
        uid: 'terms',
        path: 'terms',
        label: 'I accept the terms',
        validator: { type: 'boolean', required: true },
        props: {},
      },
      {
        kind: 'action',
        type: KENDO_WIDGET_TYPES.button,
        uid: 'submit',
        actionType: 'submit',
        label: 'Subscribe',
        disabled: { when: '$formIsInvalid' },
        props: { themeColor: 'primary' },
      },
    ],
  },
};

@Component({
  selector: 'app-json-page',
  imports: [DemoPageComponent],
  template: `
    <app-demo-page
      title="JSON"
      blurb="The builders are a convenience, not a requirement. A form definition is plain data, so it can come from a server, a CMS, or a code generator, and the same widget components render it. This page is the same widget set driven by a hand-written core definition."
      [config]="config"
    />
  `,
})
export class JsonPage {
  protected config: KendoFormInitConfig = {
    formDef: jsonForm,
    data: { seats: 1 },
  };
}
