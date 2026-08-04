import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputWidgetAdapter, RepeaterWidgetDirective } from '@golemui/angular';
import type { InputWidget, NonFunctionWidget, WithWidget } from '@golemui/core';
import type { KendoRepeaterProps } from 'golemui-kendo';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { KendoFieldComponent } from './kendo-field.component';

interface RepeaterTemplateProps extends KendoRepeaterProps {
  /** The child layout the DX pipeline built from the repeater's template. */
  template?: NonFunctionWidget<string>;
}

/**
 * The `repeater` widget type is reserved by GolemUI core: it owns the collection
 * semantics (the `props.template` layout, the `[n]` uid grammar, the
 * `$item`/`$index` scope), so this loader key must stay exactly `repeater`.
 *
 * `RepeaterWidgetDirective` is what puts each rendered template into the right
 * item scope, which is why the template is instantiated through it rather than
 * through the plain widget directive.
 */
@Component({
  selector: 'app-kendo-repeater',
  imports: [RepeaterWidgetDirective, ButtonComponent, KendoFieldComponent],
  providers: [InputWidgetAdapter, RepeaterWidgetDirective],
  host: {
    class: 'kendo-widget',
    '[style.flex]': 'adapter.templateData().size',
  },
  template: `
    @let templateData = adapter.templateData();
    @let items = templateData.value ?? [];
    @let itemTemplate = templateData.template;

    <app-kendo-field
      [label]="templateData.label"
      [errors]="templateData.errors ?? []"
      [touched]="templateData.touched ?? false"
      [required]="!!templateData.validator?.required"
    >
      <div class="kendo-repeater" [attr.id]="widget.uid" (focusout)="adapter.onBlur()">
        @if (itemTemplate) {
          @for (item of items; track $index) {
            <div class="kendo-repeater__item k-card">
              <div class="kendo-repeater__item-header">
                @if (templateData.title) {
                  <span class="kendo-repeater__item-title">
                    {{ templateData.title }} {{ $index + 1 }}
                  </span>
                }
                <button
                  kendoButton
                  type="button"
                  size="small"
                  fillMode="flat"
                  themeColor="error"
                  [disabled]="templateData.readonly ?? false"
                  (click)="removeItem($index)"
                >
                  {{ templateData.removeLabel ?? 'Remove' }}
                </button>
              </div>
              <ng-container guiRepeaterWidget [repeaterIndex]="$index" [widget]="itemTemplate" />
            </div>
          }
        }

        <button
          kendoButton
          type="button"
          themeColor="primary"
          fillMode="outline"
          [disabled]="limitReached()"
          (click)="addItem()"
        >
          {{ templateData.addLabel ?? 'Add' }}
        </button>
      </div>
    </app-kendo-field>
  `,
  styles: `
    .kendo-repeater {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
    .kendo-repeater__item {
      width: 100%;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .kendo-repeater__item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .kendo-repeater__item-title {
      font-weight: 600;
    }
  `,
})
export class KendoRepeaterComponent implements OnInit, OnDestroy, WithWidget {
  widget!: InputWidget<Record<string, unknown>[]>;

  protected readonly adapter: InputWidgetAdapter<
    Record<string, unknown>[],
    RepeaterTemplateProps
  > = inject(InputWidgetAdapter);

  protected limitReached(): boolean {
    const { limit, value } = this.adapter.templateData();
    return limit != null && (value?.length ?? 0) >= limit;
  }

  protected addItem(): void {
    this.adapter.valueChanged([...(this.adapter.templateData().value ?? []), {}]);
  }

  protected removeItem(index: number): void {
    const remaining = (this.adapter.templateData().value ?? []).filter(
      (_item, itemIndex) => itemIndex !== index,
    );
    // Deep clone so the surviving items do not keep references into the old array.
    this.adapter.valueChanged(structuredClone(remaining));
  }

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
