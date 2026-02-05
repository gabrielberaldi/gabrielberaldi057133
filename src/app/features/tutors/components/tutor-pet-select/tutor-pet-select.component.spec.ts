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
    component.petsList = { content: [], page: 10, size: 10, pageCount: 5, total: 20 };
    component.searchControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoud emit pageChange event', () => {
    spyOn(component.pageChange, 'emit');
    const page = 2;
    component['onPageChanged'](page);
    expect(component.pageChange.emit).toHaveBeenCalledWith(page);
  })

});
