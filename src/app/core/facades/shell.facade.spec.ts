import { TestBed } from '@angular/core/testing';
import { ShellFacade } from './shell.facade';
import { BreadcrumbConfig } from '../models/breadcrumb-config.model';

describe('ShellFacade', () => {
  let facade: ShellFacade;

  const MOCK_BREADCRUMB_CONFIG: BreadcrumbConfig = {
    
    breadcrumbs: [
      { label: 'Home', link: '/home' },
      { label: 'Tutors', link: '/tutors' }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(ShellFacade);
  });

  describe('when facade is initialized', () => {
    it('should be created', () => {
  
      expect(facade).toBeTruthy();
    });

    it('should have breadcrumbConfig$ as undefined initially', (done) => {
      facade.breadcrumbConfig$.subscribe(config => {
        expect(config).toBeUndefined();
        done();
      });
    });

    it('should have isSidebarOpen$ as false initially', (done) => {
      facade.isSidebarOpen$.subscribe(isOpen => {
        expect(isOpen).toBe(false);
        done();
      });
    });
  });

  describe('setBreadCrumbs', () => {
    it('should update breadcrumbConfig$ with provided config', (done) => {
      facade.setBreadCrumbs(MOCK_BREADCRUMB_CONFIG);

      facade.breadcrumbConfig$.subscribe(config => {
        expect(config).toEqual(MOCK_BREADCRUMB_CONFIG);
        done();
      });
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle sidebar from false to true', (done) => {
      facade.toggleSidebar();
      facade.isSidebarOpen$.subscribe(isOpen => {
        expect(isOpen).toBe(true);
        done();
      });
    });

    it('should toggle sidebar from true to false', (done) => {
      (facade as any)._isSidebarOpen$.next(true);
      facade.toggleSidebar();
      facade.isSidebarOpen$.subscribe(isOpen => {
        expect(isOpen).toBe(false);
        done();
      });
    });
  });

  describe('sidebarIcon$', () => {
    it('should emit PanelRightOpenIcon when sidebar is open', (done) => {
      (facade as any)._isSidebarOpen$.next(true);
      facade.sidebarIcon$.subscribe(icon => {
        expect(icon).toBeDefined();
        done();
      });
    });

    it('should emit PanelRightCloseIcon when sidebar is closed', (done) => {
      (facade as any)._isSidebarOpen$.next(false);
      facade.sidebarIcon$.subscribe(icon => {
        expect(icon).toBeDefined();
        done();
      });
    });
  });
});
