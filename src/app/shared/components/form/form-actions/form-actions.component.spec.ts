import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormActionsComponent } from './form-actions.component';

describe('FormActionsComponent', () => {
  let component: FormActionsComponent;
  let fixture: ComponentFixture<FormActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.isEdit).toBe(false);
      expect(component.isInvalid).toBe(false);
    });

    it('should have icons available', () => {
      expect(component['ArrowLeft']).toBeDefined();
      expect(component['Trash2']).toBeDefined();
      expect(component['Save']).toBeDefined();
    });
  });

  describe('onBack', () => {
    it('should emit back event', () => {
      spyOn(component.back, 'emit');

      component['onBack']();

      expect(component.back.emit).toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should emit delete event', () => {
      spyOn(component.delete, 'emit');

      component['onDelete']();

      expect(component.delete.emit).toHaveBeenCalled();
    });
  });

  describe('onSave', () => {
    it('should emit save event', () => {
      spyOn(component.save, 'emit');

      component['onSave']();

      expect(component.save.emit).toHaveBeenCalled();
    });
  });
});
