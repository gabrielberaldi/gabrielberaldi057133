import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ChevronRight, LucideAngularModule, PawPrint } from 'lucide-angular';
import { Pet } from '../../models/pet.model';
import { ImagePlaceholderComponent } from '../../../../shared/components/image-placeholder/image-placeholder.component';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [ImagePlaceholderComponent, LucideAngularModule],
  templateUrl: './pet-card.component.html',
  styleUrl: './pet-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetCardComponent {

  @Input({ required: true }) pet!: Pet;
  @Output() viewDetails = new EventEmitter<number>();

  protected readonly PawPrint = PawPrint;
  protected readonly ChevronRight = ChevronRight;

  protected onDetail(): void {
    if (!this.pet.id) return;
    this.viewDetails.emit(this.pet.id);
  }

}
