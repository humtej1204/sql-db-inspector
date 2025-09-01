import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInfo } from './table-info';

describe('TableInfo', () => {
  let component: TableInfo;
  let fixture: ComponentFixture<TableInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(TableInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
