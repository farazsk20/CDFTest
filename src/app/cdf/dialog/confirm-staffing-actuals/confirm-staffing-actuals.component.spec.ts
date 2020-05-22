import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmStaffingActualsComponent } from './confirm-staffing-actuals.component';

describe('ConfirmStaffingActualsComponent', () => {
  let component: ConfirmStaffingActualsComponent;
  let fixture: ComponentFixture<ConfirmStaffingActualsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmStaffingActualsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmStaffingActualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
