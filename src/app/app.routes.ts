import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/pages/home/home.component').then((m) => m.HomeComponent),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
