import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinEntities } from './join-entities';

describe('JoinEntities', () => {
  let component: JoinEntities;
  let fixture: ComponentFixture<JoinEntities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinEntities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinEntities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
