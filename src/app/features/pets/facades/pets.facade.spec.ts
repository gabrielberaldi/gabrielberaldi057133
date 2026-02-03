import { TestBed } from '@angular/core/testing';
import { PetsFacade } from './pets.facade';
import { PetsService } from '../services/pets.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/components/toast/services/toast.service';
import { of, throwError, take } from 'rxjs';
import { Pet } from '../models/pet.model';
import { PetRequest } from '../models/pet-request.model';
import { PetList } from '../models/pet-list.model';
import { Attachment } from '../../../shared/model/attachment.model';

describe('PetsFacade', () => {
  let facade: PetsFacade;
  let petsServiceSpy: jasmine.SpyObj<PetsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const MOCK_PET: Pet = { 
    id: 1, 
    nome: 'Rex', 
    raca: 'Golden Retriever', 
    idade: 5, 
    foto: null 
  };

  const MOCK_PET_LIST: PetList = { 
    content: [MOCK_PET], 
    total: 1, 
    page: 0, 
    size: 10, 
    pageCount: 1 
  };

  const MOCK_ATTACHMENT: Attachment = { 
    id: 50, 
    url: 'path/to/img', 
    contentType: 'image/png', 
    name: 'photo.png' 
  };

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('PetsService', [
      'getAll', 'getById', 'create', 'update', 'delete', 
      'uploadAttachment', 'removeAttachment'
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        PetsFacade,
        { provide: PetsService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    facade = TestBed.inject(PetsFacade);
    petsServiceSpy = TestBed.inject(PetsService) as jasmine.SpyObj<PetsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  describe('when facade is initialized', () => {
    it('should be created', () => {
      expect(facade).toBeTruthy();
    });
  });

  describe('clearPet', () => {
    it('should set pet$ to undefined', (done) => {
      facade.clearPet();
      facade.pet$.subscribe(val => {
        expect(val).toBeUndefined();
        done();
      });
    });
  });

  describe('loadPet', () => {
    it('should call service getById and update pet state', () => {
      const petId = 1;
      petsServiceSpy.getById.and.returnValue(of(MOCK_PET));

      facade.loadPet(petId).subscribe();

      expect(petsServiceSpy.getById).toHaveBeenCalledWith(petId);
      expect(facade.currentPetSnapshot).toEqual(MOCK_PET);
    });

    it('should set loading to true during request and false after', (done) => {
      const petId = 1;
      petsServiceSpy.getById.and.returnValue(of(MOCK_PET));

      facade.loadPet(petId).subscribe(() => {
        setTimeout(() => {
          facade.loading$.pipe(take(1)).subscribe(loading => {
            expect(loading).toBe(false);
            done();
          });
        }, 0);
      });
    });
  });

  describe('deletePet', () => {
    it('should call service delete, show toast and navigate to list', () => {
      const petId = 1;
      petsServiceSpy.delete.and.returnValue(of(void 0));

      facade.deletePet(petId).subscribe();

      expect(petsServiceSpy.delete).toHaveBeenCalledWith(petId);
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Pet excluido com sucesso', type: 'success' })
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/shell/pets/list']);
    });
  });

  describe('uploadAttachment', () => {
    it('should call service, update pet state with photo and show toast', () => {
      const petId = 1;
      const file = new File([''], 'photo.png', { type: 'image/png' });
      (facade as any)._pet$.next(MOCK_PET);
      petsServiceSpy.uploadAttachment.and.returnValue(of(MOCK_ATTACHMENT));

      facade.uploadAttachment(petId, file).subscribe();

      expect(petsServiceSpy.uploadAttachment).toHaveBeenCalledWith(petId, file);
      expect(facade.currentPetSnapshot?.foto).toEqual(MOCK_ATTACHMENT);
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Upload de foto feito com sucesso', type: 'success' })
      );
    });

    it('should set loading to true during upload and false after', (done) => {
      const petId = 1;
      const file = new File([''], 'photo.png', { type: 'image/png' });
      petsServiceSpy.uploadAttachment.and.returnValue(of(MOCK_ATTACHMENT));

      facade.uploadAttachment(petId, file).subscribe(() => {
        setTimeout(() => {
          facade.loading$.pipe(take(1)).subscribe(loading => {
            expect(loading).toBe(false);
            done();
          });
        }, 0);
      });
    });
  });

  describe('removeAttachment', () => {
    it('should call service, update pet state to remove photo and show toast', () => {
      const petId = 1;
      const photoId = 99;
      const petWithPhoto: Pet = { ...MOCK_PET, foto: MOCK_ATTACHMENT };
      (facade as any)._pet$.next(petWithPhoto);
      petsServiceSpy.removeAttachment.and.returnValue(of(void 0));

      facade.removeAttachment(petId, photoId).subscribe();

      expect(petsServiceSpy.removeAttachment).toHaveBeenCalledWith(petId, photoId);
      expect(facade.currentPetSnapshot?.foto).toBeNull();
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Foto removida com sucesso', type: 'success' })
      );
    });
  });

  describe('changePage', () => {
    it('should update filters and trigger list refresh', (done) => {
      petsServiceSpy.getAll.and.returnValue(of(MOCK_PET_LIST));

      facade.changePage(2);

      facade.petsList$.subscribe((res) => {
        expect(petsServiceSpy.getAll).toHaveBeenCalledWith(jasmine.objectContaining({ page: 2 }));
        expect(res).toEqual(MOCK_PET_LIST);
        done();
      });
    });
  });

  describe('search', () => {
    it('should reset page to 0 and update name filter', (done) => {
      petsServiceSpy.getAll.and.returnValue(of(MOCK_PET_LIST));

      facade.search('Rex');

      facade.petsList$.subscribe(() => {
        expect(petsServiceSpy.getAll).toHaveBeenCalledWith(jasmine.objectContaining({ 
          nome: 'Rex', 
          page: 0 
        }));
        done();
      });
    });
  });

  describe('store', () => {
    it('should call create when pet has no id and navigate to edit', () => {
      const request: PetRequest = { nome: 'Buddy', raca: 'Labrador', idade: 3 };
      const saved: Pet = { ...MOCK_PET, id: 99 };
      petsServiceSpy.create.and.returnValue(of(saved));

      facade.store(request, null).subscribe();

      expect(petsServiceSpy.create).toHaveBeenCalledWith(request);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/shell/pets/edit/99'], { replaceUrl: true });
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Pet cadastrado com sucesso', type: 'success' })
      );
    });

    it('should call update when pet has id', () => {
      const request: PetRequest = { id: 1, nome: 'Rex Updated', raca: 'Golden Retriever', idade: 6 };
      petsServiceSpy.update.and.returnValue(of(MOCK_PET));

      facade.store(request, null).subscribe();

      expect(petsServiceSpy.update).toHaveBeenCalledWith(request);
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Pet atualizado com sucesso', type: 'success' })
      );
    });

    it('should upload photo if pendingPhoto is provided', () => {
      const file = new File([], 'photo.png');
      const request: PetRequest = { id: 1, nome: 'Rex', raca: 'Golden Retriever', idade: 5 };
      petsServiceSpy.update.and.returnValue(of(MOCK_PET));
      petsServiceSpy.uploadAttachment.and.returnValue(of(MOCK_ATTACHMENT));

      facade.store(request, file).subscribe();

      expect(petsServiceSpy.uploadAttachment).toHaveBeenCalledWith(1, file);
      expect(toastServiceSpy.show).toHaveBeenCalled();
    });

    it('should handle upload error gracefully and still save pet', () => {
      const file = new File([], 'photo.png');
      const request: PetRequest = { id: 1, nome: 'Rex', raca: 'Golden Retriever', idade: 5 };
      petsServiceSpy.update.and.returnValue(of(MOCK_PET));
      petsServiceSpy.uploadAttachment.and.returnValue(throwError(() => new Error('Upload failed')));

      facade.store(request, file).subscribe();

      expect(petsServiceSpy.uploadAttachment).toHaveBeenCalled();
      expect(toastServiceSpy.show).toHaveBeenCalled();
    });
  });
});
