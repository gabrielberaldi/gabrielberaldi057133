import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Link, LucideAngularModule, PawPrint, Search } from 'lucide-angular';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { PetList } from '../../../pets/models/pet-list.model';

@Component({
  selector: 'app-tutor-pet-select',
  standalone: true,
  imports: [ ButtonComponent, InputComponent, LucideAngularModule, PaginatorComponent, ReactiveFormsModule ],
  providers: [],
  templateUrl: './tutor-pet-select.component.html',
  styleUrl: './tutor-pet-select.component.scss'
})
export class TutorPetSelectComponent {

  @Input({ required: true }) petsList!: PetList;
  @Input({ required: true }) searchControl!: FormControl;
  
  @Output() select = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

  readonly Search = Search;
  readonly Link = Link;
  readonly PawPrint = PawPrint;

  protected onPageChanged(page: number): void {
    this.pageChange.emit(page);
  }
}
