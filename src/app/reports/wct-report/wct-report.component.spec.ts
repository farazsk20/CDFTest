import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WctReportComponent } from './wct-report.component';

describe('WctReportComponent', () => {
  let component: WctReportComponent;
  let fixture: ComponentFixture<WctReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WctReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WctReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
