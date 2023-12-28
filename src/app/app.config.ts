import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideNgxStripe } from 'ngx-stripe';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { environments } from '@env/environments';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      ToastrModule.forRoot(),
    ),
    provideAnimationsAsync(),
    provideNgxStripe(environments.stripe.publishableKey)
  ]
};
