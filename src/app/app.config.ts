import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withInMemoryScrolling, } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { environments } from '@env/environments';
import { routes } from '@app/app.routes';
import { tokenInterceptor } from '@shared/interceptors/token.interceptor';
import { provideEnvironmentNgxMask } from 'ngx-mask';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      inMemoryScrollingFeature
    ),
    importProvidersFrom(
      ToastrModule.forRoot(),
    ),
    provideHttpClient(
      withInterceptors([
        tokenInterceptor
      ])
    ),
    provideEnvironmentNgxMask(),
    provideAnimationsAsync(),
    provideNgxStripe(environments.stripe.publishableKey)
  ]
};
