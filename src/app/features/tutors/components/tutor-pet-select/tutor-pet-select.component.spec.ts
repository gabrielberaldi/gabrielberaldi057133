import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorPetSelectComponent } from './tutor-pet-select.component';

describe('TutorPetSelectComponent', () => {
  let component: TutorPetSelectComponent;
  let fixture: ComponentFixture<TutorPetSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorPetSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorPetSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
