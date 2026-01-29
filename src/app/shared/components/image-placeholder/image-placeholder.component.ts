import { Component, Input } from '@angular/core';
import { LucideAngularModule, PawPrint } from 'lucide-angular';

@Component({
  selector: 'app-image-placeholder',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './image-placeholder.component.html',
  styleUrl: './image-placeholder.component.scss'
})
export class ImagePlaceholderComponent {
 
  @Input() icon = PawPrint;
  @Input() label = 'Nenhuma foto disponível';
  @Input() size = 40;

}
