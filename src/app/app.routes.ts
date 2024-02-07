import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard, UnverifiedGuard, VerifiedGuard, CompleteAccountGuard } from '@auth/guards';
import { IncompleteAccountGuard } from '@auth/guards/incomplete-account.guard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [VerifiedGuard],
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
      // {
      //   path: 'registrarse',
      //   canActivate: [GuestGuard],
      //   loadComponent: () => import('./auth/pages/register/register.component').then((m) => m.RegisterComponent),
      // },
      {
        path: 'completar-registro',
        canActivate: [AuthGuard, IncompleteAccountGuard],
        loadComponent: () => import('./auth/pages/complete-register/complete-register.component').then((m) => m.CompleteRegisterComponent),
      },
      {
        path: 'registrar-vehiculo',
        loadComponent: () => import('./register-car/pages/register-car/register-car.component').then((m) => m.RegisterCarComponent),
      },
      {
        path: 'registro-exitoso',
        canActivate: [AuthGuard],
        loadComponent: () => import('./register-car/pages/successful-register-request/successful-register-request.component').then((m) => m.SuccessfulRegisterRequestComponent),
      },
      {
        path: 'completar-registro-vehiculo/:id',
        canActivate: [AuthGuard, CompleteAccountGuard],
        loadComponent: () => import('./register-car/pages/complete-car-register/complete-car-register.component').then((m) => m.CompleteCarRegisterComponent),
      },
      {
        path: 'registro-exitoso-auto',
        canActivate: [AuthGuard],
        loadComponent: () => import('./register-car/pages/successful-car-registration/successful-car-registration.component').then((m) => m.SuccessfulCarRegistrationComponent),
      }, {
        path: 'subasta',
        loadComponent: () => import('./auctions/pages/auction/auction.component').then((m) => m.AuctionComponent),
      },
      {
        path: 'subastas-en-vivo',
        loadComponent: () => import('./auctions/pages/live-auctions/live-auctions.component').then((m) => m.LiveAuctionsComponent),
      },
      {
        path: 'publicaciones',
        canActivate: [AuthGuard],
        loadComponent: () => import('./auctions/pages/auction-car-publications/auction-car-publications.component').then((m) => m.AuctionCarPublishesComponent),
      },
      {
        path: 'solicitudes',
        canActivate: [AuthGuard],
        loadComponent: () => import('./auctions/pages/publication-requests/publication-requests.component').then((m) => m.PublicationRequestsComponent),
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'publicaciones',
            loadComponent: () => import('./dashboard/pages/publications/publications.component').then((m) => m.PublicationsComponent),
          },
          {
            path: 'solicitudes',
            loadComponent: () => import('./dashboard/pages/requests/requests.component').then((m) => m.RequestsComponent),
          },
        ]
      }
    ]
  },
  {
    path: 'confirmacion',
    canActivate: [UnverifiedGuard],
    loadComponent: () => import('./auth/components/confirmation/confirmation.component').then((m) => m.ConfirmationComponent),
  },
  { path: '**', redirectTo: '' },
];
