import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    component.isOpen = false;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default customClass', () => {
      expect(component.customClass).toBe('max-w-md');
    });
  });

  describe('close output', () => {
    it('should emit close event when close is called', () => {
      spyOn(component.close, 'emit');

      component.close.emit();

      expect(component.close.emit).toHaveBeenCalled();
    });
  });
});
