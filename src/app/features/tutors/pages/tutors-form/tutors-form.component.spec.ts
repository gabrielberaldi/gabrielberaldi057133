import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TutorsFormComponent } from './tutors-form.component';
import { TutorsFacade } from '../../facades/tutors.facade';
import { PetsFacade } from '../../../pets/facades/pets.facade';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { DialogService } from '../../../../shared/components/dialog/services/dialog.service';
import { BehaviorSubject, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Tutor } from '../../models/tutor.model';

describe('TutorsFormComponent', () => {
  let component: TutorsFormComponent;
  let fixture: ComponentFixture<TutorsFormComponent>;

  let tutorsFacadeSpy: jasmine.SpyObj<TutorsFacade>;
  let petsFacadeSpy: jasmine.SpyObj<PetsFacade>;
  let shellFacadeSpy: jasmine.SpyObj<ShellFacade>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let locationSpy: jasmine.SpyObj<Location>;

  const tutorSubject = new BehaviorSubject<any>(null);
  const paramMapSubject = new BehaviorSubject(new Map());

  const MOCK_TUTOR: Tutor = {
    id: 1,
    nome: 'João Silva',
    telefone: '11999999999',
    endereco: 'Rua das Flores, 123',
    foto: null
  };

  const MOCK_FILE = new File([''], 'photo.jpg', { type: 'image/jpeg' });

  beforeEach(async () => {
    tutorsFacadeSpy = jasmine.createSpyObj('TutorsFacade', 
      ['loadTutor', 'clearTutor', 'store', 'deleteTutor', 'uploadAttachment', 'removeAttachment', 'linkPet', 'unlinkPet'],
      { 
        tutor$: tutorSubject.asObservable(),
        currentTutorSnapshot: null 
      }
    );
    tutorsFacadeSpy.loadTutor.and.returnValue(of(MOCK_TUTOR));
    tutorsFacadeSpy.store.and.returnValue(of(MOCK_TUTOR));
    tutorsFacadeSpy.deleteTutor.and.returnValue(of(void 0));
    tutorsFacadeSpy.uploadAttachment.and.returnValue(of());
    tutorsFacadeSpy.removeAttachment.and.returnValue(of(void 0));
    tutorsFacadeSpy.linkPet.and.returnValue(of(MOCK_TUTOR));
    tutorsFacadeSpy.unlinkPet.and.returnValue(of(void 0));

    petsFacadeSpy = jasmine.createSpyObj('PetsFacade', ['search']);
    shellFacadeSpy = jasmine.createSpyObj('ShellFacade', ['setBreadCrumbs']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    dialogServiceSpy.open.and.returnValue(of(false));

    const initialParams = new Map();
    paramMapSubject.next(initialParams);

    await TestBed.configureTestingModule({
      imports: [TutorsFormComponent, ReactiveFormsModule],
      providers: [
        { provide: TutorsFacade, useValue: tutorsFacadeSpy },
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
        },
      ]
    })
    .overrideComponent(TutorsFormComponent, {
      set: { 
        providers: [
          { provide: PetsFacade, useValue: petsFacadeSpy }
        ] 
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('when route has tutor ID', () => {
    it('should load tutor data when ID is present in route', () => {
      const params = new Map();
      params.set('id', '1');
      paramMapSubject.next(params);
      fixture.detectChanges();
      expect(tutorsFacadeSpy.loadTutor).toHaveBeenCalledWith(1);
      tutorSubject.next(MOCK_TUTOR);
      fixture.detectChanges();
      expect(component['tutorForm'].getRawValue()).toEqual(jasmine.objectContaining({
        id: MOCK_TUTOR.id,
        nome: MOCK_TUTOR.nome,
        telefone: MOCK_TUTOR.telefone,
        endereco: MOCK_TUTOR.endereco
      }));
    });
  });

  describe('onSave', () => {
    it('should not call store if form is invalid', () => {
      component['tutorForm'].patchValue({ nome: '' });
      component['onSave']();
      expect(tutorsFacadeSpy.store).not.toHaveBeenCalled();
    });

    it('should call store with form data and pending photo', () => {
      component['tutorForm'].patchValue(MOCK_TUTOR);
      component['pendingPhoto'] = null;
      component['onSave']();
      expect(tutorsFacadeSpy.store).toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should not call deleteTutor when dialog is cancelled', () => {
      component['tutorId'] = 1;
      component['tutorForm'].patchValue({ nome: 'João' });
      dialogServiceSpy.open.and.returnValue(of(false));
      component['onDelete']();
      expect(tutorsFacadeSpy.deleteTutor).not.toHaveBeenCalled();
    });

    it('should call deleteTutor when dialog is confirmed', () => {
      component['tutorId'] = 1;
      component['tutorForm'].patchValue({ nome: 'João' });
      dialogServiceSpy.open.and.returnValue(of(true));
      component['onDelete']();
      expect(tutorsFacadeSpy.deleteTutor).toHaveBeenCalledWith(1);
    });
  });

  describe('onFileChange', () => {
    it('should set pendingPhoto if no tutorId exists', () => {
      component['tutorId'] = 0;
      component['onFileChange'](MOCK_FILE);
      expect(component['pendingPhoto']).toBe(MOCK_FILE);
      expect(tutorsFacadeSpy.uploadAttachment).not.toHaveBeenCalled();
    });

    it('should upload photo immediately if tutorId exists', () => {
      component['tutorId'] = 1;
      component['onFileChange'](MOCK_FILE);
      expect(tutorsFacadeSpy.uploadAttachment).toHaveBeenCalledWith(1, MOCK_FILE);
    });
  });

  describe('openLinkModal', () => {
    it('should set isModalOpen to true', () => {
      component['openLinkModal']();
      expect(component['isModalOpen']).toBeTrue();
    });
  });

});

