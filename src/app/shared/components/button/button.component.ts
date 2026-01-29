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

  onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.action.emit(event);
    }
  }

}
