import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorPetsListComponent } from './tutor-pets-list.component';

describe('TutorPetsListComponent', () => {
  let component: TutorPetsListComponent;
  let fixture: ComponentFixture<TutorPetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorPetsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorPetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
