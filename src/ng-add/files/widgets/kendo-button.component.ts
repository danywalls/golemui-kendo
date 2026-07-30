import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionWidgetAdapter } from '@golemui/angular';
import type { ActionWidget, WithWidget } from '@golemui/core';
import { ButtonComponent } from '@progress/kendo-angular-buttons';

interface KendoButtonProps {
  kuiSize?: 'small' | 'medium' | 'large';
}

@Component({
  selector: 'app-kendo-button',
  imports: [ButtonComponent],
  providers: [ActionWidgetAdapter],
  host: {
    class: 'kendo-widget gui-field',
    '[style.flex]': 'adapter.templateData().size',
  },
  template: `
    @let templateData = adapter.templateData();

    <button
      kendoButton
      themeColor="primary"
      [attr.id]="widget.uid"
      [attr.type]="templateData.actionType ?? 'button'"
      [disabled]="templateData.disabled ?? false"
      [size]="templateData.kuiSize ?? 'medium'"
      (click)="adapter.click()"
    >
      {{ templateData.label }}
    </button>
  `,
})
export class KendoButtonComponent implements OnInit, OnDestroy, WithWidget {
  widget!: ActionWidget;

  protected readonly adapter: ActionWidgetAdapter<KendoButtonProps> =
    inject(ActionWidgetAdapter);

  ngOnInit(): void {
    this.adapter.init(this.widget);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
