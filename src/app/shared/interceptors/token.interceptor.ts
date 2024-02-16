import { HttpHeaders, type HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  const authReq = req.clone({ headers });

  return next(authReq);
};
