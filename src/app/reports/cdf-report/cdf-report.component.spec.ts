import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdfReportComponent } from './cdf-report.component';

describe('CdfReportComponent', () => {
  let component: CdfReportComponent;
  let fixture: ComponentFixture<CdfReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdfReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
