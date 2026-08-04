import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';

/**
 * A plain Angular component rendered inside a form through
 * `kendo.displays.render(...)`. It receives whatever the render function put in
 * `api` as component inputs.
 */
@Component({
  selector: 'app-price-summary',
  imports: [CurrencyPipe],
  template: `
    <div class="price-summary k-card">
      <span class="price-summary__label">{{ label() }}</span>
      <span class="price-summary__total">{{ total() | currency: 'EUR' }}</span>
    </div>
  `,
  styles: `
    .price-summary {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
    }
    .price-summary__label {
      color: #6a6f75;
      font-size: 13px;
    }
    .price-summary__total {
      font-size: 20px;
      font-weight: 600;
    }
  `,
})
export class PriceSummaryComponent {
  label = input<string>('Total');
  total = input<number>(0);
}
