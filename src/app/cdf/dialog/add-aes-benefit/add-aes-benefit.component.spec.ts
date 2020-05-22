import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAesBenefitComponent } from './add-aes-benefit.component';

describe('AddAesBenefitComponent', () => {
  let component: AddAesBenefitComponent;
  let fixture: ComponentFixture<AddAesBenefitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAesBenefitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAesBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
