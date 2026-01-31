import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [LucideAngularModule, NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

  @Input() customClass?: string;
  @Input() disabled = false;
  @Input() icon?: LucideIconData;
  @Input() label = '';
  @Input() iconSize = 18;
  @Input() loading = false;
  @Input() responsive = true;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'btn-primary' | 'btn-outline' | 'btn-error' | 'btn-neutral' = 'btn-primary';

  @Output() action = new EventEmitter<MouseEvent>();

  private readonly variants: Record<string, string> = {
    'btn-primary': 'btn-outline btn-primary',
    'btn-outline': 'btn-outline hover:bg-base-200 font-medium shadow-none',
    'btn-error': 'btn-outline btn-error',
    'btn-neutral': 'btn-neutral'
  }

  get variantClasses(): string {
    const baseClasses = 'btn gap-2 font-semibold shadow-md';
    return `${baseClasses} ${this.variants[this.variant] || ''}`;
  }

  protected onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.action.emit(event);
    }
  }

}
