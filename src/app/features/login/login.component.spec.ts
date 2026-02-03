import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthFacade } from '../../core/auth/facades/auth.facade';
import { of } from 'rxjs';
import { AuthResponse } from '../../core/auth/models/auth-response.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authFacadeSpy: jasmine.SpyObj<AuthFacade>;

  const MOCK_AUTH_RESPONSE: AuthResponse = {
    access_token: 'test-token',
    expires_in: 3600,
    refresh_token: 'refresh-token',
    refresh_expires_in: 7200
  };

  beforeEach(async () => {
    authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['login']);
    authFacadeSpy.login.and.returnValue(of(MOCK_AUTH_RESPONSE));

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthFacade, useValue: authFacadeSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have loginForm with username and password controls', () => {
      expect(component['loginForm'].get('username')).toBeTruthy();
      expect(component['loginForm'].get('password')).toBeTruthy();
    });

    it('should have required validators on form controls', () => {
      const usernameControl = component['loginForm'].get('username');
      const passwordControl = component['loginForm'].get('password');

      expect(usernameControl?.hasError('required')).toBe(true);
      expect(passwordControl?.hasError('required')).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('should not call authFacade.login if form is invalid', () => {
      component['loginForm'].patchValue({ username: '', password: '' });
      component['onSubmit']();
      expect(authFacadeSpy.login).not.toHaveBeenCalled();
    });

    it('should mark form as touched if form is invalid', () => {
      component['loginForm'].patchValue({ username: '', password: '' });
      spyOn(component['loginForm'], 'markAllAsTouched');
      component['onSubmit']();
      expect(component['loginForm'].markAllAsTouched).toHaveBeenCalled();
    });

    it('should call authFacade.login with credentials when form is valid', () => {
      const credentials = { username: 'test@example.com', password: 'password123' };
      component['loginForm'].patchValue(credentials);
      component['onSubmit']();
      expect(authFacadeSpy.login).toHaveBeenCalledWith(credentials);
    });
  });
});
