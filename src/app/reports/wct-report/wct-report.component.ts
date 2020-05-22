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
import { WctReportStaff } from '../wctReportStaff';
import { st } from '@angular/core/src/render3';
import { weekdays } from 'moment';
import { CDFLocationTax } from 'src/app/_models/cdflocation-tax';


@Component({
  selector: 'app-wct-report',
  templateUrl: './wct-report.component.html',
  styleUrls: ['./wct-report.component.css']
})
export class WctReportComponent implements OnInit {

  cdf: CDF;
  bid: CDFLocation;
  cdfId: number;
  bidId: number;
  // staff: Staff[] = [];
  costLevels: LevelCost[];
  totals: LocationSummary;
  SafetyCost:CDFLocationCost ;
  OverheadCost:CDFLocationCost;
  ProfitCost:CDFLocationCost;
  SFGRTax:CDFLocationTax;
  SalesTax:CDFLocationTax;
  BOTax:CDFLocationTax;
  SafetyCostPercent: number = 0;
  OverheadCostPercent:number =0;
  ProfitCostPercent: number = 0;
  SFGRTPercent: number = 0;
  SalesTaxPercent : number = 0;
  BOTaxPercent : number = 0;
  Cost: CDFLocationCost  ;

  wctReportStaff: WctReportStaff[] = [];
  
  constructor(private route: ActivatedRoute,
    private cdfService: CdfService,
    private cdfLocationService: CdfLocationService,
    private reportExportService: ReportExportService) { }
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

        this.SafetyCost = this.bid.Costs.find(c => c.Cost.Name === "Safety");
        this.OverheadCost = this.bid.Costs.find(c => c.Cost.Name === "Overhead");
        this.ProfitCost = this.bid.Costs.find(c => c.Cost.Name === "Profit") ;
        this.SFGRTax = this.bid.Taxes.find(t => t.Type.Value === "Sales Tax") ;
       this.SalesTax= this.bid.Taxes.find(t => t.Type.Value === "Gross Receipt Tax") ;
        this.BOTax = this.bid.Taxes.find(t => t.Type.Value === "B&O Tax") ;

        this.SafetyCostPercent = this.SafetyCost && this.SafetyCost.Value? this.SafetyCost.Value : 0;
        this.OverheadCostPercent = this.OverheadCost && this.OverheadCost.Value ? this.OverheadCost.Value : 0;
        this.ProfitCostPercent = this.ProfitCost && this.ProfitCost.Value ? this.ProfitCost.Value : 0;
        this.SFGRTPercent = this.SFGRTax && this.SFGRTax.Rate ? this.SFGRTax.Rate : 0;
        this.SalesTaxPercent = this.SalesTax && this.SalesTax.Rate ? this.SalesTax.Rate : 0;
        this.BOTaxPercent = this.BOTax && this.BOTax.Rate ? this.BOTax.Rate : 0;

        this.bid.Staff.forEach(staff  => {
          let wctStaff : WctReportStaff = new WctReportStaff() ; 
          
          wctStaff.Classification = staff.Classification.Value;
          wctStaff.BaseWage = staff.Rate;
          wctStaff.TaxesAndIns =  0;
          wctStaff.EffectiveTaxesAndInsurance = wctStaff.TaxesAndIns/wctStaff.BaseWage;
          wctStaff.HealthAndWelfare =  this.calculateBenefit(staff,this.cdf.WeeksPerMonth,"HandW");
          wctStaff.Pension401K = this.calculateBenefit(staff,this.cdf.WeeksPerMonth,"Pension");
          wctStaff.TrainingFund = this.calculateBenefit(staff,this.cdf.WeeksPerMonth,"Training");
          wctStaff.Other = this.calculateCost(this.bid,this.cdf.WeeksPerMonth,"Other", staff);
          wctStaff.UniformCharges = this.calculateCost(this.bid, this.cdf.WeeksPerMonth, "Uniforms", staff);
          wctStaff.TrustFundAuditCompliance = this.calculateCost(this.bid, this.cdf.WeeksPerMonth, "Trust Fund Compliance Audit", staff);
          wctStaff.TechnologyHosting_Retention = this.calculateCost(this.bid, this.cdf.WeeksPerMonth, "Technology Implementation", staff);
          wctStaff.CyberSecurity = this.calculateCost(this.bid, this.cdf.WeeksPerMonth, "Cyber and Technology Fee", staff);
          wctStaff.SubTotalHourlyRate = wctStaff.BaseWage + wctStaff.TaxesAndIns + wctStaff.HealthAndWelfare + wctStaff.Pension401K + 
                                        wctStaff.TrainingFund + wctStaff.Other + wctStaff.UniformCharges + wctStaff.TrustFundAuditCompliance +
                                        wctStaff.TechnologyHosting_Retention + wctStaff.CyberSecurity;
          wctStaff.Safety = this.calculateTax(wctStaff.SubTotalHourlyRate , this.SafetyCostPercent);
          wctStaff.Overhead = this.calculateTax(this.SafetyCostPercent, this.OverheadCostPercent);
          wctStaff.Profit = this.calculateTax(this.SafetyCostPercent, this.ProfitCostPercent);
          wctStaff.SFGRT = this.calculateTax(this.SafetyCostPercent,this.SFGRTPercent);
          wctStaff.SalesTax = this.calculateTax(this.SafetyCostPercent,this.SalesTaxPercent);
          wctStaff.BAndOTax = this.calculateTax(this.SafetyCostPercent,this.BOTaxPercent);
          wctStaff.TotalHourlyRate = wctStaff.SubTotalHourlyRate + wctStaff.Safety + wctStaff.Overhead + wctStaff.Profit +
                                     wctStaff.SFGRT + wctStaff.SalesTax + wctStaff.BAndOTax;
          wctStaff.TotalMonthly = wctStaff.TotalHourlyRate * staff.DailyHours * staff.DaysPerWeek * this.cdf.WeeksPerMonth;
          //OT
          wctStaff.BaseWageOT = staff.Rate * 1.5;
          wctStaff.TaxesAndInsOT = wctStaff.TaxesAndIns * 1.5;
          wctStaff.HealthAndWelfareOT = this.calculateBenefit(staff, this.cdf.WeeksPerMonth, "HandW","OT");
          wctStaff.Pension401KOT = this.calculateBenefit(staff, this.cdf.WeeksPerMonth, "Pension","OT");
          wctStaff.OverTimeSubTotal = wctStaff.BaseWageOT + wctStaff.TaxesAndInsOT + wctStaff.HealthAndWelfareOT + wctStaff.Pension401KOT;
          wctStaff.SafetyOT =this.calculateTax(wctStaff.OverTimeSubTotal, this.SafetyCostPercent);
          wctStaff.OverheadOT =this.calculateTax(wctStaff.OverTimeSubTotal, this.OverheadCostPercent);
          wctStaff.ProfitOT =this.calculateTax(wctStaff.OverTimeSubTotal, this.ProfitCostPercent);
          wctStaff.SFGRTOT =this.calculateTax(wctStaff.OverTimeSubTotal, this.SFGRTPercent);       
          wctStaff.SalesTaxOT =this.calculateTax(wctStaff.OverTimeSubTotal, this.SalesTaxPercent);
          wctStaff.BAndOTaxOT =this.calculateTax(wctStaff.OverTimeSubTotal, this.BOTaxPercent);       
          wctStaff.OverTimeTotal = wctStaff.OverTimeSubTotal + wctStaff.SafetyOT + wctStaff.OverheadOT + wctStaff.ProfitOT +
                                  wctStaff.SFGRTOT + wctStaff.SalesTaxOT + wctStaff.BAndOTaxOT;
          //DT
          wctStaff.BaseWageDT = staff.Rate * 2;
          wctStaff.TaxesAndInsDT = wctStaff.TaxesAndIns * 2;
          wctStaff.HealthAndWelfareDT = this.calculateBenefit(staff, this.cdf.WeeksPerMonth, "HandW","DT");
          wctStaff.Pension401KDT = this.calculateBenefit(staff, this.cdf.WeeksPerMonth, "Pension","DT");
          wctStaff.DoubleTimeSubTotal = wctStaff.BaseWageDT + wctStaff.TaxesAndInsDT + wctStaff.HealthAndWelfareDT + wctStaff.Pension401KDT;
          wctStaff.SafetyDT = this.calculateTax(wctStaff.DoubleTimeSubTotal,this.SafetyCostPercent );
          wctStaff.OverheadDT = this.calculateTax(wctStaff.DoubleTimeSubTotal,this.OverheadCostPercent );
          wctStaff.ProfitDT = this.calculateTax(wctStaff.DoubleTimeSubTotal,this.ProfitCostPercent );
          wctStaff.SFGRTDT = this.calculateTax(wctStaff.DoubleTimeSubTotal,this.SFGRTPercent );
          wctStaff.SalesTaxDT = this.calculateTax(wctStaff.DoubleTimeSubTotal,this.SalesTaxPercent);
          wctStaff.BAndOTaxDT = this.calculateTax(wctStaff.DoubleTimeSubTotal,this.BOTaxPercent);
          wctStaff.DoubleTimeTotal = wctStaff.DoubleTimeSubTotal + wctStaff.SafetyDT + wctStaff.OverheadDT + wctStaff.ProfitDT +
                                     wctStaff.SFGRTDT + wctStaff.SalesTaxDT + wctStaff.BAndOTaxDT;
          //DTH
          wctStaff.BaseWageDTH = staff.Rate * 2.5;
          wctStaff.TaxesAndInsDTH = wctStaff.TaxesAndIns * 2.5;
          wctStaff.HealthAndWelfareDTH = this.calculateBenefit(staff, this.cdf.WeeksPerMonth, "HandW","DTH");
          wctStaff.Pension401KDTH = this.calculateBenefit(staff, this.cdf.WeeksPerMonth, "Pension","DTH");
          wctStaff.DoubleTimeAndHalfSubTotal = wctStaff.BaseWageDTH + wctStaff.TaxesAndInsDTH + wctStaff.HealthAndWelfareDTH + wctStaff.Pension401KDTH;
          wctStaff.SafetyDTH = this.calculateTax(wctStaff.DoubleTimeAndHalfSubTotal,this.SafetyCostPercent);
          wctStaff.OverheadDTH = this.calculateTax(wctStaff.DoubleTimeAndHalfSubTotal,this.OverheadCostPercent);
          wctStaff.ProfitDTH = this.calculateTax(wctStaff.DoubleTimeAndHalfSubTotal,this.ProfitCostPercent );
          wctStaff.SFGRTDTH = this.calculateTax(wctStaff.DoubleTimeAndHalfSubTotal,this.SFGRTPercent);
          wctStaff.SalesTaxDTH = this.calculateTax(wctStaff.DoubleTimeAndHalfSubTotal,this.SalesTaxPercent);
          wctStaff.BAndOTaxDTH = this.calculateTax(wctStaff.DoubleTimeAndHalfSubTotal,this.BOTaxPercent);
          wctStaff.DoubleTimeAndHalfTotal = wctStaff.DoubleTimeAndHalfSubTotal + wctStaff.SafetyDTH + wctStaff.OverheadDTH + wctStaff.ProfitDTH +
                                            wctStaff.SFGRTDTH + wctStaff.SalesTaxDTH + wctStaff.BAndOTaxDTH;
          
          this.wctReportStaff.push(wctStaff);
          
          }
        )

      }
    );
  
  }

  calculateBenefit(staff:Staff, weeks:number,type: string, workType?:string): number{
    let aesbenefit: StaffAESBenefit;
    let cbmBenefit: StaffCBMBenefit;
    let nonUnionBenefit: StaffNonUnionBenefit;
    let monthlyHrs = this.calculateHours(staff, weeks);
    //Check for MDV and 401K
    if (staff.LaborType.Value === "Non-Union" && type === "Pension"){
      type = "401K";
    }
    else if (staff.LaborType.Value === "Non-Union" && type === "HandW"){
      type = "MDV";
    }
    if(staff.AES_Benefits.length >0){
      aesbenefit = staff.AES_Benefits.filter(s => s.Type.Value === type && s.Active === true)[0] as StaffAESBenefit;
    }
    else if(staff.CBM_Benefits.length>0)
    {
      cbmBenefit = staff.CBM_Benefits.filter(s => s.BenefitType.Value === type && s.Active === true)[0] as StaffCBMBenefit;
    }
    else if (staff.NonUnion_Benefits.length > 0) {
      nonUnionBenefit = staff.NonUnion_Benefits[0] as StaffNonUnionBenefit;
    }
    else{
      return 0;
    }
    
    if(staff.LaborType.Value === "Non-Union"){     
        if(nonUnionBenefit){
          if( nonUnionBenefit.NonUnionBenefit.RateType.Value === "Hourly"){
            return nonUnionBenefit.Rate;
          }
          else if(nonUnionBenefit.NonUnionBenefit.RateType.Value === "Monthly"){
            return nonUnionBenefit.Rate / (staff.DailyHours * staff.DaysPerWeek * weeks);
          }
          else if(nonUnionBenefit.NonUnionBenefit.RateType.Value === "Weekly"){
            return nonUnionBenefit.Rate / (staff.DailyHours * staff.DaysPerWeek);
          }
        }
    }
    else if(staff.LaborType.Value === "Union"){
        if(aesbenefit){
          if(workType === "OT"){
            switch (aesbenefit.PricingMethod.Value) {
              case 'Hour_OT':
                return aesbenefit.Rate;
                break;
              default:
                return 0;
                break;
            }        
          }
          else if(workType === "DT"){
            switch (aesbenefit.PricingMethod.Value) {
              case 'Hour_DT':
                return aesbenefit.Rate;
                break;
              default:
                return 0;
                break;
            }
          }
          else if(workType === "DTH"){
            switch (aesbenefit.PricingMethod.Value) {
              default:
                return 0;
                break;
            }
          }
          else{
            switch (aesbenefit.PricingMethod.Value) {
              case 'Flat_Reg':
              case 'Flat_All':
                if (aesbenefit.Override) {
                 return aesbenefit.Rate;
                } else {
                  if (monthlyHrs >= aesbenefit.QualifyingHours) {
                   return aesbenefit.FullContribution;
                  } else {
                    return aesbenefit.MinContribution;
                  }
                }
                break;
              case "Hour_OT":
              case "Hour_DT":
              case "Manual":
              case "HourPremium_All":
                return 0;
                break;
              case 'PctGross':
                return monthlyHrs * aesbenefit.Rate * aesbenefit.FullContribution;;
                break;

              case 'HourCap_Reg':
                if (aesbenefit.Override) {
                 return aesbenefit.Rate * monthlyHrs;
                }
                else {
                  if (monthlyHrs >= aesbenefit.QualifyingHours) {
                    return aesbenefit.FullContribution;
                  }
                  else {
                   return aesbenefit.MinContribution * monthlyHrs;
                  }
                }
                break;
              case "Flat_Week_All":
                return aesbenefit.Rate * weeks;
                break;
              case "Hour_Reg":
              case "Hour_All":
              case "HourCap_All":
                if (aesbenefit.Override) {
                  return aesbenefit.Rate;
                } else {
                  if (monthlyHrs >= aesbenefit.QualifyingHours) {
                    return aesbenefit.FullContribution;
                  } else {
                   return aesbenefit.MinContribution;
                  }
                }
                break;
              default:
                return 0;
                break;

            }
          }         
          }
        else if (cbmBenefit) {
          if (cbmBenefit.RateType.Value === "Hourly") {
            return cbmBenefit.Rate;
          }
          else if (cbmBenefit.RateType.Value === "Monthly") {
            return cbmBenefit.Rate / (staff.DailyHours * staff.DaysPerWeek * weeks);
          }
          else if (cbmBenefit.RateType.Value === "Weekly") {
            return cbmBenefit.Rate / (staff.DailyHours * staff.DaysPerWeek);
          }

        }
        }
    
     return 0;
  }

  calculateHours(staff: Staff, weeksPerMonth: number) {
    return staff.DailyHours * staff.DaysPerWeek * weeksPerMonth;
  }

  calculateCost(location: CDFLocation, weeks:number, type: string,staff:Staff): number {
     this.Cost= location.Costs.filter(l => l.Cost.Name == type)[0];
     
   this.Cost && this.Cost.Cost.CostPricingMethods.forEach(cpm => {
      switch(cpm.PricingMethod.Value){
        case "Cost per Union Head Count":
          return (this.Cost.Total / this.cdfLocationService.getUnionEmployeeCount(location)) / (staff.DailyHours * staff.DaysPerWeek * weeks);
          break;
        case "Cost per non-Union Head Count":
          return (this.Cost.Total / this.cdfLocationService.getUnionEmployeeCount(location)) / (staff.DailyHours * staff.DaysPerWeek * weeks);;
          break;
        case "Cost per Head Count":
          return (this.Cost.Total / this.cdfLocationService.getTotalEmployeeCount(location)) / (staff.DailyHours * staff.DaysPerWeek * weeks);;
          break;
        case "% of Base Labor":
          return 0;
          break;
        case "% of Total Labor":
          return 0;
          break;
        case "Lump Sum":
          return (this.Cost.Total)/(staff.DailyHours * staff.DaysPerWeek * weeks);
          break;
        default:
            return 0;
            break;
      }
    });
    
   return 0;
  }
  calculateTax(subTotal: number, percent:number): number{

    return subTotal * (percent/100);
  }
 

  @ViewChild('content') content: ElementRef;
  public downloadPDF() {
    this.reportExportService.ExportPDF(this.content, this.cdf, this.bid);
  }
  downloadExcel() {
    this.reportExportService.ExportExcel(this.content, this.cdf, this.bid);
  }

}
