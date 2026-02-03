import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.disabled).toBe(false);
      expect(component.loading).toBe(false);
      expect(component.type).toBe('button');
      expect(component.variant).toBe('btn-primary');
      expect(component.responsive).toBe(true);
      expect(component.iconSize).toBe(18);
    });
  });

  describe('variantClasses', () => {
    it('should return correct classes for btn-primary variant', () => {
      component.variant = 'btn-primary';

      const classes = component.variantClasses;

      expect(classes).toContain('btn-primary');
      expect(classes).toContain('btn-outline');
    });

    it('should return correct classes for btn-outline variant', () => {
      component.variant = 'btn-outline';

      const classes = component.variantClasses;

      expect(classes).toContain('hover:bg-base-200');
      expect(classes).toContain('font-medium');
    });

    it('should return correct classes for btn-error variant', () => {
      component.variant = 'btn-error';

      const classes = component.variantClasses;

      expect(classes).toContain('btn-error');
    });

    it('should return correct classes for btn-neutral variant', () => {
      component.variant = 'btn-neutral';

      const classes = component.variantClasses;

      expect(classes).toContain('btn-neutral');
    });
  });

  describe('onClick', () => {
    it('should emit action event when not disabled and not loading', () => {
      component.disabled = false;
      component.loading = false;
      spyOn(component.action, 'emit');
      const mockEvent = new MouseEvent('click');

      component['onClick'](mockEvent);

      expect(component.action.emit).toHaveBeenCalledWith(mockEvent);
    });

    it('should not emit action event when disabled', () => {
      component.disabled = true;
      component.loading = false;
      spyOn(component.action, 'emit');
      const mockEvent = new MouseEvent('click');

      component['onClick'](mockEvent);

      expect(component.action.emit).not.toHaveBeenCalled();
    });

    it('should not emit action event when loading', () => {
      component.disabled = false;
      component.loading = true;
      spyOn(component.action, 'emit');
      const mockEvent = new MouseEvent('click');

      component['onClick'](mockEvent);

      expect(component.action.emit).not.toHaveBeenCalled();
    });
  });
});
