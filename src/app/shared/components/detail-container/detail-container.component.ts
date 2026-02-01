import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImagePlaceholderComponent } from '../image-placeholder/image-placeholder.component';
import { ButtonComponent } from '../button/button.component';
import { ArrowLeft, ExternalLink, LucideAngularModule, LucideIconData, PawPrint, Pencil, User } from 'lucide-angular';

@Component({
  selector: 'app-detail-container',
  standalone: true,
  imports: [ ButtonComponent, ImagePlaceholderComponent, LucideAngularModule ],
  templateUrl: './detail-container.component.html',
  styleUrl: './detail-container.component.scss'
})
export class DetailContainerComponent {

  @Input() imageUrl?: string;
  @Input() imagePlaceholder: LucideIconData = PawPrint; 
  @Input() listItems: any[] = [];
  @Input() listItemImagePlaceholder: LucideIconData = PawPrint;
  @Input() listTitle: string = 'Vínculos';
  @Input() listIcon: LucideIconData = User;
  @Input() listSubtitleProperty: string = '';
  @Input({ required: true }) title!: string;
  
  @Output() back = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() itemClick = new EventEmitter<number>();

  protected readonly ArrowLeft = ArrowLeft;
  protected readonly ExternalLink = ExternalLink;
  protected readonly PawPrint = PawPrint;
  protected readonly Pencil = Pencil;

  protected onBack(): void {
    this.back.emit();
  }

  protected onEdit(): void {
    this.edit.emit();
  }

  protected onItemClick(id: number): void {
    this.itemClick.emit(id);
  }
}
