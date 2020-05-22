import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCbmBenefitComponent } from './add-cbm-benefit.component';

describe('AddCbmBenefitComponent', () => {
  let component: AddCbmBenefitComponent;
  let fixture: ComponentFixture<AddCbmBenefitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCbmBenefitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCbmBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
