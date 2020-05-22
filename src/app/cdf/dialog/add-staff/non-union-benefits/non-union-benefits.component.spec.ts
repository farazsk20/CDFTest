import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonUnionBenefitsComponent } from './non-union-benefits.component';

describe('NonUnionBenefitsComponent', () => {
  let component: NonUnionBenefitsComponent;
  let fixture: ComponentFixture<NonUnionBenefitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonUnionBenefitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonUnionBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
