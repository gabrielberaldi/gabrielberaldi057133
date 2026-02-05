import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChevronRight, EllipsisVertical, LucideAngularModule, LucideIconData, Pencil, Plus, Trash2, UserRound } from 'lucide-angular';
import { ImagePlaceholderComponent } from '../image-placeholder/image-placeholder.component';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ ImagePlaceholderComponent, LucideAngularModule ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input({ required: true }) title!: string;
  @Input() imageUrl?: string | null;
  @Input() placeholderIcon: LucideIconData = UserRound;
  
  @Output() edit = new EventEmitter<void>();
  @Output() detail = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  protected readonly ChevronRight = ChevronRight;
  protected readonly EllipsisVertical = EllipsisVertical;
  protected readonly Pencil = Pencil;
  protected readonly Trash2 = Trash2;

  protected onEdit(): void {
    this.edit.emit();
  }

   protected onDetail(): void {
    this.detail.emit();
  }

  protected onDelete(): void {
    this.delete.emit();
  }
  
}
