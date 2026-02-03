import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { UserCredentials } from '../models/user-credentials.model';
import { AuthResponse } from '../models/auth-response.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;
  
  const apiUrl = `${environment.apiUrl}/autenticacao`;

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
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('when service is initialized', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('login', () => {
    it('should send POST request to login endpoint with credentials', () => {
      const expectedUrl = `${apiUrl}/login`;

      service.login(MOCK_CREDENTIALS).subscribe((response) => {
        expect(response).toEqual(MOCK_AUTH_RESPONSE);
      });

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(MOCK_CREDENTIALS);
      req.flush(MOCK_AUTH_RESPONSE);
    });

    it('should return AuthResponse when login is successful', () => {
      const expectedUrl = `${apiUrl}/login`;
      
      service.login(MOCK_CREDENTIALS).subscribe((response) => {
        expect(response.access_token).toBe(MOCK_AUTH_RESPONSE.access_token);
        expect(response.refresh_token).toBe(MOCK_AUTH_RESPONSE.refresh_token);
      });

      const req = httpTesting.expectOne(expectedUrl);
      req.flush(MOCK_AUTH_RESPONSE);
    });
  });

  describe('refreshToken', () => {
    it('should send PUT request to refresh endpoint with Bearer token in headers', () => {
      const refreshToken = 'refresh-token-789';
      const expectedUrl = `${apiUrl}/refresh`;

      service.refreshToken(refreshToken).subscribe((response) => {
        expect(response).toEqual(MOCK_AUTH_RESPONSE);
      });

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${refreshToken}`);
      expect(req.request.body).toBeNull();
      req.flush(MOCK_AUTH_RESPONSE);
    });

    it('should return AuthResponse when token refresh is successful', () => {
      const refreshToken = 'refresh-token-789';
      const expectedUrl = `${apiUrl}/refresh`;

      service.refreshToken(refreshToken).subscribe((response) => {
        expect(response.access_token).toBeDefined();
        expect(response.refresh_token).toBeDefined();
      });

      const req = httpTesting.expectOne(expectedUrl);
      req.flush(MOCK_AUTH_RESPONSE);
    });
  });
});
