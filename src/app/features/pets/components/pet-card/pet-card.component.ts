import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ChevronRight, PawPrint } from 'lucide-angular';
import { Pet } from '../../models/pet.model';
import { ImagePlaceholderComponent } from '../../../../shared/components/image-placeholder/image-placeholder.component';
import { ProfileCardComponent } from '../../../../shared/components/profile-card/profile-card.component';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [ImagePlaceholderComponent, ProfileCardComponent],
  templateUrl: './pet-card.component.html',
  styleUrl: './pet-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetCardComponent {

  @Input({ required: true }) pet!: Pet;
  
  @Output() delete = new EventEmitter<Pet>();
  @Output() edit = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<number>();

  protected readonly PawPrint = PawPrint;
  protected readonly ChevronRight = ChevronRight;

  protected onDelete(): void {
    this.delete.emit(this.pet);
  }

  protected onEdit(): void {
    this.edit.emit(this.pet.id!);
  }

  protected onDetail(): void {
    this.viewDetails.emit(this.pet.id!);
  }


}
