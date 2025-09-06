import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryResult } from './query-result';

describe('QueryResult', () => {
  let component: QueryResult;
  let fixture: ComponentFixture<QueryResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
