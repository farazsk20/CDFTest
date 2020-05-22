import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AesUnionBenefitsComponent } from './aes-union-benefits.component';

describe('AesUnionBenefitsComponent', () => {
  let component: AesUnionBenefitsComponent;
  let fixture: ComponentFixture<AesUnionBenefitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AesUnionBenefitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AesUnionBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
