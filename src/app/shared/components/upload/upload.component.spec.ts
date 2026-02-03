import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadComponent } from './upload.component';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.currentPhotoUrl).toBeNull();
      expect(component.disabled).toBe(false);
      expect(component.isUploading).toBe(false);
    });

    it('should have icons available', () => {
      expect(component['CircleAlert']).toBeDefined();
      expect(component['CircleX']).toBeDefined();
      expect(component['Image']).toBeDefined();
      expect(component['Lock']).toBeDefined();
      expect(component['Upload']).toBeDefined();
      expect(component['Trash2']).toBeDefined();
    });
  });

  describe('onFileSelected', () => {
    it('should not process file when disabled', () => {
      component.disabled = true;
      spyOn(component.fileChange, 'emit');
      const mockEvent = {
        target: {
          files: [new File([''], 'test.jpg', { type: 'image/jpeg' })],
          value: ''
        }
      } as any;

      component['onFileSelected'](mockEvent);

      expect(component.fileChange.emit).not.toHaveBeenCalled();
    });

    it('should emit fileChange when valid file is selected', (done) => {
      component.disabled = false;
      spyOn(component.fileChange, 'emit');
      const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const mockEvent = {
        target: {
          files: [validFile],
          value: ''
        }
      } as any;

      component['onFileSelected'](mockEvent);

      setTimeout(() => {
        expect(component.fileChange.emit).toHaveBeenCalledWith(validFile);
        done();
      }, 100);
    });

    it('should set error message for invalid file type', () => {
      component.disabled = false;
      spyOn(component.fileChange, 'emit');
      const invalidFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      const mockEvent = {
        target: {
          files: [invalidFile],
          value: ''
        }
      } as any;

      component['onFileSelected'](mockEvent);

      expect(component['errorMessage']).toBe('Formato inválido. Apenas PNG ou JPG.');
      expect(component.fileChange.emit).not.toHaveBeenCalled();
    });

    it('should set error message for file too large', () => {
      component.disabled = false;
      spyOn(component.fileChange, 'emit');
      const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      const mockEvent = {
        target: {
          files: [largeFile],
          value: ''
        }
      } as any;

      component['onFileSelected'](mockEvent);

      expect(component['errorMessage']).toBe('Arquivo muito grande (Máx 10MB).');
      expect(component.fileChange.emit).not.toHaveBeenCalled();
    });

    it('should not process when no files selected', () => {
      component.disabled = false;
      spyOn(component.fileChange, 'emit');
      const mockEvent = {
        target: {
          files: null,
          value: ''
        }
      } as any;

      component['onFileSelected'](mockEvent);

      expect(component.fileChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('onRemove', () => {
    it('should emit removeRequest and reset state', () => {
      component['previewUrl'] = 'test-url';
      component['errorMessage'] = 'test error';
      spyOn(component.removeRequest, 'emit');
      const mockEvent = {
        stopPropagation: jasmine.createSpy('stopPropagation')
      } as any;

      component['onRemove'](mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(component.removeRequest.emit).toHaveBeenCalled();
      expect(component['previewUrl']).toBeNull();
      expect(component['errorMessage']).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      component['errorMessage'] = 'test error';

      component['clearError']();

      expect(component['errorMessage']).toBeNull();
    });
  });
});
