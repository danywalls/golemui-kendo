import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionWidgetAdapter } from '@golemui/angular';
import type { ActionWidget, WithWidget } from '@golemui/core';
import type { KendoButtonProps } from 'golemui-kendo';
import { ButtonComponent } from '@progress/kendo-angular-buttons';

/**
 * `actionType` is the semantic GolemUI core reads to decide which action submits
 * the form, so it is forwarded verbatim to the native button `type`.
 */
@Component({
  selector: 'app-kendo-button',
  imports: [ButtonComponent],
  providers: [ActionWidgetAdapter],
  host: {
    class: 'kendo-widget',
    '[style.flex]': 'adapter.templateData().size',
  },
  template: `
    @let templateData = adapter.templateData();

    <button
      kendoButton
      [attr.id]="widget.uid"
      [attr.type]="templateData.actionType ?? 'button'"
      [attr.title]="templateData.title ?? null"
      [disabled]="templateData.disabled ?? false"
      [size]="templateData.kuiSize ?? 'medium'"
      [themeColor]="templateData.themeColor ?? 'base'"
      [fillMode]="templateData.fillMode ?? 'solid'"
      [rounded]="templateData.rounded ?? 'medium'"
      [iconClass]="templateData.icon ? 'k-icon k-i-' + templateData.icon : ''"
      (click)="adapter.click()"
    >
      {{ templateData.label }}
    </button>
  `,
})
export class KendoButtonComponent implements OnInit, OnDestroy, WithWidget {
  widget!: ActionWidget;

  protected readonly adapter: ActionWidgetAdapter<KendoButtonProps> = inject(ActionWidgetAdapter);

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
