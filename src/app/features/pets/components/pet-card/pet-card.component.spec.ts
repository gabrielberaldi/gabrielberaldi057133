import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetCardComponent } from './pet-card.component';
import { Pet } from '../../models/pet.model';

describe('PetCardComponent', () => {
  let component: PetCardComponent;
  let fixture: ComponentFixture<PetCardComponent>;

  const MOCK_PET: Pet = {
    id: 1,
    nome: 'Rex',
    raca: 'Golden Retriever',
    idade: 5,
    foto: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetCardComponent);
    component = fixture.componentInstance;
    component.pet = MOCK_PET;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
