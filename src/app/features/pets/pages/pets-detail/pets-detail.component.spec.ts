import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { PetsDetailComponent } from './pets-detail.component';
import { PetsFacade } from '../../facades/pets.facade';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { Pet } from '../../models/pet.model';

describe('PetsDetailComponent', () => {
  let component: PetsDetailComponent;
  let fixture: ComponentFixture<PetsDetailComponent>;
  let petsFacadeSpy: jasmine.SpyObj<PetsFacade>;
  let shellFacadeSpy: jasmine.SpyObj<ShellFacade>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;
  const paramMapSubject = new BehaviorSubject(new Map());

  const MOCK_PET: Pet = {
    id: 1,
    nome: 'Rex',
    raca: 'Golden Retriever',
    idade: 5,
    foto: null
  };

  beforeEach(async () => {
    petsFacadeSpy = jasmine.createSpyObj('PetsFacade', ['loadPet', 'clearPet'], {
      pet$: of(MOCK_PET)
    });
    petsFacadeSpy.loadPet.and.returnValue(of(MOCK_PET));

    shellFacadeSpy = jasmine.createSpyObj('ShellFacade', ['setBreadCrumbs']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    const initialParams = new Map();
    initialParams.set('id', '1');
    paramMapSubject.next(initialParams);

    await TestBed.configureTestingModule({
      imports: [PetsDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PetsFacade, useValue: petsFacadeSpy },
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

    fixture = TestBed.createComponent(PetsDetailComponent);
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

    it('should load pet when ID is present in route', () => {
      expect(petsFacadeSpy.loadPet).toHaveBeenCalledWith(1);
    });

    it('should set breadcrumbs when pet is loaded', () => {
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
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/shell/pets/edit/1');
    });
  });

  describe('onItemClick', () => {
    it('should navigate to tutor details route', () => {
      const tutorId = 123;
      component['onItemClick'](tutorId);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(`/shell/tutors/details/${tutorId}`);
    });
  });

  describe('when component is destroyed', () => {
    it('should clear pet', () => {
      fixture.destroy();
      expect(petsFacadeSpy.clearPet).toHaveBeenCalled();
    });
  });
});
