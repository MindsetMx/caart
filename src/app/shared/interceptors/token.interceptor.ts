import { type HttpInterceptorFn } from '@angular/common/http';
import { environments } from '@env/environments';


export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  let baseUrl = environments.baseUrl;

  const excludedUrls = [
    `${baseUrl}/login`,
    `${baseUrl}/register`,
    `https://api.cloudflare.com/client/v4/accounts/${environments.cloudflareAccountId}/images/v1`,
    `https://api.cloudflare.com/client/v4/accounts/${environments.cloudflareAccountId}/stream`,
    `https://api.cloudflare.com/client/v4/accounts/${environments.cloudflareAccountId}/images/v2/direct_upload`,
    `https://api.cloudflare.com/client/v4/accounts/${environments.cloudflareAccountId}/images/v1`,
  ];

  if (excludedUrls.some((url) => req.url.includes(url)) || req.url.startsWith('https://upload.imagedelivery.net/')) {
    return next(req);
  }

  const header = req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);

  const reqWithHeader = req.clone({ headers: header });

  return next(reqWithHeader);
};
