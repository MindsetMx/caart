import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideNgxStripe } from 'ngx-stripe';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { environments } from '../environments/environments';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      ToastrModule.forRoot(),
      BrowserAnimationsModule
    ),
    provideNgxStripe(environments.stripe.publishableKey)
  ]
};
