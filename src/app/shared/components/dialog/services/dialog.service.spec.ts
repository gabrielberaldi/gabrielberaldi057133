import { TestBed } from '@angular/core/testing';
import { take, skip } from 'rxjs';
import { DialogService } from './dialog.service';
import { DialogData } from '../models/dialog-data.model';

describe('DialogService', () => {
  let service: DialogService;

  const MOCK_DIALOG_DATA: DialogData = {
    title: 'Confirm Action',
    message: 'Are you sure?',
    cancelText: 'Cancel',
    confirmText: 'Confirm'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogService);
  });

  describe('when service is initialized', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have data$ as null initially', (done) => {
      service.data$.subscribe(data => {
        expect(data).toBeNull();
        done();
      });
    });
  });

  describe('open', () => {
    it('should set dialog data and return observable', (done) => {
      const result$ = service.open(MOCK_DIALOG_DATA);

      service.data$.subscribe(data => {
        expect(data).toEqual(MOCK_DIALOG_DATA);
        done();
      });
      expect(result$).toBeDefined();
    });

    it('should use default cancelText and confirmText when not provided', (done) => {
      const dialogData = { title: 'Test', message: 'Test message' };

      service.open(dialogData);

      service.data$.subscribe(data => {
        expect(data?.cancelText).toBe('Cancelar');
        expect(data?.confirmText).toBe('Confirmar');
        done();
      });
    });

    it('should close any existing dialog before opening new one', (done) => {
      service.open(MOCK_DIALOG_DATA);
      const newDialogData: DialogData = { ...MOCK_DIALOG_DATA, title: 'New Dialog' };

      service.open(newDialogData);

      service.data$.subscribe(data => {
        expect(data?.title).toBe('New Dialog');
        done();
      });
    });

    it('should return observable that emits when dialog is closed', (done) => {
      const result$ = service.open(MOCK_DIALOG_DATA);

      result$.subscribe(result => {
        expect(result).toBe(true);
        done();
      });
      service.close(true);
    });
  });

  describe('close', () => {
    it('should close dialog and emit result to observable', (done) => {
      const result$ = service.open(MOCK_DIALOG_DATA);

      result$.pipe(take(1)).subscribe(result => {
        expect(result).toBe(true);
        service.data$.pipe(skip(1), take(1)).subscribe(data => {
          expect(data).toBeNull();
          done();
        });
      });

      service.close(true);
    });

    it('should not emit if no dialog is open', () => {
      service.close(false);

      service.data$.subscribe(data => {
        expect(data).toBeNull();
      });
    });

    it('should emit false when dialog is cancelled', (done) => {
      const result$ = service.open(MOCK_DIALOG_DATA);

      result$.pipe(take(1)).subscribe(result => {
        expect(result).toBe(false);
        done();
      });

      service.close(false);
    });
  });
});
