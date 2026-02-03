import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { TutorsListComponent } from './tutors-list.component';
import { Router } from '@angular/router';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { TutorsFacade } from '../../facades/tutors.facade';
import { TutorList } from '../../models/tutor-list.model';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('TutorsListComponent', () => {
  let component: TutorsListComponent;
  let fixture: ComponentFixture<TutorsListComponent>;

  let shellFacadeSpy: jasmine.SpyObj<ShellFacade>;
  let tutorsFacadeSpy: jasmine.SpyObj<TutorsFacade>;
  let routerSpy: jasmine.SpyObj<Router>;

  const MOCK_TUTOR_LIST: TutorList = {
    content: [{ id: 1, nome: 'Tutor Teste', telefone: '123', endereco: 'Rua', foto: null }],
    total: 1,
    page: 0,
    size: 10,
    pageCount: 1
  };

  beforeEach(async () => {

    tutorsFacadeSpy = jasmine.createSpyObj('TutorsFacade', ['search', 'changePage' ], { 
      tutorsList$: of(MOCK_TUTOR_LIST),
      loading$: of(false)
    });

    shellFacadeSpy = jasmine.createSpyObj('ShellFacade', ['setBreadCrumbs']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TutorsListComponent, ReactiveFormsModule],
      providers: [
        { provide: TutorsFacade, useValue: tutorsFacadeSpy },
        { provide: ShellFacade, useValue: shellFacadeSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be initialized correctly and set breadcrumbs', () => {
    expect(component).toBeTruthy();
    expect(shellFacadeSpy.setBreadCrumbs).toHaveBeenCalled();
  });

  it('should call tutorsFacadeSpy.search', () => {
    const searchTerm = 'Carlos';
    component['tutorsFacade'].search(searchTerm);
    expect(tutorsFacadeSpy.search).toHaveBeenCalledWith(searchTerm);
  });

  it('onPageChange should call tutorsFacadeSpy.changePage', () => {
    const page = 2;
    component['onPageChange'](page);
    expect(tutorsFacadeSpy.changePage).toHaveBeenCalledWith(page);
  });

  it('onViewDetails should navigate to the correct tutor route', () => {
    const tutorId = 123;
    component['onViewDetails'](tutorId);
    expect(routerSpy.navigate).toHaveBeenCalledWith([`/shell/tutors/details/${tutorId}`]);
  });

});
