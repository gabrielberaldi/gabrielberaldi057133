import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoCardComponent } from './info-card.component';

describe('InfoCardComponent', () => {
  let component: InfoCardComponent;
  let fixture: ComponentFixture<InfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoCardComponent);
    component = fixture.componentInstance;
    component.label = 'Test Label';
    component.value = 'Test Value';
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('when inputs are set', () => {
    it('should display label', () => {
      const testLabel = 'Name';

      component.label = testLabel;
      fixture.detectChanges();

      expect(component.label).toBe(testLabel);
    });

    it('should display string value', () => {
      const testValue = 'John Doe';

      component.value = testValue;
      fixture.detectChanges();

      expect(component.value).toBe(testValue);
    });

    it('should display number value', () => {
      const testValue = 42;

      component.value = testValue;
      fixture.detectChanges();

      expect(component.value).toBe(testValue);
    });
  });
});
