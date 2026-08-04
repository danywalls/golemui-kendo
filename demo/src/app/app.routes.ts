import type { Routes } from '@angular/router';

export interface DemoPage {
  path: string;
  title: string;
  blurb: string;
}

export const DEMO_PAGES: DemoPage[] = [
  { path: 'catalog', title: 'Catalog', blurb: 'Every widget in the set' },
  { path: 'layouts', title: 'Layouts', blurb: 'flex, rows, columns, size ratios' },
  { path: 'selectors', title: 'Selectors', blurb: 'Decorate by type, tag, and uid' },
  { path: 'states', title: 'States', blurb: 'Conditional fields and per-state props' },
  { path: 'repeater', title: 'Repeater', blurb: 'Collections and nested templates' },
  { path: 'events', title: 'Events', blurb: 'onChange, onClick, and update()' },
  { path: 'json', title: 'JSON', blurb: 'The same form as raw JSON' },
];

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalog' },
  {
    path: 'catalog',
    loadComponent: () => import('./pages/catalog.page').then((m) => m.CatalogPage),
  },
  {
    path: 'layouts',
    loadComponent: () => import('./pages/layouts.page').then((m) => m.LayoutsPage),
  },
  {
    path: 'selectors',
    loadComponent: () => import('./pages/selectors.page').then((m) => m.SelectorsPage),
  },
  {
    path: 'states',
    loadComponent: () => import('./pages/states.page').then((m) => m.StatesPage),
  },
  {
    path: 'repeater',
    loadComponent: () => import('./pages/repeater.page').then((m) => m.RepeaterPage),
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events.page').then((m) => m.EventsPage),
  },
  { path: 'json', loadComponent: () => import('./pages/json.page').then((m) => m.JsonPage) },
  { path: '**', redirectTo: 'catalog' },
];
