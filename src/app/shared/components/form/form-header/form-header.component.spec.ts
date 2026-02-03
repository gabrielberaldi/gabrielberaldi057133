import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from 'lucide-angular';
import { FormHeaderComponent } from './form-header.component';

describe('FormHeaderComponent', () => {
  let component: FormHeaderComponent;
  let fixture: ComponentFixture<FormHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormHeaderComponent);
    component = fixture.componentInstance;
    component.title = 'Test Title';
    component.description = 'Test Description';
    component.icon = User;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('when inputs are set', () => {
    it('should display title', () => {
      const testTitle = 'New Title';

      component.title = testTitle;
      fixture.detectChanges();

      expect(component.title).toBe(testTitle);
    });

    it('should display description', () => {
      const testDescription = 'New Description';

      component.description = testDescription;
      fixture.detectChanges();

      expect(component.description).toBe(testDescription);
    });

    it('should display icon', () => {
      const testIcon = User;

      component.icon = testIcon;
      fixture.detectChanges();

      expect(component.icon).toBe(testIcon);
    });
  });
});
