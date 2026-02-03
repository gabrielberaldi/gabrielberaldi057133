import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthFacade } from '../facades/auth.facade';

describe('authGuard', () => {
  let executeGuard: CanActivateFn;
  let authFacadeSpy: jasmine.SpyObj<AuthFacade>;
  let routerSpy: jasmine.SpyObj<Router>;
  let isAuthenticatedSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    const authFacadeSpyObj = jasmine.createSpyObj('AuthFacade', [], {
      isAuthenticated$: isAuthenticatedSubject.asObservable()
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: authFacadeSpyObj },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    authFacadeSpy = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    executeGuard = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  });

  describe('when guard is executed', () => {
    it('should be created', () => {
      expect(executeGuard).toBeTruthy();
    });
  });

  describe('when user is authenticated', () => {
    it('should allow access and return true', (done) => {
      isAuthenticatedSubject.next(true);

      const result = executeGuard({} as any, {} as any) as any;

      result.subscribe((allowed: boolean | any) => {
        expect(allowed).toBe(true);
        expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('when user is not authenticated', () => {
    it('should deny access and redirect to login', (done) => {
      isAuthenticatedSubject.next(false);
      const urlTree = {} as any;
      routerSpy.createUrlTree.and.returnValue(urlTree);

      const result = executeGuard({} as any, {} as any) as any;

      result.subscribe((allowed: boolean | any) => {
        expect(allowed).toBe(urlTree);
        expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
        done();
      });
    });
  });
});
