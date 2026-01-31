import { Component, Input } from '@angular/core';
import { ImagePlaceholderComponent } from '../image-placeholder/image-placeholder.component';
import { ButtonComponent } from '../button/button.component';
import { RouterLink } from '@angular/router';
import { ArrowLeft, ExternalLink, LucideAngularModule, LucideIconData, PawPrint, Pencil, User } from 'lucide-angular';

@Component({
  selector: 'app-detail-container',
  standalone: true,
  imports: [ ButtonComponent, ImagePlaceholderComponent, LucideAngularModule, RouterLink ],
  templateUrl: './detail-container.component.html',
  styleUrl: './detail-container.component.scss'
})
export class DetailContainerComponent {
  @Input({ required: true }) backLink!: string;
  @Input({ required: true }) editLink!: any[];
  @Input() imageUrl?: string;
  @Input() imagePlaceholder: LucideIconData = PawPrint; 
  @Input() listItems: any[] | undefined = [];
  @Input() listItemImagePlaceholder: LucideIconData = PawPrint;
  @Input() listTitle: string = 'Vínculos';
  @Input() listIcon: LucideIconData = User;
  @Input() listDetailRoutePrefix: string = '';
  @Input() listSubtitleProperty: string = '';
  @Input({ required: true }) title!: string;

  protected readonly ArrowLeft = ArrowLeft;
  protected readonly ExternalLink = ExternalLink;
  protected readonly PawPrint = PawPrint;
  protected readonly Pencil = Pencil;
}
