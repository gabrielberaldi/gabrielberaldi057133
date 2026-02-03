import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    component.currentPage = 0;
    component.totalElements = 100;
    component.totalPages = 10;
    component.foundItensLabel = 'items found';
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('pages getter', () => {
    it('should return pages array with current page and neighbors', () => {
      component.currentPage = 5;
      component.totalPages = 10;

      const pages = component['pages'];

      expect(pages).toEqual([4, 5, 6]);
    });

    it('should handle first page correctly', () => {
      component.currentPage = 0;
      component.totalPages = 10;

      const pages = component['pages'];

      expect(pages).toEqual([0, 1]);
    });

    it('should handle last page correctly', () => {
      component.currentPage = 9;
      component.totalPages = 10;

      const pages = component['pages'];
      expect(pages).toEqual([8, 9]);
    });

    it('should handle single page', () => {
      component.currentPage = 0;
      component.totalPages = 1;

      const pages = component['pages'];

      expect(pages).toEqual([0]);
    });
  });

  describe('onPageChange', () => {
    it('should emit pageChange event when page is valid', () => {
      component.totalPages = 10;
      spyOn(component.pageChange, 'emit');
      const validPage = 5;
      component['onPageChange'](validPage);

      expect(component.pageChange.emit).toHaveBeenCalledWith(validPage);
    });

    it('should not emit pageChange event when page is negative', () => {
      component.totalPages = 10;
      spyOn(component.pageChange, 'emit');

      component['onPageChange'](-1);

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should not emit pageChange event when page exceeds totalPages', () => {
      component.totalPages = 10;
      spyOn(component.pageChange, 'emit');

      component['onPageChange'](10);

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should emit pageChange event for first page (0)', () => {
      component.totalPages = 10;
      spyOn(component.pageChange, 'emit');

      component['onPageChange'](0);

      expect(component.pageChange.emit).toHaveBeenCalledWith(0);
    });

    it('should emit pageChange event for last page', () => {
      component.totalPages = 10;
      spyOn(component.pageChange, 'emit');

      component['onPageChange'](9);

      expect(component.pageChange.emit).toHaveBeenCalledWith(9);
    });
  });
});
