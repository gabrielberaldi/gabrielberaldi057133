import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';

@Component({
  template: `<app-input [formControl]="control" [type]="'text'"></app-input>`
})
class TestHostComponent {
  control = new FormControl('');
}

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, ReactiveFormsModule],
      declarations: [TestHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(InputComponent)).componentInstance;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value to component', () => {
      const testValue = 'test value';

      component.writeValue(testValue);

      expect(component['value']).toBe(testValue);
    });

    it('should register onChange callback', () => {
      const onChangeFn = jasmine.createSpy('onChange');

      component.registerOnChange(onChangeFn);
      component['onChange']('test');

      expect(onChangeFn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const onTouchedFn = jasmine.createSpy('onTouched');

      component.registerOnTouched(onTouchedFn);
      component['onTouched']();

      expect(onTouchedFn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);

      expect(component['disabled']).toBe(true);
    });
  });

  describe('onInput', () => {
    it('should update value and call onChange and onTouched', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      const onTouchedSpy = jasmine.createSpy('onTouched');
      component.registerOnChange(onChangeSpy);
      component.registerOnTouched(onTouchedSpy);
      const mockEvent = {
        target: { value: 'new value' }
      } as any;

      component['onInput'](mockEvent);

      expect(component['value']).toBe('new value');
      expect(onChangeSpy).toHaveBeenCalledWith('new value');
      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('isInvalid', () => {
    it('should return false when control is valid', () => {
      hostComponent.control.setValue('valid value');
      hostComponent.control.setValidators(null);
      hostComponent.control.updateValueAndValidity();
      fixture.detectChanges();

      const result = component['isInvalid'];

      expect(result).toBe(false);
    });

    it('should return true when control is invalid and touched', () => {
      hostComponent.control.setValue('');
      hostComponent.control.setValidators(Validators.required);
      hostComponent.control.updateValueAndValidity();
      hostComponent.control.markAsTouched();
      fixture.detectChanges();

      const result = component['isInvalid'];

      expect(result).toBe(true);
    });

    it('should return false when control is invalid but not touched or dirty', () => {
      hostComponent.control.setValue('');
      hostComponent.control.setValidators(Validators.required);
      hostComponent.control.updateValueAndValidity();
      fixture.detectChanges();

      const result = component['isInvalid'];

      expect(result).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('should return true when control has required validator', () => {
      hostComponent.control.setValidators(Validators.required);
      hostComponent.control.updateValueAndValidity();
      fixture.detectChanges();

      const result = component['isRequired'];

      expect(result).toBe(true);
    });

    it('should return false when control does not have required validator', () => {
      hostComponent.control.setValidators(null);
      hostComponent.control.updateValueAndValidity();
      fixture.detectChanges();

      const result = component['isRequired'];
      expect(result).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should return error message for required validation', () => {
      hostComponent.control.setValue('');
      hostComponent.control.setValidators(Validators.required);
      hostComponent.control.updateValueAndValidity();
      hostComponent.control.markAsTouched();
      fixture.detectChanges();

      const error = component['getErrorMessage']();

      expect(error).toBe('Campo obrigatório');
    });

    it('should return error message for email validation', () => {
      hostComponent.control.setValue('invalid');
      hostComponent.control.setValidators(Validators.email);
      hostComponent.control.updateValueAndValidity();
      hostComponent.control.markAsTouched();
      fixture.detectChanges();

      const error = component['getErrorMessage']();

      expect(error).toBe('E-mail inválido');
    });

    it('should return formatted error message for maxlength', () => {
      hostComponent.control.setValue('123456789');
      hostComponent.control.setValidators(Validators.maxLength(5));
      hostComponent.control.updateValueAndValidity();
      hostComponent.control.markAsTouched();
      fixture.detectChanges();

      const error = component['getErrorMessage']();

      expect(error).toBe('Limite máximo de 5 caracteres');
    });

    it('should return empty string when control is not touched', () => {
      hostComponent.control.setValue('');
      hostComponent.control.setValidators(Validators.required);
      hostComponent.control.updateValueAndValidity();
      fixture.detectChanges();

      const error = component['getErrorMessage']();

      expect(error).toBe('');
    });
  });
});
