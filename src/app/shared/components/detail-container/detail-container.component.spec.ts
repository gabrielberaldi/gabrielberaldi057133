import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailContainerComponent } from './detail-container.component';
import { PawPrint, User } from 'lucide-angular';

describe('DetailContainerComponent', () => {
  let component: DetailContainerComponent;
  let fixture: ComponentFixture<DetailContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailContainerComponent);
    component = fixture.componentInstance;
    component.title = 'Test Title';
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.imagePlaceholder).toBe(PawPrint);
      expect(component.listItems).toEqual([]);
      expect(component.listItemImagePlaceholder).toBe(PawPrint);
      expect(component.listTitle).toBe('Vínculos');
      expect(component.listIcon).toBe(User);
    });

    it('should have icons available', () => {
      expect(component['ArrowLeft']).toBeDefined();
      expect(component['ExternalLink']).toBeDefined();
      expect(component['PawPrint']).toBeDefined();
      expect(component['Pencil']).toBeDefined();
    });
  });

  describe('onBack', () => {
    it('should emit back event', () => {
      spyOn(component.back, 'emit');

      component['onBack']();

      expect(component.back.emit).toHaveBeenCalled();
    });
  });

  describe('onEdit', () => {
    it('should emit edit event', () => {
      spyOn(component.edit, 'emit');

      component['onEdit']();

      expect(component.edit.emit).toHaveBeenCalled();
    });
  });

  describe('onItemClick', () => {
    it('should emit itemClick event with id', () => {
      const itemId = 123;
      spyOn(component.itemClick, 'emit');

      component['onItemClick'](itemId);

      expect(component.itemClick.emit).toHaveBeenCalledWith(itemId);
    });
  });
});
