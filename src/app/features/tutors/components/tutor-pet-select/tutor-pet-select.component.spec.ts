import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TutorPetSelectComponent } from './tutor-pet-select.component';

describe('TutorPetSelectComponent', () => {
  let component: TutorPetSelectComponent;
  let fixture: ComponentFixture<TutorPetSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorPetSelectComponent, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorPetSelectComponent);
    component = fixture.componentInstance;
    component.pets = [];
    component.searchControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
