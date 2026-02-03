import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { BreadcrumbConfig } from '../../../models/breadcrumb-config.model';
import { MenuItem } from '../../../configs/menu-config';
import { User } from 'lucide-angular';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const mockConfig: BreadcrumbConfig = { breadcrumbs: [] };
  const mockMenuItems: MenuItem[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    component.config = mockConfig;
    component.isSidebarOpen = true;
    component.menuItems = mockMenuItems;
    component.sidebarIcon = User;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
