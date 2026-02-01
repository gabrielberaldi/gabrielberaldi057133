import { Component, Input } from '@angular/core';
import { LucideAngularModule, LucideIconData, PawPrint } from 'lucide-angular';

@Component({
  selector: 'app-image-placeholder',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './image-placeholder.component.html',
  styleUrl: './image-placeholder.component.scss'
})
export class ImagePlaceholderComponent {
 
  @Input() icon: LucideIconData = PawPrint;
  @Input() size: number = 40;

}
