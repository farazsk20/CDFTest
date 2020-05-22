import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbmUnionBenefitsComponent } from './cbm-union-benefits.component';

describe('CbmUnionBenefitsComponent', () => {
  let component: CbmUnionBenefitsComponent;
  let fixture: ComponentFixture<CbmUnionBenefitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbmUnionBenefitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbmUnionBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
