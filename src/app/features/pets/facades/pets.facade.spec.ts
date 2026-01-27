import { TestBed } from '@angular/core/testing';
import { PetsFacade } from './pets.facade';


describe('PetsFacade', () => {
  let facade: PetsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(PetsFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});
