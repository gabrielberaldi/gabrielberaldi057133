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
    required: 'Campo obrigatório'
  };
  
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    if (!!this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get isInvalid(): boolean { 
    const control = this.ngControl?.control;
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  get isRequired(): boolean { 
    const control = this.ngControl?.control;
    if (!control || !control.validator) return false;
    const validator = control?.validator?.({} as AbstractControl);
    return !!validator && validator['required'];
  }

  getErrorMessage(): string { 
    const errors = this.ngControl?.control?.errors;
    if (!errors) return '';
    const firstErrorKey = Object.keys(errors)[0];
    return this.errorMessages[firstErrorKey];
  }

  onInput(event: Event): void { 
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
    console.log(value, ' value');
    
    this.value = value;
  }
  

}
