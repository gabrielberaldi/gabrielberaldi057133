import { Directive, HostListener, inject, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[inputMask]',
  standalone: true
})
export class InputMaskDirective {
  
  @Input('inputMask') maskType!: 'phone';
  private readonly ngControl = inject(NgControl);
  
  @HostListener('input', ['$event.target', '$event.target.value'])
  onInput(inputHtml: HTMLInputElement, value: string) {
    if (!this.maskType) return;

    let formattedValue = value;
    
    if (this.maskType === 'phone') {
      formattedValue = this.applyPhoneMask(value);
    };

    inputHtml.value = formattedValue;
    this.ngControl.control?.setValue(formattedValue, { emitEvent: false });
  }

  private applyPhoneMask(value: string): string {
    value = value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (value.length > 5) return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    if (value.length > 2) return value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    return value.length > 0 ? '(' + value : value;
  }

}
