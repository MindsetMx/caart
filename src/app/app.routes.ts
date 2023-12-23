import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from '@auth/guards';
import { unverifiedGuard } from '@auth/guards/unverified.guard';
import { verifiedGuard } from '@auth/guards/verified.guard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [verifiedGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./home/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'iniciar-sesion',
        canActivate: [GuestGuard],
        loadComponent: () => import('./auth/components/sign-in/sign-in.component').then((m) => m.SignInComponent),
      },
      {
        path: 'registrarse',
        loadComponent: () => import('./auth/components/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'registrar-vehiculo',
        canActivate: [AuthGuard],
        loadComponent: () => import('./register-car/pages/register-car/register-car.component').then((m) => m.RegisterCarComponent),
      },
      {
        path: 'completar-registro-vehiculo',
        canActivate: [AuthGuard],
        loadComponent: () => import('./register-car/pages/complete-car-register/complete-car-register.component').then((m) => m.CompleteCarRegisterComponent),
      },
    ]
  },
  {
    path: 'confirmacion',
    canActivate: [unverifiedGuard],
    loadComponent: () => import('./auth/components/confirmation/confirmation.component').then((m) => m.ConfirmationComponent),
  },
  { path: '**', redirectTo: '' },
];
