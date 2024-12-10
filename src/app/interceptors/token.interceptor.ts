import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const token = inject(AuthService).token;
  if (token != undefined) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  return next(req);
};
//explicacion interceptors : https://dev.to/bytebantz/angulars-17-interceptors-complete-tutorial-220k
//anotar en providers de app.config!
