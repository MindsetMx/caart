import { Routes } from '@angular/router';

import { AuthGuard, GuestGuard, UnverifiedGuard, VerifiedGuard, CompleteAccountGuard } from '@auth/guards';
import { IncompleteAccountGuard } from '@auth/guards/incomplete-account.guard';

export const routes: Routes = [
  {
    path: 'home',
    // canActivate: [MobileUserLiveAuctionRedirectGuard],
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./home/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'nosotros',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./infoPages/pages/about-us/about-us.component').then((m) => m.AboutUsComponent),
  },
  {
    path: 'contacto',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./infoPages/pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'preguntas-frecuentes',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./infoPages/pages/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'como-funciona',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./infoPages/pages/how-it-works/how-it-works.component').then((m) => m.HowItWorksComponent),
  },
  {
    path: 'iniciar-sesion',
    canActivate: [VerifiedGuard, GuestGuard],
    loadComponent: () => import('./auth/components/sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  // {
  //   path: 'registrarse',
  //   canActivate: [VerifiedGuard,GuestGuard],
  //   loadComponent: () => import('./auth/pages/register/register.component').then((m) => m.RegisterComponent),
  // },
  {
    path: 'completar-registro',
    canActivate: [VerifiedGuard, AuthGuard, IncompleteAccountGuard],
    loadComponent: () => import('./auth/pages/complete-register/complete-register.component').then((m) => m.CompleteRegisterComponent),
  },
  {
    path: 'registrar-vehiculo',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./register-car/pages/register-car/register-car.component').then((m) => m.RegisterCarComponent),
  },
  {
    path: 'registro-exitoso',
    canActivate: [VerifiedGuard, AuthGuard],
    loadComponent: () => import('./register-car/pages/successful-register-request/successful-register-request.component').then((m) => m.SuccessfulRegisterRequestComponent),
  },
  {
    path: 'completar-registro-vehiculo/:id',
    canActivate: [VerifiedGuard, AuthGuard, CompleteAccountGuard],
    loadComponent: () => import('./register-car/pages/complete-car-register/complete-car-register.component').then((m) => m.CompleteCarRegisterComponent),
  },
  {
    path: 'completar-registro-memorabilia/:id',
    canActivate: [VerifiedGuard, AuthGuard, CompleteAccountGuard],
    loadComponent: () => import('./register-memorabilia/pages/complete-memorabilia-register/complete-memorabilia-register.component').then((m) => m.CompleteMemorabiliaRegisterComponent),
  },
  {
    path: 'registro-completado',
    canActivate: [VerifiedGuard, AuthGuard],
    loadComponent: () => import('./register-car/pages/successful-car-registration/successful-car-registration.component').then((m) => m.SuccessfulCarRegistrationComponent),
  }, {
    path: 'subasta/:id',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./auctions/pages/auction/auction.component').then((m) => m.AuctionComponent),
  },
  {
    path: 'subasta-memorabilia/:id',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./auctions/pages/auction-memorabilia/auction-memorabilia.component').then((m) => m.AuctionMemorabiliaComponent),
  },
  {
    path: 'ultima-oportunidad/:id',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./last-chance/pages/last-chance-detail/last-chance-detail.component').then((m) => m.LastChanceDetailComponent),
  },
  {
    path: 'subastas-en-vivo',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./auctions/pages/live-auctions/live-auctions.component').then((m) => m.LiveAuctionsComponent),
  },
  {
    path: 'resultados',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./auctions/pages/auction-results/auction-results.component').then((m) => m.AuctionResultsComponent),
  },
  {
    path: 'ultima-oportunidad',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./last-chance/pages/last-chance/last-chance.component').then((m) => m.LastChanceComponent),
  },
  {
    path: 'publicaciones',
    canActivate: [VerifiedGuard, AuthGuard],
    loadComponent: () => import('./auctions/pages/auction-car-publications/auction-car-publications.component').then((m) => m.AuctionCarPublishesComponent),
  },
  {
    path: 'solicitudes',
    canActivate: [VerifiedGuard, AuthGuard],
    loadComponent: () => import('./auctions/pages/publication-requests/publication-requests.component').then((m) => m.PublicationRequestsComponent),
  },
  {
    path: 'reestablecer-contrasena',
    canActivate: [VerifiedGuard, GuestGuard],
    loadComponent: () => import('./auth/components/password-reset/password-reset.component').then((m) => m.PasswordResetComponent),
  },
  {
    path: 'configuracion-de-la-cuenta',
    canActivate: [VerifiedGuard, AuthGuard],
    loadComponent: () => import('./account/pages/account-settings/account-settings.component').then((m) => m.AccountSettingsComponent),
  },
  {
    path: 'dashboard',
    canActivate: [VerifiedGuard, AuthGuard],
    children: [
      {
        path: 'publicaciones',
        loadComponent: () => import('./dashboard/pages/publications/publications.component').then((m) => m.PublicationsComponent),
      },
      {
        path: 'solicitudes',
        loadComponent: () => import('./dashboard/pages/requests/requests.component').then((m) => m.RequestsComponent),
      },
      {
        path: 'publicar-autos',
        loadComponent: () => import('./dashboard/pages/publish-cars/publish-cars.component').then((m) => m.PublishCarsComponent),
      },
      { path: '**', redirectTo: 'publicaciones' }
    ]
  },
  {
    path: 'confirmacion',
    canActivate: [UnverifiedGuard],
    loadComponent: () => import('./auth/components/confirmation/confirmation.component').then((m) => m.ConfirmationComponent),
  },
  { path: '**', redirectTo: '/subastas-en-vivo' }
];
