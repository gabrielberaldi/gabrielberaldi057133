import { TestBed } from '@angular/core/testing';

import { ShellFacade } from './shell.facade';

describe('ShellFacade', () => {
  let facade: ShellFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(ShellFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});
