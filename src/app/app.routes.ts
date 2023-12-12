import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('./sign-in/pages/sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
