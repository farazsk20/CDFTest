import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CDF } from 'src/app/_models/cdf';
import { CDFLocation } from 'src/app/_models/cdflocation';
import { CdfService } from 'src/app/_services/cdf.service';
import { CdfLocationService } from 'src/app/_services/cdf-location.service';
import { ReportExportService } from 'src/app/_services/report-export.service'
import { Staff } from 'src/app/_models/staff';
import { LevelCost } from 'src/app/_models/level-cost';
import { LocationSummary } from 'src/app/_models/location-summary';
import { CDFLocationCost } from 'src/app/_models/cdflocation-cost';
import { StaffAESBenefit } from 'src/app/_models/staff-aes-benefit';
import { StaffCBMBenefit } from 'src/app/_models/staff-cbm-benefit';
import { StaffNonUnionBenefit } from 'src/app/_models/staff-non-union-benefit';
import { CDFReportAESBenefit } from '../cdf-report-aes-benefit';
import { CDFReportCBMBenefit } from '../cdf-report-cbm-benefit';
import { CDFReportNonUnionBenefit } from '../cdf-report-nonunion-benefit';
@Component({
  selector: 'app-cdf-report',
  templateUrl: './cdf-report.component.html',
  styleUrls: ['./cdf-report.component.css']
})
export class CdfReportComponent implements OnInit {
  cdf: CDF;
  bid: CDFLocation;
  cdfId: number;
  bidId: number;
  // staff: Staff[] = [];
  costLevels: LevelCost[];
  totals: LocationSummary;
  timeOffCosts: CDFLocationCost[] = [];
  payRollCosts: CDFLocationCost[] = [];
  insuranceCosts: CDFLocationCost[] = [];
  unionBenefits: CDFReportAESBenefit[] = [];
  cbmUnionBenefits: CDFReportCBMBenefit[] = [];
  nonUnionBenefits: CDFReportNonUnionBenefit[] = [];
  otherCosts: CDFLocationCost[] = [];
  fees: CDFLocationCost[] = [];
  other: CDFLocationCost[] = [];
  payRollAdministration: CDFLocationCost;
  constructor(private route: ActivatedRoute,
    private cdfService: CdfService,
    private cdfLocationService: CdfLocationService,
    private reportExportService : ReportExportService) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params)
      this.cdfId = +params['id'];
      this.bidId = +params['bidId'];
    });
    this.cdfService.GetCdf(this.cdfId).subscribe(
      (data: CDF) => {
        this.cdf = data;

      }
    );
    this.cdfLocationService.GetCdf(this.bidId).subscribe(
      (data: CDFLocation) => {
        this.bid = data;

        this.timeOffCosts = this.bid.Costs.filter(cdfLocationCost => cdfLocationCost.Cost.Level.Value === 150 && cdfLocationCost.Total !== null);
        this.payRollCosts = this.bid.Costs.filter(cdfLocationCost => cdfLocationCost.Cost.Level.Value === 200
          || cdfLocationCost.Cost.Level.Value === 280 && cdfLocationCost.Total !== null);
        this.insuranceCosts = this.bid.Costs.filter(cdfLocationCost => cdfLocationCost.Cost.Level.Value === 250 &&
          cdfLocationCost.Total !== null);
        if (this.bid.Staff) {
          this.bid.Staff.forEach(staff => {
            if (staff.AES_Benefits) {
              staff.AES_Benefits.forEach(aesBenefit => {
                const  unionBenefit = aesBenefit as CDFReportAESBenefit;
                unionBenefit.Staff = staff;
                if(unionBenefit.Active){
                this.unionBenefits.push(unionBenefit);
               }
               });
             
            }
            if (staff.CBM_Benefits) {
              staff.CBM_Benefits.forEach(cbmBenefit => {
                  const cbmunionBenefit = cbmBenefit as CDFReportCBMBenefit;
                  cbmunionBenefit.Staff = staff;
                  if(cbmBenefit.Active){
                  this.cbmUnionBenefits.push(cbmunionBenefit);
                  }
              });
            }
            if (staff.NonUnion_Benefits) {
              staff.NonUnion_Benefits.forEach(nonUnion_Benefit => {
                const nonunionBenefit = nonUnion_Benefit as CDFReportNonUnionBenefit;
                nonunionBenefit.Staff = staff;
                this.nonUnionBenefits.push(nonunionBenefit);
              });
            }
          });
        }
        this.otherCosts = this.bid.Costs.filter(cdfLocationCost => cdfLocationCost.Cost.Level.Value === 500
          || cdfLocationCost.Cost.Level.Value === 520
          || cdfLocationCost.Cost.Level.Value === 540
          || cdfLocationCost.Cost.Level.Value === 560
          || cdfLocationCost.Cost.Level.Value === 600
          || cdfLocationCost.Cost.Level.Value === 700
          && cdfLocationCost.Total !== null);
        this.fees = this.bid.Costs.filter(cdfLocationCost => (cdfLocationCost.Cost.Level.Value === 800
          || cdfLocationCost.Cost.Level.Value === 820
          || cdfLocationCost.Cost.Level.Value === 840
          || cdfLocationCost.Cost.Level.Value === 850
          || cdfLocationCost.Cost.Level.Value === 860
          || cdfLocationCost.Cost.Level.Value === 880)
          && cdfLocationCost.Total !== null);
        this.other = this.bid.Costs.filter(cdfLocationCost => cdfLocationCost.Cost.Level.Value === 900
          && cdfLocationCost.Total !== null);
        this.payRollAdministration = this.bid.Costs.filter(cdfLocationCost => cdfLocationCost.Cost.Level.Value === 290
          && cdfLocationCost.Total !== null)[0];

        this.cdfLocationService.getLocationTotals(this.bid, this.cdf.WeeksPerMonth)
          .then(data => {
            this.totals = data;
          });
      }
    );
    // this.cdfLocationService.GetCostLevels(this.bidId).subscribe(
    //   (data:LevelCost[]) => {
    //     this.costLevels = data;
    //   }
    // );




  }
  @ViewChild('content') content: ElementRef;
  public downloadPDF() {
   this.reportExportService.ExportPDF(this.content,this.cdf,this.bid);
  }
  downloadExcel() {
   this.reportExportService.ExportExcel(this.content,this.cdf,this.bid);
  }

}
