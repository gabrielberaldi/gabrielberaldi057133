import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorCardComponent } from './tutor-card.component';
import { Tutor } from '../../models/tutor.model';

describe('TutorCardComponent', () => {
  let component: TutorCardComponent;
  let fixture: ComponentFixture<TutorCardComponent>;

  const MOCK_TUTOR: Tutor = {
    id: 1,
    nome: 'João Silva',
    telefone: '11999999999',
    endereco: 'Rua das Flores, 123',
    foto: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorCardComponent);
    component = fixture.componentInstance;
    component.tutor = MOCK_TUTOR;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
