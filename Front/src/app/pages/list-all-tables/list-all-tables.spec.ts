import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllTables } from './list-all-tables';

describe('ListAllTables', () => {
  let component: ListAllTables;
  let fixture: ComponentFixture<ListAllTables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllTables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllTables);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
