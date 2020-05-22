import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostAnalysisReportComponent } from './cost-analysis-report.component';

describe('CostAnalysisReportComponent', () => {
  let component: CostAnalysisReportComponent;
  let fixture: ComponentFixture<CostAnalysisReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostAnalysisReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
