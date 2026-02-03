import { TestBed } from '@angular/core/testing';

import { TutorsFacade } from './tutors.facade';
import { TutorsService } from '../services/tutors.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/components/toast/services/toast.service';
import { of, take } from 'rxjs';
import { Tutor } from '../models/tutor.model';
import { TutorRequest } from '../models/tutor-request.model';
import { TutorList } from '../models/tutor-list.model';
import { Attachment } from '../../../shared/model/attachment.model';
import { Pet } from '../../pets/models/pet.model';

describe('TutorsFacade', () => {
  let facade: TutorsFacade;
  
  let tutorServiceSpy: jasmine.SpyObj<TutorsService>;
  let routerServiceSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const MOCK_TUTOR: Tutor = { 
    id: 1, 
    nome: 'Carlos', 
    telefone: '6599999999', 
    endereco: 'Rua teste',
    foto: null,
    pets: []
  };

  const MOCK_TUTOR_LIST: TutorList = { 
    content: [MOCK_TUTOR], 
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

  const PET_LIST: Pet[] = [
    { id: 1, nome: 'Rex', idade: 10, raca: 'Vira lata', foto: null }
  ]

 beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('TutorsService', [
      'getAll', 'getById', 'create', 'update', 'delete', 
      'linkPet', 'unlinkPet', 'uploadAttachment', 'removeAttachment'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        TutorsFacade,
        { provide: TutorsService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    facade = TestBed.inject(TutorsFacade);
    tutorServiceSpy = TestBed.inject(TutorsService) as jasmine.SpyObj<TutorsService>;
    routerServiceSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  describe('when facade is initialized', () => {
    it('should be created', () => {
      expect(facade).toBeTruthy();
    });
  });

  describe('clearTutor', () => {
    it('should set tutor$ to undefined', (done) => {
      facade.clearTutor();
      facade.tutor$.subscribe(val => {
        expect(val).toBeUndefined();
        done();
      });
    });
  });

  describe('loadTutor', () => {
    it('should call service getById and update tutor state', () => {
      const tutorId = 1;
      tutorServiceSpy.getById.and.returnValue(of(MOCK_TUTOR));
      facade.loadTutor(tutorId).subscribe();
      expect(tutorServiceSpy.getById).toHaveBeenCalledWith(tutorId);
      expect(facade.currentTutorSnapshot).toEqual(MOCK_TUTOR);
    });

    it('should set loading to true during request and false after', (done) => {
      const tutorId = 1;
      tutorServiceSpy.getById.and.returnValue(of(MOCK_TUTOR));

      facade.loadTutor(tutorId).subscribe(() => {
        setTimeout(() => {
          facade.loading$.pipe(take(1)).subscribe(loading => {
            expect(loading).toBe(false);
            done();
          });
        }, 0);
      });
    });
  });

  describe('deleteTutor', () => {
    it('should call service delete, show toast and navigate to list', () => {
      const tutorId = 1;
      tutorServiceSpy.delete.and.returnValue(of(void 0));

      facade.deleteTutor(tutorId).subscribe();

      expect(tutorServiceSpy.delete).toHaveBeenCalledWith(tutorId);
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Tutor excluido com sucesso', type: 'success' })
      );
      expect(routerServiceSpy.navigate).toHaveBeenCalledWith(['/shell/tutors/list']);
    });
  });

  describe('unlinkPet', () => {
    it('should filter pet from current state locally', () => {
      const tutorWithPets: Tutor = { ...MOCK_TUTOR, pets: PET_LIST };
      (facade as any)._tutor$.next(tutorWithPets);
      tutorServiceSpy.unlinkPet.and.returnValue(of(void 0));

      facade.unlinkPet(1, 10).subscribe();

      expect(tutorServiceSpy.unlinkPet).toHaveBeenCalledWith(1, 10);
      expect(facade.currentTutorSnapshot?.pets?.length).toBe(1);
      expect(facade.currentTutorSnapshot?.pets?.[0].id).toBe(1);
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Pet desvinculado com sucesso', type: 'success' })
      );
    });

    it('should set loading to true during request and false after', (done) => {
      tutorServiceSpy.unlinkPet.and.returnValue(of(void 0));

      facade.unlinkPet(1, 10).subscribe(() => {
        setTimeout(() => {
          facade.loading$.pipe(take(1)).subscribe(loading => {
            expect(loading).toBe(false);
            done();
          });
        }, 0);
      });
    });
  });

  describe('linkPet', () => {
    it('should call service, reload tutor and update state', () => {
      const tutorId = 1;
      const petId = 99;
      tutorServiceSpy.linkPet.and.returnValue(of(void 0));
      tutorServiceSpy.getById.and.returnValue(of(MOCK_TUTOR));

      facade.linkPet(tutorId, petId).subscribe();

      expect(tutorServiceSpy.linkPet).toHaveBeenCalledWith(tutorId, petId);
      expect(tutorServiceSpy.getById).toHaveBeenCalledWith(tutorId);
      expect(facade.currentTutorSnapshot).toEqual(MOCK_TUTOR);
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Pet vinculado com sucesso', type: 'success' })
      );
    });
  });

  describe('store', () => {
    it('should call create when tutor has no id and navigate to edit', () => {
      const request: TutorRequest = { nome: 'Novo', endereco: 'Rua teste', telefone: '6599999999' };
      const saved: Tutor = { ...MOCK_TUTOR, id: 99 };
      tutorServiceSpy.create.and.returnValue(of(saved));

      facade.store(request, null).subscribe();

      expect(tutorServiceSpy.create).toHaveBeenCalledWith(request);
      expect(routerServiceSpy.navigate).toHaveBeenCalledWith(['/shell/tutors/edit/99'], { replaceUrl: true });
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Tutor cadastrado com sucesso', type: 'success' })
      );
    });

    it('should call update when tutor has id', () => {
      const request: TutorRequest = { id: 1, nome: 'Atualizado', endereco: 'Rua teste', telefone: '6599999999' };
      tutorServiceSpy.update.and.returnValue(of(MOCK_TUTOR));

      facade.store(request, null).subscribe();
      expect(tutorServiceSpy.update).toHaveBeenCalledWith(request);
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Tutor atualizado com sucesso', type: 'success' })
      );
    });

    it('should upload photo if pendingPhoto is provided', () => {
      const file = new File([], 'photo.png');
      const request: TutorRequest = { id: 1, nome: 'Tutor', endereco: 'Rua teste', telefone: '6599999999' };
      tutorServiceSpy.update.and.returnValue(of(MOCK_TUTOR));
      tutorServiceSpy.uploadAttachment.and.returnValue(of(MOCK_ATTACHMENT));

      facade.store(request, file).subscribe();

      expect(tutorServiceSpy.uploadAttachment).toHaveBeenCalledWith(1, file);
      expect(toastServiceSpy.show).toHaveBeenCalled();
    });
  });

  describe('changePage', () => {
    it('should update filters and trigger list refresh', (done) => {
      tutorServiceSpy.getAll.and.returnValue(of(MOCK_TUTOR_LIST));

      facade.changePage(2);

      facade.tutorsList$.subscribe((res) => {
        expect(tutorServiceSpy.getAll).toHaveBeenCalledWith(jasmine.objectContaining({ page: 2 }));
        expect(res).toEqual(MOCK_TUTOR_LIST);
        done();
      });
    });
  });

  describe('search', () => {
    it('should reset page to 0 and update name filter', (done) => {
      tutorServiceSpy.getAll.and.returnValue(of(MOCK_TUTOR_LIST));

      facade.search('Laura');

      facade.tutorsList$.subscribe(() => {
        expect(tutorServiceSpy.getAll).toHaveBeenCalledWith(jasmine.objectContaining({ 
          nome: 'Laura', 
          page: 0 
        }));
        done();
      });
    });
  });

  describe('uploadAttachment', () => {
    it('should call service, update tutor state with photo and show toast', () => {
      const tutorId = 1;
      const file = new File([''], 'photo.png', { type: 'image/png' });
      (facade as any)._tutor$.next(MOCK_TUTOR);
      tutorServiceSpy.uploadAttachment.and.returnValue(of(MOCK_ATTACHMENT));

      facade.uploadAttachment(tutorId, file).subscribe();

      expect(tutorServiceSpy.uploadAttachment).toHaveBeenCalledWith(tutorId, file);
      expect(facade.currentTutorSnapshot?.foto).toEqual(MOCK_ATTACHMENT);
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Upload de foto feito com sucesso', type: 'success' })
      );
    });
  });

  describe('removeAttachment', () => {
    it('should call service, update tutor state to remove photo and show toast', () => {
      const tutorId = 1;
      const photoId = 99;
      const tutorWithPhoto: Tutor = { ...MOCK_TUTOR, foto: MOCK_ATTACHMENT };
      (facade as any)._tutor$.next(tutorWithPhoto);
      tutorServiceSpy.removeAttachment.and.returnValue(of(void 0));

      facade.removeAttachment(tutorId, photoId).subscribe();

      expect(tutorServiceSpy.removeAttachment).toHaveBeenCalledWith(tutorId, photoId);
      expect(facade.currentTutorSnapshot?.foto).toBeNull();
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        jasmine.objectContaining({ message: 'Foto removida com sucesso', type: 'success' })
      );
    });
  });

});
