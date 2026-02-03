import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagePlaceholderComponent } from './image-placeholder.component';
import { PawPrint, User } from 'lucide-angular';

describe('ImagePlaceholderComponent', () => {
  let component: ImagePlaceholderComponent;
  let fixture: ComponentFixture<ImagePlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagePlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagePlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default icon as PawPrint', () => {
      expect(component.icon).toBe(PawPrint);
    });

    it('should have default size as 40', () => {
      expect(component.size).toBe(40);
    });
  });

  describe('when inputs are set', () => {
    it('should accept custom icon', () => {
      const customIcon = User;
      component.icon = customIcon;
      fixture.detectChanges();

      expect(component.icon).toBe(customIcon);
    });

    it('should accept custom size', () => {
      const customSize = 60;

      component.size = customSize;
      fixture.detectChanges();

      expect(component.size).toBe(customSize);
    });
  });
});
