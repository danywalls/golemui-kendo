import { Component } from '@angular/core';
import { kendo, type KendoFormInitConfig } from 'golemui-kendo';
import { DemoPageComponent } from '../components/demo-page.component';

const repeaterForm = [
  kendo.inputs.textBox('eventName', { label: 'Event name', validator: { required: true } }),

  kendo.inputs.repeater(
    'guests',
    [
      kendo.layouts.row([
        kendo.inputs.textBox('name', { label: 'Name', validator: { required: true } }),
        kendo.inputs.numericTextBox('age', { label: 'Age', min: 0, max: 120 }),
      ]),
      kendo.inputs.dropDownList('meal', {
        label: 'Meal',
        defaultItem: 'Pick a meal',
        options: [
          { text: 'Standard', value: 'standard' },
          { text: 'Vegetarian', value: 'vegetarian' },
          { text: 'Vegan', value: 'vegan' },
        ],
      }),

      // A repeater inside a repeater. Each nesting level applies its own prefix,
      // so these paths end up under guests.items.dietaryNotes.items.note.
      kendo.inputs.repeater('dietaryNotes', [kendo.inputs.textBox('note', { label: 'Note' })], {
        title: 'Note',
        addLabel: 'Add note',
        removeLabel: 'Remove note',
        limit: 3,
      }),
    ],
    {
      label: 'Guests',
      title: 'Guest',
      addLabel: 'Add guest',
      removeLabel: 'Remove guest',
      limit: 5,
      validator: { required: true, minItems: 1 },
    },
  ),

  kendo.actions.submitButton({ label: 'Save guest list' }),
];

@Component({
  selector: 'app-repeater-page',
  imports: [DemoPageComponent],
  template: `
    <app-demo-page
      title="Repeater"
      blurb="'repeater' is the second reserved core widget type: GolemUI core owns the collection semantics, so the catalog supplies the rendering and lets core drive the item scope. Child paths are written relative to the item and rewritten while walking, which is what makes nested repeaters work."
      [config]="config"
    />
  `,
})
export class RepeaterPage {
  protected config: KendoFormInitConfig = {
    formDef: repeaterForm,
    data: {
      eventName: 'Team offsite',
      guests: [{ name: 'Ada', age: 36, meal: 'vegetarian', dietaryNotes: [{ note: 'No nuts' }] }],
    },
  };
}
