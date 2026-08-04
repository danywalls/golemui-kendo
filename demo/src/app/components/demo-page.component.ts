import { Component, input, signal } from '@angular/core';
import type { FormEvent, FormSubmitEvent } from '@golemui/core';
import type { KendoFormInitConfig } from 'golemui-kendo';
import { KendoFormComponent } from '../kendo-widgets/kendo-form.component';

/**
 * The chrome shared by every demo page: a title, an explanation, the form, and a
 * live readout of the form data and the events it emitted.
 */
@Component({
  selector: 'app-demo-page',
  imports: [KendoFormComponent],
  template: `
    <section class="demo-page">
      <div class="demo-page__intro">
        <h2>{{ title() }}</h2>
        <p>{{ blurb() }}</p>
      </div>

      <div class="demo-page__panels">
        <div class="demo-page__form k-card">
          <kendo-form
            [config]="config()"
            (formSubmit)="onSubmit($event)"
            (formEvent)="onEvent($event)"
          ></kendo-form>
        </div>

        <aside class="demo-page__inspector">
          <h3>{{ submitted() ? 'Submitted data' : 'Live form data' }}</h3>
          <pre>{{ dataJson() }}</pre>

          <h3>Events</h3>
          @if (log().length === 0) {
            <p class="demo-page__empty">Nothing yet. Interact with the form.</p>
          } @else {
            <ol class="demo-page__log">
              @for (entry of log(); track $index) {
                <li>{{ entry }}</li>
              }
            </ol>
          }
        </aside>
      </div>
    </section>
  `,
  styles: `
    .demo-page__intro h2 {
      margin: 0 0 4px;
    }
    .demo-page__intro p {
      margin: 0 0 20px;
      color: #6a6f75;
      max-width: 70ch;
    }
    .demo-page__panels {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      flex-wrap: wrap;
    }
    .demo-page__form {
      flex: 1 1 460px;
      min-width: 340px;
      padding: 20px;
      background: #fff;
    }
    .demo-page__inspector {
      flex: 0 1 320px;
      min-width: 260px;
      background: #fff;
      border: 1px solid #e3e5e8;
      border-radius: 8px;
      padding: 16px;
      position: sticky;
      top: 24px;
    }
    .demo-page__inspector h3 {
      margin: 0 0 8px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #6a6f75;
    }
    .demo-page__inspector h3 + * {
      margin-bottom: 20px;
    }
    pre {
      margin: 0;
      font-size: 12px;
      background: #f6f7f9;
      border-radius: 6px;
      padding: 10px;
      max-height: 260px;
      overflow: auto;
    }
    .demo-page__log {
      margin: 0;
      padding-left: 18px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .demo-page__empty {
      margin: 0;
      font-size: 12px;
      color: #9aa0a6;
    }
  `,
})
export class DemoPageComponent {
  title = input.required<string>();
  blurb = input.required<string>();
  config = input.required<KendoFormInitConfig>();

  protected readonly log = signal<string[]>([]);
  protected readonly liveData = signal<Record<string, unknown> | undefined>(undefined);
  protected readonly submitted = signal(false);

  protected dataJson(): string {
    const data = this.liveData();
    return data ? JSON.stringify(data, null, 2) : 'Interact with the form to see its data.';
  }

  protected onSubmit(event: FormSubmitEvent): void {
    this.liveData.set(event.data as Record<string, unknown>);
    this.submitted.set(true);
    this.pushLog('submit');
  }

  protected onEvent(event: FormEvent): void {
    this.liveData.set(event.data as Record<string, unknown>);
    this.submitted.set(false);
    this.pushLog(event.name);
  }

  private pushLog(entry: string): void {
    this.log.update((entries) => [entry, ...entries].slice(0, 12));
  }
}
