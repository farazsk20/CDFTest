import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNonunionBenefitComponent } from './add-nonunion-benefit.component';

describe('AddNonunionBenefitComponent', () => {
  let component: AddNonunionBenefitComponent;
  let fixture: ComponentFixture<AddNonunionBenefitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNonunionBenefitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNonunionBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
