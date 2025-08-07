import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withInMemoryScrolling, } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { environments } from '@env/environments';
import { routes } from '@app/app.routes';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from '@shared/common/spanish-paginator-intl';
import { tokenInterceptor } from '@shared/interceptors';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    provideRouter(
      routes,
      inMemoryScrollingFeature,
    ),
    importProvidersFrom(
      ToastrModule.forRoot(),
    ),
    provideHttpClient(
      withInterceptors([
        tokenInterceptor,
      ])
    ),
    provideZonelessChangeDetection(),
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideEnvironmentNgxMask(),
    provideAnimationsAsync(),
    provideNgxStripe(environments.stripe.publishableKey)
  ]
};
