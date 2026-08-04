import { describe, expect, it } from 'vitest';
import type { LayoutWidget } from '@golemui/core';
import { kendo, kendoImplementation } from './kendo';
import { kendoRegistry } from './registry';
import { KENDO_ITEM_TYPES, KENDO_WIDGET_TYPES } from './widget-types';

/**
 * Pipeline output as these tests read it. The core widget types make almost
 * every field optional, so keeping the real type here would mean a null check
 * in front of each assertion without making any of them stricter.
 */
type AnyWidget = any;

function processForm(...args: Parameters<typeof kendoImplementation.formDefs.processDxFacade>) {
  return kendoImplementation.formDefs.processDxFacade(...args);
}

/** The synthetic root layout every form is wrapped in. */
function rootOf(result: { form: { form: unknown } }): LayoutWidget & { children: AnyWidget[] } {
  return result.form.form as LayoutWidget & { children: AnyWidget[] };
}

function childrenOf(result: { form: { form: unknown } }): AnyWidget[] {
  return rootOf(result).children;
}

/** Evaluates a widget that the pipeline promoted to a runtime function. */
function evaluate(widget: unknown, params: Record<string, any> = {}): AnyWidget {
  return (widget as (p: any) => AnyWidget)(params);
}

describe('the kendo registry', () => {
  it('registers every widget type exactly once', () => {
    expect(kendoRegistry.getRegisteredItemTypes().sort()).toEqual(
      Object.values(KENDO_ITEM_TYPES).sort(),
    );
  });

  it('declares a kind for every widget type, so umbrella selectors reach them all', () => {
    for (const itemType of kendoRegistry.getRegisteredItemTypes()) {
      expect(kendoRegistry.getItemTypeKind(itemType), itemType).toBeDefined();
    }
  });

  it('groups the widget types by kind', () => {
    expect(kendoRegistry.getItemTypesOfKind('action')).toEqual([KENDO_ITEM_TYPES.button]);
    expect(kendoRegistry.getItemTypesOfKind('display')).toEqual([KENDO_ITEM_TYPES.display]);
    expect(kendoRegistry.getItemTypesOfKind('layout')).toEqual([KENDO_ITEM_TYPES.flex]);
    expect(kendoRegistry.getItemTypesOfKind('input')).toHaveLength(10);
  });
});

describe('the kendo namespace', () => {
  it('exposes the four facade groups plus the selector chain', () => {
    expect(Object.keys(kendo).sort()).toEqual([
      'actions',
      'displays',
      'inputs',
      'layouts',
      'selectors',
    ]);
  });

  it('exposes the generated umbrella and scope selector methods', () => {
    for (const method of ['inputs', 'actions', 'displays', 'layouts', 'tag', 'state', 'tagsOr']) {
      expect(typeof (kendo.selectors as Record<string, unknown>)[method], method).toBe('function');
    }
  });
});

describe('the reserved core contracts', () => {
  it('wraps top-level definitions in a flex root', () => {
    const root = rootOf(processForm([kendo.inputs.textBox('email')]));

    expect(root.kind).toBe('layout');
    expect(root.type).toBe(KENDO_WIDGET_TYPES.flex);
    expect(root.type).toBe('flex');
    expect(root.uid).toBe('#root');
  });

  it('emits the reserved repeater type with a flex template', () => {
    const [repeater] = childrenOf(
      processForm([kendo.inputs.repeater('guests', [kendo.inputs.textBox('name')])]),
    );

    expect(repeater.type).toBe('repeater');
    expect(repeater.props['template'].type).toBe('flex');
  });

  it('routes a bare render function through the display adapter', () => {
    const render = () => ({ component: 'SummaryComponent' });
    const [display] = childrenOf(processForm([render]));

    expect(evaluate(display).type).toBe(KENDO_WIDGET_TYPES.renderer);
  });

  it('keeps actionType submit on the widget, which is how core finds the submit action', () => {
    const [button] = childrenOf(processForm([kendo.actions.submitButton({ label: 'Send' })]));

    expect(button.kind).toBe('action');
    expect(button.actionType).toBe('submit');
    expect(button.label).toBe('Send');
  });
});

describe('standard keyed inputs', () => {
  it('takes the data path from the entry key and derives a label from it', () => {
    const [textBox] = childrenOf(processForm([kendo.inputs.textBox('billingAddress')]));

    expect(textBox.kind).toBe('input');
    expect(textBox.type).toBe(KENDO_WIDGET_TYPES.textBox);
    expect(textBox.path).toBe('billingAddress');
    expect(textBox.uid).toBe('billingAddress');
    // The label is title-cased from the path; the placeholder is the raw path.
    expect(textBox.label).toBe('Billing Address');
    expect(textBox.props['placeholder']).toBe('billingAddress');
  });

  it('keeps an explicit label and placeholder', () => {
    const [textBox] = childrenOf(
      processForm([kendo.inputs.textBox('email', { label: 'E-mail', placeholder: 'you@corp.com' })]),
    );

    expect(textBox.label).toBe('E-mail');
    expect(textBox.props['placeholder']).toBe('you@corp.com');
  });

  it('sends widget-specific props to props and core fields to the top level', () => {
    const [numeric] = childrenOf(
      processForm([
        kendo.inputs.numericTextBox('age', { min: 18, max: 120, spinners: true, readonly: true }),
      ]),
    );

    expect(numeric.readonly).toBe(true);
    expect(numeric.props).toEqual({
      placeholder: 'age',
      min: 18,
      max: 120,
      spinners: true,
    });
  });

  it('tags a rules-only validator with the widget value type', () => {
    const [numeric] = childrenOf(
      processForm([kendo.inputs.numericTextBox('age', { validator: { required: true, min: 18 } })]),
    );
    const [checkbox] = childrenOf(
      processForm([kendo.inputs.checkbox('terms', { validator: { required: true } })]),
    );

    expect(numeric.validator).toEqual({ type: 'number', required: true, min: 18 });
    expect(checkbox.validator).toEqual({ type: 'boolean', required: true });
  });

  it('does not auto-generate a placeholder for widgets that have none', () => {
    const [checkbox] = childrenOf(processForm([kendo.inputs.checkbox('acceptTerms')]));

    expect(checkbox.label).toBe('Accept Terms');
    expect(checkbox.props).toEqual({});
  });

  it('promotes an input to a runtime function when declared with a callback', () => {
    const [dropDown] = childrenOf(
      processForm([
        kendo.inputs.dropDownList('city', ({ $form }) => ({
          disabled: !$form['country'],
          options: [{ text: 'Barcelona', value: 'bcn' }],
        })),
      ]),
    );

    expect(evaluate(dropDown, { $form: {} }).disabled).toBe(true);
    expect(evaluate(dropDown, { $form: { country: 'ES' } }).disabled).toBe(false);
  });
});

describe('layouts', () => {
  it('nests children and defaults a flex to a column', () => {
    const [row] = childrenOf(
      processForm([
        kendo.layouts.row([kendo.inputs.textBox('firstName'), kendo.inputs.textBox('lastName')]),
      ]),
    );

    expect(row.kind).toBe('layout');
    expect(row.props['direction']).toBe('row');
    expect(row.children).toHaveLength(2);
    expect(kendo.layouts.flex([]).items[0]).toEqual({ def: {}, children: [] });
  });

  it('walks nested layouts recursively', () => {
    const [outer] = childrenOf(
      processForm([kendo.layouts.column([kendo.layouts.row([kendo.inputs.textBox('city')])])]),
    );

    expect(outer.children[0].children[0].path).toBe('city');
  });
});

describe('repeaters', () => {
  it('prefixes template child paths with the repeater path', () => {
    const [repeater] = childrenOf(
      processForm([
        kendo.inputs.repeater(
          'guests',
          [kendo.inputs.textBox('name'), kendo.inputs.numericTextBox('age')],
          { title: 'Guest', limit: 4 },
        ),
      ]),
    );

    const template = repeater.props['template'];
    expect(template.children.map((child: AnyWidget) => child.path)).toEqual([
      'guests.items.name',
      'guests.items.age',
    ]);
    expect(repeater.props['title']).toBe('Guest');
    expect(repeater.props['limit']).toBe(4);
  });

  it('prefixes paths inside nested layouts of the template', () => {
    const [repeater] = childrenOf(
      processForm([
        kendo.inputs.repeater('lines', [
          kendo.layouts.row([kendo.inputs.textBox('sku'), kendo.inputs.numericTextBox('qty')]),
        ]),
      ]),
    );

    const row = repeater.props['template'].children[0];
    expect(row.children.map((child: AnyWidget) => child.path)).toEqual([
      'lines.items.sku',
      'lines.items.qty',
    ]);
  });

  it('types a repeater validator as an array', () => {
    const [repeater] = childrenOf(
      processForm([kendo.inputs.repeater('guests', [], { validator: { minItems: 1 } })]),
    );

    expect(repeater.validator).toEqual({ type: 'array', minItems: 1 });
  });
});

describe('selectors', () => {
  it('applies a type selector to every widget of that type', () => {
    const children = childrenOf(
      processForm(
        [kendo.inputs.textBox('email'), kendo.inputs.numericTextBox('age')],
        [kendo.selectors.textBoxes({ override: { kuiSize: 'large' } })],
      ),
    );

    expect(children[0].props['kuiSize']).toBe('large');
    expect(children[1].props['kuiSize']).toBeUndefined();
  });

  it('reaches every input kind through the generated umbrella selector', () => {
    const children = childrenOf(
      processForm(
        [
          kendo.inputs.textBox('email'),
          kendo.inputs.datePicker('birthDate'),
          kendo.actions.button({ label: 'Send' }),
        ],
        [kendo.selectors.inputs({ override: { readonly: true } })],
      ),
    );

    expect(children[0].readonly).toBe(true);
    expect(children[1].readonly).toBe(true);
    expect(children[2].readonly).toBeUndefined();
  });

  it('narrows a selector to tagged widgets', () => {
    const children = childrenOf(
      processForm(
        [
          kendo.inputs.textBox('cardNumber', {}, ['billing']),
          kendo.inputs.textBox('nickname'),
        ],
        [kendo.selectors.tag('billing').inputs({ suppressAutomaticLabels: true })],
      ),
    );

    expect(children[0].label).toBeUndefined();
    expect(children[1].label).toBe('Nickname');
  });

  // Selector matching runs before the pipeline assigns uids, so a ByUid selector
  // only reaches widgets whose uid the author set explicitly.
  it('targets a single widget by its explicit uid', () => {
    const children = childrenOf(
      processForm(
        [kendo.inputs.textBox('email'), kendo.inputs.textBox('nickname', { uid: 'nickname' })],
        [kendo.selectors.textBoxByUid('nickname', { override: { placeholder: 'Optional' } })],
      ),
    );

    expect(children[0].props['placeholder']).toBe('email');
    expect(children[1].props['placeholder']).toBe('Optional');
  });

  it('computes an override from the widget as authored, before sensible defaults', () => {
    const [textBox] = childrenOf(
      processForm(
        [kendo.inputs.textBox('email')],
        [
          kendo.selectors.inputs({
            override: (current: any) => ({ placeholder: `Enter your ${current.path}` }),
          }),
        ],
      ),
    );

    expect(textBox.props['placeholder']).toBe('Enter your email');
  });
});

describe('states', () => {
  it('expands a per-state override into a state-suffixed prop', () => {
    const [textBox] = childrenOf(
      processForm(
        [kendo.inputs.textBox('email', { states: { review: { readonly: true } } })],
        undefined,
        { states: { review: '$form.step === 2' } },
      ),
    );

    expect(textBox['readonly.review']).toBe(true);
  });

  it('turns state visibility into a core include condition', () => {
    const [textBox] = childrenOf(
      processForm(
        [kendo.inputs.textBox('vatNumber', { states: { business: { visible: true } } })],
        undefined,
        { states: { business: '$form.isBusiness' } },
      ),
    );

    expect(textBox.include).toEqual({ in: ['business'] });
  });
});

describe('the resolveFormInput bridge', () => {
  it('passes a JSON form definition through untouched', () => {
    const json = '{"kind":"layout","type":"flex","children":[]}';

    expect(kendoImplementation.resolveFormInput(json).formDef).toBe(json);
  });

  it('memoizes on the identity of the definitions, selectors and config', () => {
    const definitions = [kendo.inputs.textBox('email')];
    const resolved = kendoImplementation.resolveFormInput(definitions);

    expect(kendoImplementation.resolveFormInput(definitions)).toBe(resolved);
    expect(kendoImplementation.resolveFormInput([kendo.inputs.textBox('email')])).not.toBe(
      resolved,
    );
  });
});

describe('events', () => {
  it('registers an onClick handler and references it from the widget', () => {
    const result = processForm([kendo.actions.button({ label: 'Reset', onClick: () => undefined })]);
    const [button] = childrenOf(result);

    expect(button.on).toEqual({ click: expect.any(String) });
    expect(typeof result.events).toBe('function');
  });

  it('wires an onChange handler onto an input', () => {
    const [textBox] = childrenOf(
      processForm([kendo.inputs.textBox('country', { onChange: () => undefined })]),
    );

    expect(textBox.on).toEqual({ change: expect.any(String) });
  });

  it('lets a zero-argument handler name a host-managed event instead', () => {
    const [button] = childrenOf(
      processForm([kendo.actions.button({ label: 'Export', onClick: () => 'exportRequested' })]),
    );

    expect(button.on).toEqual({ click: 'exportRequested' });
  });
});

describe('uid assignment', () => {
  it('gives the first widget at a path the path as its uid and disambiguates the rest', () => {
    const children = childrenOf(
      processForm([kendo.inputs.textBox('email'), kendo.inputs.textBox('email')]),
    );

    expect(children[0].uid).toBe('email');
    expect(children[1].uid).not.toBe('email');
    expect(children[1].path).toBe('email');
  });
});
