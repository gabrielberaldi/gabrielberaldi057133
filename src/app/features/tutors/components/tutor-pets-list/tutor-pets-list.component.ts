import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Info, LucideAngularModule, PawPrint, Plus, Trash2, Unlink } from 'lucide-angular';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Pet } from '../../../pets/models/pet.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tutor-pets-list',
  standalone: true,
  imports: [ButtonComponent, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './tutor-pets-list.component.html',
  styleUrl: './tutor-pets-list.component.scss'
})
export class TutorPetsListComponent {

  @Input({ required: true }) tutorId!: number | null;
  @Input() pets: Pet[] = [];
  
  @Output() addRequest = new EventEmitter<void>();
  @Output() removeRequest = new EventEmitter<number>();

  readonly Info = Info;
  readonly Plus = Plus;
  readonly PawPrint = PawPrint;
  readonly Trash2 = Trash2;

}
