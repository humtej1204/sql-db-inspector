import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindValueAnywhere } from './find-value-anywhere';

describe('FindValueAnywhere', () => {
  let component: FindValueAnywhere;
  let fixture: ComponentFixture<FindValueAnywhere>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindValueAnywhere]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindValueAnywhere);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
