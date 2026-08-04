import { NgComponentOutlet } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, type Type } from '@angular/core';
import { DisplayWidgetAdapter } from '@golemui/angular';
import type { DisplayWidget, WithWidget } from '@golemui/core';
import type { KendoRenderResult } from 'golemui-kendo';

interface RendererProps {
  render?: KendoRenderResult<Type<unknown>, Record<string, unknown>>;
}

/**
 * Backs `kendo.displays.render(...)` and any bare function in a form definition:
 * it instantiates whatever component the render function returned and feeds it
 * the accompanying `api` object as inputs.
 */
@Component({
  selector: 'app-kendo-renderer',
  imports: [NgComponentOutlet],
  providers: [DisplayWidgetAdapter],
  host: {
    class: 'kendo-widget',
    '[style.flex]': 'adapter.templateData().size',
  },
  template: `
    <div class="kendo-renderer" [attr.id]="widget.uid">
      @if (component()) {
        <ng-container *ngComponentOutlet="component()!; inputs: inputs()"></ng-container>
      }
    </div>
  `,
})
export class KendoRendererComponent implements OnInit, OnDestroy, WithWidget {
  widget!: DisplayWidget;

  protected readonly adapter: DisplayWidgetAdapter<RendererProps> = inject(DisplayWidgetAdapter);

  protected component(): Type<unknown> | undefined {
    return this.adapter.templateData().render?.component;
  }

  protected inputs(): Record<string, unknown> {
    return this.adapter.templateData().render?.api ?? {};
  }

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
