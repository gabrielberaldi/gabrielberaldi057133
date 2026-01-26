import { TestBed } from '@angular/core/testing';

import { LayoutFacade } from './layout.facade';

describe('LayoutFacade', () => {
  let facade: LayoutFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(LayoutFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});
