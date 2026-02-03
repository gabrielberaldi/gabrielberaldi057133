import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { PetsFacade } from '../../facades/pets.facade';
import { PetList } from '../../models/pet-list.model';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { PetsListComponent } from './pets-list.component';

describe('PetsListComponent', () => {
  let component: PetsListComponent;
  let fixture: ComponentFixture<PetsListComponent>;

  let shellFacadeSpy: jasmine.SpyObj<ShellFacade>;
  let petsFacadeSpy: jasmine.SpyObj<PetsFacade>;
  let routerSpy: jasmine.SpyObj<Router>;

  const MOCK_PET_LIST: PetList = {
    content: [{ id: 1, nome: 'Rex', raca: 'Golden Retriever', idade: 5, foto: null }],
    total: 1,
    page: 0,
    size: 10,
    pageCount: 1
  };

  beforeEach(async () => {
    petsFacadeSpy = jasmine.createSpyObj('PetsFacade', ['search', 'changePage'], {
      petsList$: of(MOCK_PET_LIST),
      loading$: of(false)
    });

    shellFacadeSpy = jasmine.createSpyObj('ShellFacade', ['setBreadCrumbs']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PetsListComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PetsFacade, useValue: petsFacadeSpy },
        { provide: ShellFacade, useValue: shellFacadeSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set breadcrumbs on initialization', () => {
      expect(shellFacadeSpy.setBreadCrumbs).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should call petsFacade.search when search term changes', fakeAsync(() => {
      const searchTerm = 'Rex';
      component['petsFacade'].search(searchTerm);
      expect(petsFacadeSpy.search).toHaveBeenCalledOnceWith(searchTerm);
    }));
  });

  describe('onPageChange', () => {
    it('should call petsFacade.changePage with page number', () => {
      const page = 2;

      component['onPageChange'](page);

      expect(petsFacadeSpy.changePage).toHaveBeenCalledWith(page);
    });
  });

  describe('onViewDetails', () => {
    it('should navigate to the correct pet route', () => {
      const petId = 123;

      component['onViewDetails'](petId);

      expect(routerSpy.navigate).toHaveBeenCalledWith([`/shell/pets/details/${petId}`]);
    });
  });
});
