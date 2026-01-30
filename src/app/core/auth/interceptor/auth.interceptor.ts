import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacade } from '../facades/auth.facade';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { ToastService } from '../../../shared/components/toast/services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);
  const toastService = inject(ToastService);

  const accessToken = authFacade.accessToken;
  const isPublicRoute = ['autenticacao/login', 'autenticacao/refresh'].some(url => req.url.includes(url));

  let errorMessage: string | null = null;
  let requestToForward = req;

  if (!isPublicRoute && accessToken) {
    requestToForward = req.clone({ 
      setHeaders: { Authorization: `Bearer ${accessToken}` } 
    });
  }

  return next(requestToForward).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized && !isPublicRoute) { 
        return authFacade.refreshToken().pipe(
          switchMap((response) => {
            const retryRequest = req.clone({ setHeaders: { Authorization: `Bearer ${response.access_token}` } });
            return next(retryRequest);
          }),
          catchError((refreshError: HttpErrorResponse) => { 
            errorMessage = 'Sessão expirada, por favor, faça login novamente';
            authFacade.logout();
            return throwError(() => refreshError);
          })
        );
      }

      switch (error.status) {
        case 0:
          errorMessage = 'Falha ao conectar com o servidor. Verifique sua conexão.';
          break;
        case HttpStatusCode.BadRequest:
          errorMessage = error.error?.message || 'Dados inválidos.';
          break;
        case HttpStatusCode.Unauthorized:
          if (isPublicRoute) errorMessage = 'E-mail ou senha incorretos.';
          else errorMessage = 'Sem autorização';
          break;
        case HttpStatusCode.Forbidden:
          errorMessage = 'Você não tem permissão para esta operação.';
          break;
        case HttpStatusCode.InternalServerError:
          errorMessage = 'Erro interno no servidor';
          break;
      }

      return throwError(() => error);
    }),
    finalize(() => {
      if (errorMessage) {
        toastService.show({ message: errorMessage, type: 'error' });
      }
    })
  );
};