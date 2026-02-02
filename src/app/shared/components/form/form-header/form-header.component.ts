import { Component, Input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './form-header.component.html',
  styleUrl: './form-header.component.scss'
})
export class FormHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) icon!: LucideIconData;
}
