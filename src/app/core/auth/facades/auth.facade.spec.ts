import { TestBed } from '@angular/core/testing';
import { AuthFacade } from './auth.facade';


describe('AuthFacade', () => {
  let facade: AuthFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(AuthFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});