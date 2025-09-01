import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBaseTables } from './list-base-tables';

describe('ListBaseTables', () => {
  let component: ListBaseTables;
  let fixture: ComponentFixture<ListBaseTables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBaseTables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBaseTables);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
