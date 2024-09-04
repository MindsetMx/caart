import { AuthGuard, GuestGuard, UnverifiedGuard, VerifiedGuard, CompleteAccountGuard } from '@auth/guards';
import { Routes } from '@angular/router';

import { IncompleteAccountGuard } from '@auth/guards/incomplete-account.guard';
import { PreviewArtGuard } from '@art/guards';
import { PreviewCarGuard } from '@auctions/guards';
import { WizardCompletionArtGuard } from '@art/guards';
import { WizardCompletionCarGuard } from '@app/register-car/guards';

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
    path: 'vende-con-nosotros',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./infoPages/pages/sell-with-us/sell-with-us.component').then((m) => m.SellWithUsComponent),
  },
  {
    path: 'iniciar-sesion',
    canActivate: [VerifiedGuard, GuestGuard],
    loadComponent: () => import('./auth/components/sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  // {
  //   path: 'registrarse',
  //   canActivate: [GuestGuard],
  //   loadComponent: () => import('./auth/pages/register/register.component').then((m) => m.RegisterComponent),
  // },
  {
    path: 'completar-registro',
    canActivate: [AuthGuard, VerifiedGuard, IncompleteAccountGuard],
    loadComponent: () => import('./auth/pages/complete-register/complete-register.component').then((m) => m.CompleteRegisterComponent),
  },
  {
    path: 'registrar-subasta',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./register-car/pages/register-auction/register-auction.component').then((m) => m.RegisterAuctionComponent),
  },
  {
    path: 'registro-exitoso',
    canActivate: [AuthGuard, VerifiedGuard],
    loadComponent: () => import('./register-car/pages/successful-register-request/successful-register-request.component').then((m) => m.SuccessfulRegisterRequestComponent),
  },
  {
    path: 'completar-registro-vehiculo/:id',
    canActivate: [AuthGuard, VerifiedGuard, CompleteAccountGuard, WizardCompletionCarGuard],
    loadComponent: () => import('./register-car/pages/complete-car-register/complete-car-register.component').then((m) => m.CompleteCarRegisterComponent),
  },
  {
    path: 'completar-registro-memorabilia/:id',
    canActivate: [AuthGuard, VerifiedGuard, CompleteAccountGuard],
    loadComponent: () => import('./register-memorabilia/pages/complete-memorabilia-register/complete-memorabilia-register.component').then((m) => m.CompleteMemorabiliaRegisterComponent),
  },
  {
    path: 'completar-registro-arte/:id',
    canActivate: [AuthGuard, VerifiedGuard, CompleteAccountGuard, WizardCompletionArtGuard],
    loadComponent: () => import('./art/pages/complete-art-register/complete-art-register.component').then((m) => m.CompleteArtRegisterComponent),
  },
  {
    path: 'registro-completado',
    canActivate: [AuthGuard, VerifiedGuard],
    loadComponent: () => import('./register-car/pages/successful-car-registration/successful-car-registration.component').then((m) => m.SuccessfulCarRegistrationComponent),
  }, {
    path: 'subasta/:id',
    canActivate: [VerifiedGuard, PreviewCarGuard],
    loadComponent: () => import('./auctions/pages/auction/auction.component').then((m) => m.AuctionComponent),
  },
  {
    path: 'subasta-arte/:id',
    canActivate: [VerifiedGuard, PreviewArtGuard],
    loadComponent: () => import('./art/pages/auction-art/auction-art.component').then((m) => m.AuctionArtComponent),
  },
  {
    path: 'subasta-memorabilia/:id',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./auctions/pages/auction-memorabilia/auction-memorabilia.component').then((m) => m.AuctionMemorabiliaComponent),
  },
  {
    path: 'mis-subastas',
    canActivate: [AuthGuard, VerifiedGuard],
    loadComponent: () => import('./activity/pages/activity/activity.component').then((m) => m.ActivityComponent),
  },
  {
    path: 'mis-comentarios',
    canActivate: [AuthGuard, VerifiedGuard],
    loadComponent: () => import('./activity/pages/my-comments/my-comments.component').then((m) => m.MyCommentsComponent),
  },
  {
    path: 'ultima-oportunidad/:id',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./last-chance/pages/last-chance-detail/last-chance-detail.component').then((m) => m.LastChanceDetailComponent),
  },
  {
    path: 'ultima-oportunidad-arte/:id',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./last-chance/pages/last-chance-art-detail/last-chance-art-detail.component').then((m) => m.LastChanceArtDetailComponent),
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
    path: 'reestablecer-contrasena',
    canActivate: [GuestGuard, VerifiedGuard],
    loadComponent: () => import('./auth/components/password-reset/password-reset.component').then((m) => m.PasswordResetComponent),
  },
  {
    path: 'configuracion-de-la-cuenta',
    canActivate: [AuthGuard, VerifiedGuard],
    loadComponent: () => import('./account/pages/account-settings/account-settings.component').then((m) => m.AccountSettingsComponent),
  },
  {
    path: 'contrato-de-prestacion-de-servicios-de-subasta-para-compradores',
    canActivate: [VerifiedGuard],
    loadComponent: () => import('./infoPages/pages/auction-services-contract/auction-services-contract.component').then((m) => m.AuctionServicesContractComponent),
  },
  {
    path: 'mis-favoritos',
    canActivate: [AuthGuard, VerifiedGuard],
    loadComponent: () => import('./favorites/pages/favorites/favorites.component').then((m) => m.FavoritesComponent),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard, VerifiedGuard],
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
        path: 'publicar',
        loadComponent: () => import('./dashboard/pages/publish/publish.component').then((m) => m.PublishComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./dashboard/pages/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'agregar-historia-auto/:id',
        loadComponent: () => import('./dashboard/pages/add-car-history/add-car-history.component').then((m) => m.AddCarHistoryComponent),
      },
      {
        path: 'agregar-historia-arte/:id',
        loadComponent: () => import('./dashboard/pages/add-art-history/add-art-history.component').then((m) => m.AddArtHistoryComponent),
      },
      {
        // auction-image-assignment-and-reorder
        path: 'asignar-y-reordenar-imagenes-subasta/:id',
        loadComponent: () => import('./dashboard/pages/auction-image-assignment-and-reorder/auction-image-assignment-and-reorder.component').then((m) => m.AuctionImageAssignmentAndReorderComponent),
      },
      {
        path: 'asignar-y-reordenar-imagenes-subasta-arte/:id',
        loadComponent: () => import('./dashboard/pages/art-auction-image-assignment-and-reorder/art-auction-image-assignment-and-reorder.component').then((m) => m.ArtAuctionImageAssignmentAndReorderComponent),
      },
      // subastas en vivo
      {
        path: 'subastas-en-vivo',
        loadComponent: () => import('./dashboard/pages/live-auctions/live-auctions.component').then((m) => m.LiveAuctionsComponent),
      },
      {
        path: 'resultados',
        loadComponent: () => import('./dashboard/pages/auction-results/auction-results.component').then((m) => m.AuctionResultsComponent),
      },
      { path: '**', redirectTo: 'publicaciones' }
    ]
  },
  {
    path: 'confirmacion',
    canActivate: [UnverifiedGuard],
    loadComponent: () => import('./auth/components/confirmation/confirmation.component').then((m) => m.ConfirmationComponent),
  },
  {
    path: 'not-found',
    loadComponent: () => import('./shared/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
  { path: '**', redirectTo: '/subastas-en-vivo' }
];
