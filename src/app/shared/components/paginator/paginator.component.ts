import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {

  @Input({ required: true }) currentPage = 0;
  @Input({ required: true }) totalElements = 0;
  @Input({ required: true }) totalPages = 0;
  @Input({ required: true }) foundItensLabel!: string;

  @Output() pageChange = new EventEmitter<number>();

  protected get pages(): number[] {
    const pages = [];
    const start = Math.max(0, this.currentPage - 1);
    const end = Math.min(this.totalPages - 1, this.currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  protected onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }

}
