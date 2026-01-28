import { TestBed } from '@angular/core/testing';

import { TutorsFacade } from './tutors.facade';

describe('TutorsFacade', () => {
  let facade: TutorsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(TutorsFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});
