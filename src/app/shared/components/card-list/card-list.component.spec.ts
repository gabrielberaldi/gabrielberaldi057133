import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardListComponent } from './card-list.component';

describe('CardListComponent', () => {
  let component: CardListComponent;
  let fixture: ComponentFixture<CardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardListComponent);
    component = fixture.componentInstance;
    component.list = {
      content: [],
      total: 0,
      page: 0,
      pageCount: 0,
      size: 0
    };
    component.cardTemplate = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoud emit serch event when searchControl value changes', (done) => {
    spyOn(component.search, 'emit');
    component['searchControl'].setValue('teste');
    setTimeout(() => {
      expect(component.search.emit).toHaveBeenCalledWith('teste');
      done();
    }, 150);
  });

  it('shoud emit pageChange event',() => {
    spyOn(component.pageChange, 'emit');
    const mockPage = 2;
    component['onPageChanged'](mockPage);
    expect(component.pageChange.emit).toHaveBeenCalledWith(mockPage);
  });

});
