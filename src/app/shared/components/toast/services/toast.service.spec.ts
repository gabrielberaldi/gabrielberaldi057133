import { TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  describe('when service is initialized', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty toasts array initially', (done) => {
      service.toasts$.subscribe(toasts => {
        expect(toasts).toEqual([]);
        done();
      });
    });
  });

  describe('show', () => {
    it('should add toast to toasts array with generated id', (done) => {
      const toastConfig = { message: 'Test message', type: 'success' as const };

      service.show(toastConfig);

      service.toasts$.subscribe(toasts => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].message).toBe('Test message');
        expect(toasts[0].type).toBe('success');
        expect(toasts[0].id).toBeDefined();
        expect(toasts[0].expirationTimer).toBe(5000);
        done();
      });
    });

    it('should use custom expirationTimer when provided', (done) => {
      const toastConfig = { message: 'Test', type: 'error' as const, expirationTimer: 3000 };

      service.show(toastConfig);

      service.toasts$.subscribe(toasts => {
        expect(toasts[0].expirationTimer).toBe(3000);
        done();
      });
    });

    it('should automatically remove toast after expirationTimer', fakeAsync(() => {
      const toastConfig = { message: 'Test', type: 'info' as const, expirationTimer: 1000 };

      service.show(toastConfig);
      tick(1000);

      service.toasts$.subscribe(toasts => {
        expect(toasts.length).toBe(0);
      });
    }));
  });

  describe('remove', () => {
    it('should not remove toast if id does not match', (done) => {
      service.show({ message: 'Toast 1', type: 'success' });
      const nonExistentId = 99999;

      service.remove(nonExistentId);

      service.toasts$.subscribe(toasts => {
        expect(toasts.length).toBe(1);
        done();
      });
    });
  });
});
