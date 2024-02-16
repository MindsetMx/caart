import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';
import { provideRouter, } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { environments } from '@env/environments';
import { routes } from '@app/app.routes';
import { tokenInterceptor } from '@shared/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
    ),
    importProvidersFrom(
      ToastrModule.forRoot(),
    ),
    provideHttpClient(
      withInterceptors([
        tokenInterceptor
      ])
    ),
    provideAnimationsAsync(),
    provideNgxStripe(environments.stripe.publishableKey)
  ]
};
