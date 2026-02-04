import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { PaginatorComponent } from '../paginator/paginator.component';
import { LucideAngularModule, SearchIcon } from 'lucide-angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { CardList } from './models/list.model';
import { NgTemplateOutlet } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [ InputComponent, LucideAngularModule, NgTemplateOutlet, PaginatorComponent, ReactiveFormsModule ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent implements OnInit {
  
  @Input({ required: true }) cardTemplate!: TemplateRef<any>;
  @Input({ required: true }) list!: CardList<any>;
  @Input({ required: true }) foundLabel!: string;
  @Input() placeholder: string = '';

  @Output() pageChange = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();

  private readonly destroyRef = inject(DestroyRef);
  protected readonly searchControl = new FormControl('');
  protected readonly SearchIcon = SearchIcon;

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => this.search.emit(value ?? ''));
  }

  protected onPageChanged(page: number): void {
    this.pageChange.emit(page);
  }
}
