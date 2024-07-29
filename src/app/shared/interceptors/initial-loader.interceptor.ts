import type { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const initialLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  let totalRequests = 0;
  let completedRequests = 0;
  let initialLoadComplete = false;
  let startTime: number;
  const MINIMUM_LOADER_TIME = 1000;
  let loaderTimeout: any;

  if (!initialLoadComplete) {
    if (totalRequests === 0) {
      startTime = Date.now();  // Marca el inicio del tiempo del loader
    }
    totalRequests++;
    startLoaderTimeout();
    return next(req).pipe(
      tap({
        next: () => { },
        error: () => checkComplete(),
        complete: () => checkComplete()
      })
    );
  }

  return next(req);

  function startLoaderTimeout(): void {
    if (!loaderTimeout) {
      loaderTimeout = setTimeout(() => {
        completeInitialLoad();
      }, MINIMUM_LOADER_TIME);
    }
  }

  function checkComplete() {
    completedRequests++;
    if (completedRequests === totalRequests) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = MINIMUM_LOADER_TIME - elapsedTime;
      if (remainingTime > 0) {
        setTimeout(() => completeInitialLoad(), remainingTime);
      } else {
        completeInitialLoad();
      }
    }
  }

  function completeInitialLoad(): void {
    initialLoadComplete = true;
    hideLoader();
  }

  function hideLoader(): void {
    const loader = document.getElementById('globalLoader');
    if (loader) {
      loader.style.display = 'none';
    }
  }
};
