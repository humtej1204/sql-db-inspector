import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTablesRelations } from './get-tables-relations';

describe('GetTablesRelations', () => {
  let component: GetTablesRelations;
  let fixture: ComponentFixture<GetTablesRelations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetTablesRelations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetTablesRelations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
