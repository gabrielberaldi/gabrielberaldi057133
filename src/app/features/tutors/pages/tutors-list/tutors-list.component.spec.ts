import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { TutorsListComponent } from './tutors-list.component';
import { Router } from '@angular/router';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { TutorsFacade } from '../../facades/tutors.facade';
import { TutorList } from '../../models/tutor-list.model';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../../../shared/components/dialog/services/dialog.service';

describe('TutorsListComponent', () => {
  let component: TutorsListComponent;
  let fixture: ComponentFixture<TutorsListComponent>;

  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
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

    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    tutorsFacadeSpy = jasmine.createSpyObj('TutorsFacade', ['search', 'changePage', 'deleteTutor' ], { 
      tutorsList$: of(MOCK_TUTOR_LIST),
      loading$: of(false)
    });

    shellFacadeSpy = jasmine.createSpyObj('ShellFacade', ['setBreadCrumbs']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    

    await TestBed.configureTestingModule({
      imports: [TutorsListComponent, ReactiveFormsModule],
      providers: [
        { provide: DialogService, useValue: dialogServiceSpy },
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

  it('should call deleteTutor from facade when dialog is confirmed', () => {
    const tutor = MOCK_TUTOR_LIST.content[0];
    dialogServiceSpy.open.and.returnValue(of(true));
    tutorsFacadeSpy.deleteTutor.and.returnValue(of(void 0));
    component['onDelete'](tutor);
    expect(dialogServiceSpy.open).toHaveBeenCalled();
    expect(tutorsFacadeSpy.deleteTutor).toHaveBeenCalledWith(tutor.id!, true);
  });

  it('onEdit should navigate to the correct tutor route', () => {
    const tutorId = 123;
    component['onEdit'](tutorId);
    expect(routerSpy.navigate).toHaveBeenCalledWith([`/shell/tutors/edit/${tutorId}`]);
  });

});
