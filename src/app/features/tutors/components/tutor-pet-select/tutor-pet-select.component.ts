import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Link, LucideAngularModule, PawPrint, Search } from 'lucide-angular';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-tutor-pet-select',
  standalone: true,
  imports: [ ButtonComponent, InputComponent, LucideAngularModule, ReactiveFormsModule ],
  templateUrl: './tutor-pet-select.component.html',
  styleUrl: './tutor-pet-select.component.scss'
})
export class TutorPetSelectComponent {

  @Input({ required: true }) pets: any[] = [];
  @Input({ required: true }) searchControl!: FormControl;
  
  @Output() select = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();

  readonly Search = Search;
  readonly Link = Link;
  readonly PawPrint = PawPrint;
}
