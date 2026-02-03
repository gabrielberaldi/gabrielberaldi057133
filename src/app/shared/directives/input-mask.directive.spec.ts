import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputMaskDirective } from './input-mask.directive';

@Component({
  template: `<input [inputMask]="maskType" [formControl]="control" />`
})
class TestComponent {
  maskType: 'phone' = 'phone';
  control = new FormControl('');
}

describe('InputMaskDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: InputMaskDirective;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [InputMaskDirective, ReactiveFormsModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const directiveElement = fixture.debugElement.query(By.directive(InputMaskDirective));
    directive = directiveElement.injector.get(InputMaskDirective);
    inputElement = directiveElement.nativeElement;
  });

  describe('when directive is initialized', () => {
    it('should create an instance', () => {
      expect(directive).toBeTruthy();
    });
  });

  describe('when maskType is phone', () => {
    it('should format phone number with 11 digits', () => {
      const value = '11987654321';

      inputElement.value = value;
      inputElement.dispatchEvent(new Event('input'));

      expect(inputElement.value).toBe('(11) 98765-4321');
      expect(component.control.value).toBe('(11) 98765-4321');
    });

    it('should format phone number with 10 digits', () => {
      const value = '1187654321';

      inputElement.value = value;
      inputElement.dispatchEvent(new Event('input'));

      expect(inputElement.value).toBe('(11) 8765-4321');
      expect(component.control.value).toBe('(11) 8765-4321');
    });

    it('should format partial phone number with 2 digits', () => {
      const value = '11';

      inputElement.value = value;
      inputElement.dispatchEvent(new Event('input'));

      expect(inputElement.value).toBe('(11');
      expect(component.control.value).toBe('(11');
    });

    it('should format partial phone number with 3-5 digits', () => {
      const value = '11876';

      inputElement.value = value;
      inputElement.dispatchEvent(new Event('input'));

      expect(inputElement.value).toBe('(11) 876');
      expect(component.control.value).toBe('(11) 876');
    });

    it('should remove non-digit characters', () => {
      const value = '11abc98765def4321';

      inputElement.value = value;
      inputElement.dispatchEvent(new Event('input'));

      expect(inputElement.value).toBe('(11) 98765-4321');
      expect(component.control.value).toBe('(11) 98765-4321');
    });

    it('should limit to 11 digits maximum', () => {
      const value = '11987654321000';
      inputElement.value = value;
      inputElement.dispatchEvent(new Event('input'));

      expect(inputElement.value).toBe('(11) 98765-4321');
      expect(component.control.value).toBe('(11) 98765-4321');
    });

    it('should handle empty string', () => {
      const value = '';

      inputElement.value = value;
      inputElement.dispatchEvent(new Event('input'));

      expect(inputElement.value).toBe('');
      expect(component.control.value).toBe('');
    });
  });

  describe('when maskType is not set', () => {
    it('should not apply any formatting', () => {
      component.maskType = undefined as any;
      fixture.detectChanges();
      const value = '11987654321';

      inputElement.value = value;
      inputElement.dispatchEvent(new Event('input'));

      expect(inputElement.value).toBe('11987654321');
    });
  });

  describe('when control is not available', () => {
    it('should not throw error when ngControl is null', () => {
      (directive as any).ngControl = { control: null };
      directive.maskType = 'phone';
      const mockInput = document.createElement('input');
      mockInput.value = '11987654321';

      expect(() => {
        directive.onInput(mockInput, '11987654321');
      }).not.toThrow();
    });
  });
});
