import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTableInfo } from './base-table-info';

describe('BaseTableInfo', () => {
  let component: BaseTableInfo;
  let fixture: ComponentFixture<BaseTableInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseTableInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseTableInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
