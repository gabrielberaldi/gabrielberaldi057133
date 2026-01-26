import { TestBed } from '@angular/core/testing';
import { PetsFacade } from './pets.facade';


describe('PetsFacade', () => {
  let service: PetsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetsFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
