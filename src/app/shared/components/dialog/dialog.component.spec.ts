import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { DialogService } from './services/dialog.service';
import { BehaviorSubject } from 'rxjs';
import { DialogData } from './models/dialog-data.model';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let dataSubject: BehaviorSubject<DialogData | null>;

  const MOCK_DIALOG_DATA: DialogData = {
    title: 'Test Title',
    message: 'Test Message',
    cancelText: 'Cancel',
    confirmText: 'Confirm'
  };

  beforeEach(async () => {
    dataSubject = new BehaviorSubject<DialogData | null>(null);
    const dialogServiceSpyObj = jasmine.createSpyObj('DialogService', ['close'], {
      data$: dataSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      providers: [
        { provide: DialogService, useValue: dialogServiceSpyObj }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    dialogServiceSpy = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have TriangleAlert icon available', () => {
      expect(component['TriangleAlert']).toBeDefined();
    });

    it('should have Info icon available', () => {
   
      expect(component['Info']).toBeDefined();
    });
  });

  describe('onAction', () => {
    it('should call dialogService.close with true when confirmed', () => {
      component['onAction'](true);
      expect(dialogServiceSpy.close).toHaveBeenCalledWith(true);
    });

    it('should call dialogService.close with false when cancelled', () => {
      component['onAction'](false);

      expect(dialogServiceSpy.close).toHaveBeenCalledWith(false);
    });
  });

  describe('when dialog data is available', () => {
    it('should display dialog when data is set', (done) => {
    
      dataSubject.next(MOCK_DIALOG_DATA);
      fixture.detectChanges();

      component['dialogService'].data$.subscribe(data => {
        expect(data).toEqual(MOCK_DIALOG_DATA);
        done();
      });
    });
  });
});
