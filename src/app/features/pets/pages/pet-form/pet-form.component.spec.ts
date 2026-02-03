import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PetFormComponent } from './pet-form.component';
import { PetsFacade } from '../../facades/pets.facade';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { DialogService } from '../../../../shared/components/dialog/services/dialog.service';
import { Pet } from '../../models/pet.model';
import { Attachment } from '../../../../shared/model/attachment.model';

describe('PetFormComponent', () => {
  let component: PetFormComponent;
  let fixture: ComponentFixture<PetFormComponent>;
  let petsFacadeSpy: jasmine.SpyObj<PetsFacade>;
  let shellFacadeSpy: jasmine.SpyObj<ShellFacade>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let locationSpy: jasmine.SpyObj<Location>;
  const paramMapSubject = new BehaviorSubject(new Map());
  const petSubject = new BehaviorSubject<Pet | null>(null);

  const MOCK_PET: Pet = {
    id: 1,
    nome: 'Rex',
    raca: 'Golden Retriever',
    idade: 5,
    foto: null
  };

  const MOCK_ATTACHMENT: Attachment = {
    id: 1,
    url: 'http://example.com/photo.jpg',
    name: 'photo.jpg',
    contentType: 'image/jpeg'
  };

  const MOCK_FILE = new File([''], 'photo.jpg', { type: 'image/jpeg' });

  beforeEach(async () => {
    petsFacadeSpy = jasmine.createSpyObj('PetsFacade',
      ['loadPet', 'clearPet', 'store', 'deletePet', 'uploadAttachment', 'removeAttachment'],
      {
        pet$: petSubject.asObservable(),
        currentPetSnapshot: null
      }
    );
    petsFacadeSpy.loadPet.and.returnValue(of(MOCK_PET));
    petsFacadeSpy.store.and.returnValue(of(MOCK_PET));
    petsFacadeSpy.deletePet.and.returnValue(of(void 0));
    petsFacadeSpy.uploadAttachment.and.returnValue(of(MOCK_ATTACHMENT));
    petsFacadeSpy.removeAttachment.and.returnValue(of(void 0));

    shellFacadeSpy = jasmine.createSpyObj('ShellFacade', ['setBreadCrumbs']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    dialogServiceSpy.open.and.returnValue(of(false));

    const initialParams = new Map();
    paramMapSubject.next(initialParams);

    await TestBed.configureTestingModule({
      imports: [PetFormComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PetsFacade, useValue: petsFacadeSpy },
        { provide: ShellFacade, useValue: shellFacadeSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: Location, useValue: locationSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable(),
            snapshot: { paramMap: { get: (key: string) => paramMapSubject.value.get(key) } }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('when route has pet ID', () => {
    it('should load pet data when ID is present in route', () => {
      const params = new Map();
      params.set('id', '1');
      paramMapSubject.next(params);
      fixture.detectChanges();
      expect(petsFacadeSpy.loadPet).toHaveBeenCalledWith(1);
      petSubject.next(MOCK_PET);
      fixture.detectChanges();
      expect(component['petForm'].getRawValue()).toEqual(jasmine.objectContaining({
        id: MOCK_PET.id,
        nome: MOCK_PET.nome,
        raca: MOCK_PET.raca,
        idade: MOCK_PET.idade
      }));
    });
  });

  describe('when route has no pet ID', () => {
    it('should clear pet and set breadcrumbs', () => {
      const params = new Map();
      paramMapSubject.next(params);
      fixture.detectChanges();
      expect(petsFacadeSpy.clearPet).toHaveBeenCalled();
      expect(shellFacadeSpy.setBreadCrumbs).toHaveBeenCalled();
    });
  });

  describe('onSave', () => {
    it('should not call store if form is invalid', () => {
      component['petForm'].patchValue({ nome: '' });
      component['onSave']();
      expect(petsFacadeSpy.store).not.toHaveBeenCalled();
    });

    it('should call store with form data and pending photo', () => {
      component['petForm'].patchValue(MOCK_PET);
      component['pendingPhoto'] = null;
      component['onSave']();
      expect(petsFacadeSpy.store).toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should not call deletePet when dialog is cancelled', () => {
      component['petId'] = 1;
      component['petForm'].patchValue({ nome: 'Rex' });
      dialogServiceSpy.open.and.returnValue(of(false));
      component['onDelete']();
      expect(petsFacadeSpy.deletePet).not.toHaveBeenCalled();
    });

    it('should call deletePet when dialog is confirmed', () => {
      component['petId'] = 1;
      component['petForm'].patchValue({ nome: 'Rex' });
      dialogServiceSpy.open.and.returnValue(of(true));
      component['onDelete']();
      expect(petsFacadeSpy.deletePet).toHaveBeenCalledWith(1);
    });
  });

  describe('onFileChange', () => {
    it('should set pendingPhoto if no petId exists', () => {
      component['petId'] = 0;
      component['onFileChange'](MOCK_FILE);
      expect(component['pendingPhoto']).toBe(MOCK_FILE);
      expect(petsFacadeSpy.uploadAttachment).not.toHaveBeenCalled();
    });

    it('should upload photo immediately if petId exists', () => {
      component['petId'] = 1;
      component['onFileChange'](MOCK_FILE);
      expect(petsFacadeSpy.uploadAttachment).toHaveBeenCalledWith(1, MOCK_FILE);
    });
  });

  describe('onRemoveRequest', () => {
    it('should set pendingPhoto to null if no petId exists', () => {
      component['petId'] = 0;
      component['pendingPhoto'] = MOCK_FILE;
      component['onRemoveRequest']();
      expect(component['pendingPhoto']).toBeNull();
    });

    it('should not call removeAttachment if no petId or photoId', () => {
      component['petId'] = 0;
      component['onRemoveRequest']();
      expect(petsFacadeSpy.removeAttachment).not.toHaveBeenCalled();
    });

    it('should not call removeAttachment when dialog is cancelled', () => {
      component['petId'] = 1;
      (petsFacadeSpy as any).currentPetSnapshot = { ...MOCK_PET, foto: MOCK_ATTACHMENT };
      dialogServiceSpy.open.and.returnValue(of(false));
      component['onRemoveRequest']();
      expect(petsFacadeSpy.removeAttachment).not.toHaveBeenCalled();
    });
  });

  describe('onBack', () => {
    it('should call location.back', () => {
      component['onBack']();
      expect(locationSpy.back).toHaveBeenCalled();
    });
  });
});
