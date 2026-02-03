import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileCardComponent } from './profile-card.component';
import { UserRound, User } from 'lucide-angular';

describe('ProfileCardComponent', () => {
  let component: ProfileCardComponent;
  let fixture: ComponentFixture<ProfileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileCardComponent);
    component = fixture.componentInstance;
    component.title = 'Test Title';
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default placeholderIcon as UserRound', () => {
      expect(component.placeholderIcon).toBe(UserRound);
    });

    it('should have ChevronRight icon available', () => {
      expect(component['ChevronRight']).toBeDefined();
    });
  });

  describe('onDetail', () => {
    it('should emit detail event', () => {
      spyOn(component.detail, 'emit');
      component['onDetail']();
      expect(component.detail.emit).toHaveBeenCalled();
    });
  });

  describe('when inputs are set', () => {
    it('should accept imageUrl', () => {
      const imageUrl = 'https://example.com/image.jpg';

      component.imageUrl = imageUrl;
      fixture.detectChanges();

      expect(component.imageUrl).toBe(imageUrl);
    });

    it('should accept custom placeholderIcon', () => {
      const customIcon = User;

      component.placeholderIcon = customIcon;
      fixture.detectChanges();

      expect(component.placeholderIcon).toBe(customIcon);
    });
  });
});
