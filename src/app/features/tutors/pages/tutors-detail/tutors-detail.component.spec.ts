import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { TutorsDetailComponent } from './tutors-detail.component';
import { TutorsFacade } from '../../facades/tutors.facade';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { Tutor } from '../../models/tutor.model';

describe('TutorsDetailComponent', () => {
  let component: TutorsDetailComponent;
  let fixture: ComponentFixture<TutorsDetailComponent>;
  let tutorsFacadeSpy: jasmine.SpyObj<TutorsFacade>;
  let shellFacadeSpy: jasmine.SpyObj<ShellFacade>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;
  const paramMapSubject = new BehaviorSubject(new Map());

  const MOCK_TUTOR: Tutor = {
    id: 1,
    nome: 'João Silva',
    telefone: '11999999999',
    endereco: 'Rua das Flores, 123',
    foto: null
  };

  beforeEach(async () => {
    tutorsFacadeSpy = jasmine.createSpyObj('TutorsFacade', ['loadTutor', 'clearTutor'], {
      tutor$: of(MOCK_TUTOR)
    });
    tutorsFacadeSpy.loadTutor.and.returnValue(of(MOCK_TUTOR));

    shellFacadeSpy = jasmine.createSpyObj('ShellFacade', ['setBreadCrumbs']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    const initialParams = new Map();
    initialParams.set('id', '1');
    paramMapSubject.next(initialParams);

    await TestBed.configureTestingModule({
      imports: [TutorsDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TutorsFacade, useValue: tutorsFacadeSpy },
        { provide: ShellFacade, useValue: shellFacadeSpy },
        { provide: Router, useValue: routerSpy },
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

    fixture = TestBed.createComponent(TutorsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set id from route snapshot', () => {
      expect(component['id']).toBe(1);
    });

    it('should load tutor when ID is present in route', () => {
      expect(tutorsFacadeSpy.loadTutor).toHaveBeenCalledWith(1);
    });

    it('should set breadcrumbs when tutor is loaded', () => {
      expect(shellFacadeSpy.setBreadCrumbs).toHaveBeenCalled();
    });
  });

  describe('onBack', () => {
    it('should call location.back', () => {
      component['onBack']();
      expect(locationSpy.back).toHaveBeenCalled();
    });
  });

  describe('onEdit', () => {
    it('should navigate to edit route', () => {
      component['id'] = 1;
      component['onEdit']();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/shell/tutors/edit/1');
    });
  });

  describe('onItemClick', () => {
    it('should navigate to pet details route', () => {
      const petId = 123;
      component['onItemClick'](petId);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(`/shell/pets/details/${petId}`);
    });
  });

  describe('when component is destroyed', () => {
    it('should clear tutor', () => {
      fixture.destroy();
      expect(tutorsFacadeSpy.clearTutor).toHaveBeenCalled();
    });
  });
});
