import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinamicTable } from './dinamic-table';

describe('DinamicTable', () => {
  let component: DinamicTable;
  let fixture: ComponentFixture<DinamicTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DinamicTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinamicTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
