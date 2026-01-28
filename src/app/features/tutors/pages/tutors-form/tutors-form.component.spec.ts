import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorsFormComponent } from './tutors-form.component';

describe('TutorsFormComponent', () => {
  let component: TutorsFormComponent;
  let fixture: ComponentFixture<TutorsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
