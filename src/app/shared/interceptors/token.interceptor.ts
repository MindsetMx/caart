import { HttpHeaders, type HttpInterceptorFn } from '@angular/common/http';
import { environments } from '@env/environments';


export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  let baseUrl = environments.baseUrl;

  const excludedUrls = [
    `${baseUrl}/login`,
    `${baseUrl}/register`,
    `${environments.cloudflareApiUrl}`,
  ];

  if (excludedUrls.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const header = req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);

  const reqWithHeader = req.clone({ headers: header });

  return next(reqWithHeader);
};
