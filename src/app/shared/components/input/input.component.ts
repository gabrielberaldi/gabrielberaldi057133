import { Component, inject, Input, Optional, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ LucideAngularModule, ReactiveFormsModule ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {

  @Input() icon?: LucideIconData;
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input({ required: true }) type!: 'text' | 'password' | 'number';

  @Self() @Optional() protected ngControl = inject(NgControl, { self: true, optional: true });

  protected disabled = false;
  protected value = '';
  
  private errorMessages: Record<string, any> = {
    email: 'E-mail inválido',
    required: 'Campo obrigatório',
    maxlength: (err: any) => `Limite máximo de ${err.requiredLength} caracteres`,
    minlength: (err: any) => `Mínimo de ${err.requiredLength} caracteres`
  };
  
  protected onChange: any = () => {};
  protected onTouched: any = () => {};

  constructor() {
    if (!!this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  protected get isInvalid(): boolean { 
    const control = this.ngControl?.control;
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  protected get isRequired(): boolean { 
    const control = this.ngControl?.control;
    if (!control || !control.validator) return false;
    const validator = control?.validator?.({} as AbstractControl);
    return !!validator && validator['required'];
  }

  protected getErrorMessage(): string {
    const control = this.ngControl?.control;
    if (!control || !control.errors || !control.touched) return '';
    const firstErrorKey = Object.keys(control.errors)[0];
    const errorValue = control.errors[firstErrorKey];
    if (typeof this.errorMessages[firstErrorKey] === 'function') {
      return this.errorMessages[firstErrorKey](errorValue);
    }
    return this.errorMessages[firstErrorKey] || 'Campo inválido';
  }

  protected onInput(event: Event): void { 
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn: any): void { 
    this.onChange = fn; 
  }

  registerOnTouched(fn: any): void { 
    this.onTouched = fn; 
  }

  setDisabledState(isDisabled: boolean): void { 
    this.disabled = isDisabled; 
  }
  
  writeValue(value: any): void { 
    this.value = value;
  }
  

}
