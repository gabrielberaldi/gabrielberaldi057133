import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from './services/toast.service';
import { BehaviorSubject } from 'rxjs';
import { ToastConfig } from './models/toast-config.model';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let toastsSubject: BehaviorSubject<ToastConfig[]>;

  beforeEach(async () => {
    toastsSubject = new BehaviorSubject<ToastConfig[]>([]);
    const toastServiceSpyObj = jasmine.createSpyObj('ToastService', ['remove'], {
      toasts$: toastsSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [
        { provide: ToastService, useValue: toastServiceSpyObj }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have correct styles for success type', () => {
      expect(component['styles'].success).toBeDefined();
      expect(component['styles'].success.class).toBe('alert-success');
    });

    it('should have correct styles for error type', () => {
      expect(component['styles'].error).toBeDefined();
      expect(component['styles'].error.class).toBe('alert-error');
    });

    it('should have correct styles for info type', () => {
      expect(component['styles'].info).toBeDefined();
      expect(component['styles'].info.class).toBe('alert-info');
    });

    it('should have correct styles for warning type', () => {
      expect(component['styles'].warning).toBeDefined();
      expect(component['styles'].warning.class).toBe('alert-warning');
    });
  });

  describe('when toasts are displayed', () => {
    it('should display toasts from service', (done) => {
      const mockToasts: ToastConfig[] = [
        { id: 1, message: 'Success', type: 'success' },
        { id: 2, message: 'Error', type: 'error' }
      ];

      toastsSubject.next(mockToasts);
      fixture.detectChanges();

      component['toastService'].toasts$.subscribe(toasts => {
        expect(toasts.length).toBe(2);
        done();
      });
    });
  });
});
