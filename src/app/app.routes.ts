import { Routes } from '@angular/router';
import { confirmedGuard } from '@auth/guards/confirmed.guard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [confirmedGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./home/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'iniciar-sesion',
        loadComponent: () => import('./auth/components/sign-in/sign-in.component').then((m) => m.SignInComponent),
      },
      {
        path: 'registrarse',
        loadComponent: () => import('./auth/components/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'registrar-vehiculo',
        loadComponent: () => import('./register-car/pages/register-car/register-car.component').then((m) => m.RegisterCarComponent),
      },
    ]
  },
  {
    path: 'confirmacion',
    loadComponent: () => import('./auth/components/confirmation/confirmation.component').then((m) => m.ConfirmationComponent),
  },
  { path: '**', redirectTo: '' },
];
