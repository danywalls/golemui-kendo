import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LayoutWidgetAdapter, WidgetDirective } from '@golemui/angular';
import type { LayoutWidget, WithWidget } from '@golemui/core';
import type { KendoFlexProps } from 'golemui-kendo';

/**
 * The `flex` widget type is reserved by GolemUI core: it mints a `flex` layout
 * for the synthetic form root and for every repeater template, so this loader
 * key must stay exactly `flex`.
 *
 * It is plain CSS rather than a Kendo component, because Kendo's StackLayout
 * would wrap each child in an extra element and break the `size` flex ratio.
 */
@Component({
  selector: 'app-kendo-flex',
  imports: [WidgetDirective],
  providers: [LayoutWidgetAdapter],
  host: {
    class: 'kendo-flex',
    '[style.flex]': 'adapter.templateData().size ?? 1',
  },
  template: `
    @let templateData = adapter.templateData();

    <div
      class="kendo-flex__container"
      [attr.id]="widget.uid"
      [style.flex-direction]="templateData.direction ?? 'column'"
      [style.justify-content]="justifyContent(templateData.justify)"
      [style.align-items]="alignItems(templateData.align)"
      [style.flex-wrap]="templateData.wrap ? 'wrap' : 'nowrap'"
      [style.gap.px]="templateData.gap ?? 12"
      [style.padding.px]="templateData.padding"
    >
      @for (child of templateData.children; track child.uid) {
        <ng-container guiWidget [widget]="child" />
      }
    </div>
  `,
  styles: `
    .kendo-flex {
      display: block;
    }
    .kendo-flex__container {
      display: flex;
    }
  `,
})
export class KendoFlexComponent implements OnInit, OnDestroy, WithWidget {
  widget!: LayoutWidget;

  protected readonly adapter: LayoutWidgetAdapter<KendoFlexProps> = inject(LayoutWidgetAdapter);

  // `start` and `end` read better in a form definition than the CSS spellings.
  protected justifyContent(justify: KendoFlexProps['justify']): string {
    switch (justify) {
      case 'start':
        return 'flex-start';
      case 'end':
        return 'flex-end';
      case undefined:
        return 'flex-start';
      default:
        return justify;
    }
  }

  protected alignItems(align: KendoFlexProps['align']): string {
    switch (align) {
      case 'start':
        return 'flex-start';
      case 'end':
        return 'flex-end';
      case undefined:
        return 'stretch';
      default:
        return align;
    }
  }

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
