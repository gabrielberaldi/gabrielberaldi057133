import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { ArrowLeft, LucideAngularModule, Save, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-form-actions',
  standalone: true,
  imports: [ButtonComponent, LucideAngularModule],
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.scss'
})
export class FormActionsComponent {
  @Input() isEdit: boolean = false;
  @Input() isInvalid: boolean = false;

  @Output() back = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  protected readonly ArrowLeft = ArrowLeft;
  protected readonly Trash2 = Trash2;
  protected readonly Save = Save;

  protected onBack(): void {
    this.back.emit();
  }

  protected onDelete(): void {
    this.delete.emit();
  }

  protected onSave(): void {
    this.save.emit();
  }
}
