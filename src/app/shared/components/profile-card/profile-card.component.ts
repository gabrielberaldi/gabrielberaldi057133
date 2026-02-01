import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChevronRight, LucideAngularModule, LucideIconData, UserRound } from 'lucide-angular';
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
  
  @Output() detail = new EventEmitter<void>();

  protected readonly ChevronRight = ChevronRight;

  protected onDetail(): void {
    this.detail.emit();
  }
  
}
