import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacade } from '../facades/auth.facade';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authFacade = inject(AuthFacade);
  const accessToken = authFacade.accessToken;

  const isPublicRoute = ['/autenticacao/login', 'autenticacao/refresh'].some(url => req.url.includes(url));
  
  if (isPublicRoute) {
    return next(req);
  }

  const clonedRequest = accessToken ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }) : req;

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) { 
        return authFacade.refreshToken().pipe(
          switchMap((response) => {
            const retryRequest = req.clone({ setHeaders: { Authorization: `Bearer ${response.access_token}` } });
            return next(retryRequest);
          }),
          catchError((refreshError: HttpErrorResponse) => { 
            authFacade.logout();
            return throwError(() => refreshError);
          })
        )
      };
      return throwError(() => error);
    })
  );

};
