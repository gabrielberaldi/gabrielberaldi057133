import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpErrorResponse, HttpStatusCode, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthFacade } from '../facades/auth.facade';
import { ToastService } from '../../../shared/components/toast/services/toast.service';
import { AuthResponse } from '../models/auth-response.model';

describe('authInterceptor', () => {
  let interceptor: HttpInterceptorFn;
  let httpTesting: HttpTestingController;
  let authFacadeSpy: jasmine.SpyObj<AuthFacade>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const MOCK_AUTH_RESPONSE: AuthResponse = {
    access_token: 'access-token-123',
    refresh_token: 'refresh-token-456',
    expires_in: 3600,
    refresh_expires_in: 7200
  };

  beforeEach(() => {
    let accessTokenValue: string | null = 'existing-token';
    const authFacadeSpyObj = jasmine.createSpyObj('AuthFacade', ['refreshToken', 'logout']);
    Object.defineProperty(authFacadeSpyObj, 'accessToken', {
      get: () => accessTokenValue,
      set: (value: string | null) => { accessTokenValue = value; },
      configurable: true
    });
    const toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthFacade, useValue: authFacadeSpyObj },
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    httpTesting = TestBed.inject(HttpTestingController);
    authFacadeSpy = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    
    interceptor = (req, next) => 
      TestBed.runInInjectionContext(() => authInterceptor(req, next));
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('when interceptor is initialized', () => {
    it('should be created', () => {
      expect(interceptor).toBeTruthy();
    });
  });

  describe('when request is to public route', () => {
    it('should not add Authorization header for login endpoint', (done) => {
      const req = new HttpRequest('POST', 'http://api.test/autenticacao/login', {});
      (authFacadeSpy as any).accessToken = null;

      interceptor(req, (req) => {
        expect(req.headers.has('Authorization')).toBeFalse();
        return of({} as HttpEvent<any>);
      }).subscribe(() => {
        done();
      });
    });

    it('should not add Authorization header for refresh endpoint', (done) => {
      const req = new HttpRequest('PUT', 'http://api.test/autenticacao/refresh', null);
      (authFacadeSpy as any).accessToken = null;

      interceptor(req, (req) => {
        expect(req.headers.has('Authorization')).toBeFalse();
        return of({} as HttpEvent<any>);
      }).subscribe(() => {
        done();
      });
    });
  });

  describe('when request is to protected route', () => {
    it('should add Authorization header with Bearer token', (done) => {
      const req = new HttpRequest('GET', 'http://api.test/v1/pets', {});
      (authFacadeSpy as any).accessToken = 'test-token';

      interceptor(req, (req) => {
        expect(req.headers.get('Authorization')).toBe('Bearer test-token');
        return of({} as HttpEvent<any>);
      }).subscribe(() => {
        done();
      });
    });

    it('should not add Authorization header when no token available', (done) => {
      const req = new HttpRequest('GET', 'http://api.test/v1/pets', {});
      (authFacadeSpy as any).accessToken = null;

      interceptor(req, (req) => {
        expect(req.headers.has('Authorization')).toBeFalse();
        return of({} as HttpEvent<any>);
      }).subscribe(() => {
        done();
      });
    });
  });

  describe('when request returns 401 Unauthorized', () => {
    it('should attempt token refresh and retry request', (done) => {
      const req = new HttpRequest('GET', 'http://api.test/v1/pets', {});
      (authFacadeSpy as any).accessToken = 'old-token';
      authFacadeSpy.refreshToken.and.returnValue(of(MOCK_AUTH_RESPONSE));
      let retryCount = 0;

      interceptor(req, (req) => {
        retryCount++;
        if (retryCount === 1) {
          return throwError(() => new HttpErrorResponse({ status: HttpStatusCode.Unauthorized }));
        }
        expect(req.headers.get('Authorization')).toBe(`Bearer ${MOCK_AUTH_RESPONSE.access_token}`);
        return of({} as HttpEvent<any>);
      }).subscribe(() => {
        expect(authFacadeSpy.refreshToken).toHaveBeenCalled();
        done();
      });
    });

    it('should logout and show error when refresh fails', (done) => {
      const req = new HttpRequest('GET', 'http://api.test/v1/pets', {});
      (authFacadeSpy as any).accessToken = 'old-token';
      authFacadeSpy.refreshToken.and.returnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

      interceptor(req, (req) => {
        return throwError(() => new HttpErrorResponse({ status: HttpStatusCode.Unauthorized }));
      }).subscribe({
        error: () => {
          setTimeout(() => {
            expect(authFacadeSpy.logout).toHaveBeenCalled();
            expect(toastServiceSpy.show).toHaveBeenCalledWith(
              jasmine.objectContaining({ 
                message: 'Sessão expirada, por favor, faça login novamente', 
                type: 'error' 
              })
            );
            done();
          }, 0);
        }
      });
    });

    it('should show login error message for public route 401', (done) => {
      const req = new HttpRequest('POST', 'http://api.test/autenticacao/login', {});

      interceptor(req, (req) => {
        return throwError(() => new HttpErrorResponse({ status: HttpStatusCode.Unauthorized }));
      }).subscribe({
        error: () => {
          setTimeout(() => {
            expect(toastServiceSpy.show).toHaveBeenCalledWith(
              jasmine.objectContaining({ 
                message: 'E-mail ou senha incorretos.', 
                type: 'error' 
              })
            );
            done();
          }, 0);
        }
      });
    });
  });

  describe('when request returns other error statuses', () => {
    it('should show connection error message for status 0', (done) => {
      const req = new HttpRequest('GET', 'http://api.test/v1/pets', {});

      interceptor(req, (req) => {
        return throwError(() => new HttpErrorResponse({ status: 0 }));
      }).subscribe({
        error: () => {
          setTimeout(() => {
            expect(toastServiceSpy.show).toHaveBeenCalledWith(
              jasmine.objectContaining({ 
                message: 'Falha ao conectar com o servidor. Verifique sua conexão.', 
                type: 'error' 
              })
            );
            done();
          }, 0);
        }
      });
    });

    it('should show bad request error message for status 400', (done) => {
      const req = new HttpRequest('POST', 'http://api.test/v1/pets', {});
      const errorResponse = new HttpErrorResponse({ 
        status: HttpStatusCode.BadRequest,
        error: { message: 'Validation failed' }
      });

      interceptor(req, (req) => {
        return throwError(() => errorResponse);
      }).subscribe({
        error: () => {
          setTimeout(() => {
            expect(toastServiceSpy.show).toHaveBeenCalledWith(
              jasmine.objectContaining({ 
                message: 'Validation failed', 
                type: 'error' 
              })
            );
            done();
          }, 0);
        }
      });
    });

    it('should show forbidden error message for status 403', (done) => {
      const req = new HttpRequest('DELETE', 'http://api.test/v1/pets/1', {});

      interceptor(req, (req) => {
        return throwError(() => new HttpErrorResponse({ status: HttpStatusCode.Forbidden }));
      }).subscribe({
        error: () => {
          setTimeout(() => {
            expect(toastServiceSpy.show).toHaveBeenCalledWith(
              jasmine.objectContaining({ 
                message: 'Você não tem permissão para esta operação.', 
                type: 'error' 
              })
            );
            done();
          }, 0);
        }
      });
    });

    it('should show server error message for status 500', (done) => {
      const req = new HttpRequest('GET', 'http://api.test/v1/pets', {});

      interceptor(req, (req) => {
        return throwError(() => new HttpErrorResponse({ status: HttpStatusCode.InternalServerError }));
      }).subscribe({
        error: () => {
          setTimeout(() => {
            expect(toastServiceSpy.show).toHaveBeenCalledWith(
              jasmine.objectContaining({ 
                message: 'Erro interno no servidor', 
                type: 'error' 
              })
            );
            done();
          }, 0);
        }
      });
    });
  });

  describe('when request succeeds', () => {
    it('should pass through successful response without showing error', (done) => {
      const req = new HttpRequest('GET', 'http://api.test/v1/pets', {});
      const mockResponse = { data: 'success' } as unknown as HttpEvent<any>;

      interceptor(req, (req) => {
        return of(mockResponse);
      }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(toastServiceSpy.show).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
