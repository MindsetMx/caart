import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard, unverifiedGuard, verifiedGuard } from '@auth/guards';

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
        path: 'registro-exitoso',
        canActivate: [AuthGuard],
        loadComponent: () => import('./register-car/pages/successful-register-request/successful-register-request.component').then((m) => m.SuccessfulRegisterRequestComponent),
      },
      {
        path: 'completar-registro-vehiculo',
        canActivate: [AuthGuard],
        loadComponent: () => import('./register-car/pages/complete-car-register/complete-car-register.component').then((m) => m.CompleteCarRegisterComponent),
      },
      {
        path: 'registro-exitoso-auto',
        canActivate: [AuthGuard],
        loadComponent: () => import('./register-car/pages/successful-car-registration/successful-car-registration.component').then((m) => m.SuccessfulCarRegistrationComponent),
      }, {
        path: 'subasta',
        loadComponent: () => import('./auctions/pages/auction/auction.component').then((m) => m.AuctionComponent),
      }
    ]
  },
  {
    path: 'confirmacion',
    canActivate: [unverifiedGuard],
    loadComponent: () => import('./auth/components/confirmation/confirmation.component').then((m) => m.ConfirmationComponent),
  },
  { path: '**', redirectTo: '' },
];
