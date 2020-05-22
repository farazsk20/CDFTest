import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBenefitDeleteComponent } from './confirm-benefit-delete.component';

describe('ConfirmBenefitDeleteComponent', () => {
  let component: ConfirmBenefitDeleteComponent;
  let fixture: ComponentFixture<ConfirmBenefitDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmBenefitDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmBenefitDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
