import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');

    if (numbers.length < 10 || numbers.length > 11) {
      return value; 
    };

    const match = numbers.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    };
    
    return value;
  }

}
