import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DEMO_PAGES } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <h1>golemui-kendo</h1>
      <p>The Progress Kendo UI widget set for GolemUI, built on &#64;golemui/dx.</p>
    </header>

    <div class="app-body">
      <nav class="app-nav">
        @for (page of pages; track page.path) {
          <a [routerLink]="['/', page.path]" routerLinkActive="app-nav__link--active">
            <span class="app-nav__title">{{ page.title }}</span>
            <span class="app-nav__blurb">{{ page.blurb }}</span>
          </a>
        }
      </nav>

      <main class="app-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
    .app-header {
      padding: 20px 28px;
      background: #fff;
      border-bottom: 1px solid #e3e5e8;
    }
    .app-header h1 {
      margin: 0;
      font-size: 20px;
    }
    .app-header p {
      margin: 4px 0 0;
      color: #666;
      font-size: 13px;
    }
    .app-body {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      padding: 24px 28px;
    }
    .app-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 230px;
      flex: none;
      position: sticky;
      top: 24px;
    }
    .app-nav a {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 10px 12px;
      border-radius: 8px;
      text-decoration: none;
      border: 1px solid transparent;
    }
    .app-nav a:hover {
      background: rgba(0, 0, 0, 0.04);
    }
    .app-nav__link--active {
      background: #fff;
      border-color: #d5d8dc;
    }
    .app-nav__title {
      font-weight: 600;
      font-size: 14px;
    }
    .app-nav__blurb {
      font-size: 12px;
      color: #6a6f75;
    }
    .app-main {
      flex: 1;
      min-width: 0;
    }
  `,
})
export class AppComponent {
  protected readonly pages = DEMO_PAGES;
}
