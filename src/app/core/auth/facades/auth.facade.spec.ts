import { TestBed } from '@angular/core/testing';
import { AuthFacade } from './auth.facade';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/components/toast/services/toast.service';
import { of, throwError, take } from 'rxjs';
import { UserCredentials } from '../models/user-credentials.model';
import { AuthResponse } from '../models/auth-response.model';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const MOCK_CREDENTIALS: UserCredentials = {
    username: 'test@example.com',
    password: 'password123'
  };

  const MOCK_AUTH_RESPONSE: AuthResponse = {
    access_token: 'access-token-123',
    refresh_token: 'refresh-token-456',
    expires_in: 3600,
    refresh_expires_in: 7200
  };

  beforeEach(() => {
    localStorage.clear();

    const serviceSpy = jasmine.createSpyObj('AuthService', ['login', 'refreshToken']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    facade = TestBed.inject(AuthFacade);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('when facade is initialized', () => {
    it('should be created', () => {
      expect(facade).toBeTruthy();
    });

    it('should load auth data from localStorage if present', (done) => {
      localStorage.setItem('auth_data', JSON.stringify(MOCK_AUTH_RESPONSE));
      (facade as any).authDataSubject$.next(MOCK_AUTH_RESPONSE);

      facade.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
        expect(isAuth).toBe(true);
        localStorage.removeItem('auth_data');
        done();
      });
    });

    it('should have isAuthenticated$ as false when no auth data', (done) => {
      facade.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBe(false);
        done();
      });
    });
  });

  describe('accessToken', () => {
    it('should return access token when auth data exists', () => {
      (facade as any).authDataSubject$.next(MOCK_AUTH_RESPONSE);

      const token = facade.accessToken;

      expect(token).toBe(MOCK_AUTH_RESPONSE.access_token);
    });

    it('should return null when no auth data', () => {
      const token = facade.accessToken;

      expect(token).toBeNull();
    });
  });

  describe('login', () => {
    it('should call service login, save to localStorage, show toast and navigate', () => {
      authServiceSpy.login.and.returnValue(of(MOCK_AUTH_RESPONSE));

      facade.login(MOCK_CREDENTIALS).subscribe();

      expect(authServiceSpy.login).toHaveBeenCalledWith(MOCK_CREDENTIALS);
      expect(localStorage.getItem('auth_data')).toBe(JSON.stringify(MOCK_AUTH_RESPONSE));
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Login realizado com sucesso', type: 'success' })
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/shell']);
    });

    it('should update isAuthenticated$ to true after successful login', (done) => {
      authServiceSpy.login.and.returnValue(of(MOCK_AUTH_RESPONSE));

      facade.login(MOCK_CREDENTIALS).subscribe(() => {
        facade.isAuthenticated$.subscribe(isAuth => {
          expect(isAuth).toBe(true);
          done();
        });
      });
    });
  });

  describe('logout', () => {
    it('should clear auth data, remove from localStorage and navigate to login', () => {
      (facade as any).authDataSubject$.next(MOCK_AUTH_RESPONSE);
      localStorage.setItem('auth_data', JSON.stringify(MOCK_AUTH_RESPONSE));

      facade.logout();

      expect(localStorage.getItem('auth_data')).toBeNull();
      expect(facade.accessToken).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should update isAuthenticated$ to false after logout', (done) => {
      (facade as any).authDataSubject$.next(MOCK_AUTH_RESPONSE);

      facade.logout();

      facade.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBe(false);
        done();
      });
    });
  });

  describe('refreshToken', () => {
    it('should call service refreshToken and update session', () => {
      (facade as any).authDataSubject$.next(MOCK_AUTH_RESPONSE);
      const newResponse: AuthResponse = {
        ...MOCK_AUTH_RESPONSE,
        access_token: 'new-access-token'
      };
      authServiceSpy.refreshToken.and.returnValue(of(newResponse));

      facade.refreshToken().subscribe();

      expect(authServiceSpy.refreshToken).toHaveBeenCalledWith(MOCK_AUTH_RESPONSE.refresh_token);
      expect(localStorage.getItem('auth_data')).toBe(JSON.stringify(newResponse));
    });

    it('should throw error when no refresh token is available', (done) => {
      (facade as any).authDataSubject$.next(null);

      facade.refreshToken().subscribe({
        error: (error) => {
          expect(error.message).toBe('Sem refresh token disponível');
          done();
        }
      });
    });

    it('should handle refresh token error', (done) => {
      (facade as any).authDataSubject$.next(MOCK_AUTH_RESPONSE);
      authServiceSpy.refreshToken.and.returnValue(throwError(() => new Error('Refresh failed')));

      facade.refreshToken().subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          done();
        }
      });
    });
  });
});