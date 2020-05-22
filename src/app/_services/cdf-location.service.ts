import { CdfLocactionTaxService } from "./cdf-locaction-tax.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { CDFLocation } from "../_models/cdflocation";
import { GroupByPipe } from "ngx-pipes";
import { LocationSummary } from "../_models/location-summary";
import * as moment from "moment";
import { LevelCost } from "../_models/level-cost";
import { Cost } from "../_models/cost";
import { CDFLocationCost } from "../_models/cdflocation-cost";
import { CDFLocationTax } from "../_models/cdflocation-tax";
import { Staff } from "../_models/staff";
import { NonUnionBenefit } from "../_models/non-union-benefit";
import { StaffNonUnionBenefit } from "../_models/staff-non-union-benefit";
import { LaborType } from "../_models/labor-type";
import { removeSummaryDuplicates } from "@angular/compiler";
import { CDFLocationSSE } from "../_models/cdflocation-sse";

@Injectable({
  providedIn: "root"
})
export class CdfLocationService {
  constructor(public http: HttpClient, public groupBy: GroupByPipe) {}

  public GetList() {
    return this.http.get(environment.apiEndpoint + "/CDFLocations");
  }

  public GetCdf(id) {
    return this.http.get<CDFLocation>(
      environment.apiEndpoint + `/CDFLocations/${id}`
    );
  }

  public SaveLocation(loc: CDFLocation) {
    return this.http.post<CDFLocation>(
      environment.apiEndpoint + "/CDFLocations",
      loc
    );
  }

  public GetCostLevels(id) {
    return this.http.get(
      environment.apiEndpoint + `/CDFLocations/LevelCosts/${id}`
    );
  }

  Delete(id) {
    return this.http.delete(environment.apiEndpoint + `/CDFLocations/${id}`);
  }

  public CalculateTotalOverhead(loc: CDFLocation) {
    return 0;
  }

  public getLocationTotals(loc: CDFLocation, weeks: number) {
    return new Promise<LocationSummary>(resolve => {
      let total = 0;
      let summary = new LocationSummary();
      let costLevels;

      this.GetCostLevels(loc.Id).subscribe(res => {
        costLevels = res;

        summary.BaseWages = this.calculateTotal([100], costLevels);
        summary.ActualBaseWages = this.calculateTotal(
          [100],
          costLevels,
          null,
          null,
          true
        );
        summary.BaseWagesDay = this.calculateTotal(
          [100],
          costLevels,
          null,
          "Day Shift"
        );
        summary.BaseWagesNight = this.calculateTotal(
          [100],
          costLevels,
          null,
          "Night Shift"
        );
        summary.TotalLabor = this.calculateTotal([100, 150], costLevels);
        summary.TotalUnionLabor = this.calculateTotal(
          [100, 150],
          costLevels,
          "Union"
        );
        summary.TotalNonUnionLabor = this.calculateTotal(
          [100, 150],
          costLevels,
          "Non-Union"
        );
        summary.ActualTotalLabor = this.calculateTotal(
          [100, 150],
          costLevels,
          null,
          null,
          true
        );
        summary.ActualTotalUnionLabor = this.calculateTotal(
          [100, 150],
          costLevels,
          "Union",
          null,
          true
        );
        summary.ActualTotalNonUnionLabor = this.calculateTotal(
          [100, 150],
          costLevels,
          "Non-Union",
          null,
          true
        );
        summary.TotalLaborDay = this.calculateTotal(
          [100, 150],
          costLevels,
          null,
          "Day Shift"
        );
        summary.TotalLaborNight = this.calculateTotal(
          [100, 150],
          costLevels,
          null,
          "Night Shift"
        );
        summary.TotalPayrollTax = this.calculateTotal([200, 280], costLevels);
        summary.TotalPayrollProcessing = this.calculateTotal([290], costLevels);
        summary.TotalPayrollProcessingActual = this.calculateTotal(
          [290],
          costLevels,
          null,
          null,
          true
        );
        summary.TotalInsurance = this.calculateTotal([250], costLevels);
        summary.TotalUnionBenefits = this.calculateTotal([300], costLevels);
        summary.TotalUnionBenefitsDay = this.calculateTotal(
          [300],
          costLevels,
          null,
          "Day Shift"
        );
        summary.TotalUnionBenefitsNight = this.calculateTotal(
          [300],
          costLevels,
          null,
          "Night Shift"
        );
        summary.TotalNonUnionBenefits = this.calculateTotal([400], costLevels);
        summary.TotalNonUnionBenefitsDay = this.calculateTotal(
          [400],
          costLevels,
          null,
          "Day Shift"
        );
        summary.TotalNonUnionBenefitsNight = this.calculateTotal(
          [400],
          costLevels,
          null,
          "Night Shift"
        );
        summary.TotalOngoingCosts = this.calculateTotal([520], costLevels);
        summary.TotalRemainingCostItems = this.calculateTotal(
          [500, 540, 560, 600, 650, 700],
          costLevels
        );
        summary.TotalStartupOtherCosts = this.calculateTotal(
          [500, 540, 530, 600, 700],
          costLevels
        );
        summary.TotalCostsBeforeFees = this.calculateTotal(
          [
            100,
            150,
            200,
            250,
            280,
            290,
            300,
            400,
            500,
            520,
            540,
            560,
            600,
            650,
            700
          ],
          costLevels
        );
        summary.TotalFees = this.calculateTotal(
          [800, 820, 840, 850, 860],
          costLevels
        );
        summary.TotalDiscount = this.calculateTotal([880], costLevels);
        summary.TotalTax = this.calculateTotal([900], costLevels);
        summary.TotalWithoutFees = this.calculateTotal(
          [
            100,
            150,
            200,
            250,
            280,
            290,
            300,
            400,
            410,
            500,
            520,
            540,
            560,
            600,
            650,
            700
          ],
          costLevels
        );
        summary.TotalWithoutProfit = this.calculateTotal(
          [
            100,
            150,
            200,
            250,
            280,
            290,
            300,
            400,
            410,
            500,
            520,
            540,
            560,
            600,
            650,
            700,
            800,
            820,
            840,
            850
          ],
          costLevels
        );
        summary.TotalWithFees = this.calculateTotal(
          [
            100,
            150,
            200,
            250,
            280,
            290,
            300,
            400,
            410,
            500,
            520,
            540,
            560,
            600,
            650,
            700,
            800,
            820,
            840,
            850,
            860,
            880
          ],
          costLevels
        );
        summary.TotalWithoutTax = this.calculateTotal(
          [
            100,
            150,
            200,
            250,
            280,
            290,
            300,
            400,
            500,
            520,
            540,
            560,
            600,
            650,
            700,
            800,
            820,
            840,
            850,
            860,
            880
          ],
          costLevels
        );
        summary.TotalWithTax = this.calculateTotal(
          [
            100,
            150,
            200,
            250,
            280,
            290,
            300,
            400,
            500,
            520,
            540,
            560,
            600,
            650,
            700,
            800,
            820,
            840,
            850,
            860,
            880,
            900
          ],
          costLevels
        );
        //Added the below totals for CDF/AES Report
        summary.TotalPayrollBenefits = this.calculateTotal(
          [200, 250, 280, 290, 300, 400, 410],
          costLevels
        );
        summary.TotalPayrollBenefitsCosts = this.calculateTotal(
          [100, 150, 200, 250, 280, 290, 300, 400, 410],
          costLevels
        );
        resolve(summary);
      });
    });
  }

  private calculateGrossProfit(loc: CDFLocation) {
    let bid_WC: number = 0;
    let actual_WC: number = 0;
    let bid_GL: number = 0;
    let actual_GL: number = 0;
    let StopsPlus: number = 0;
    let NonUnionMarkUp: number = 0;
    let bid_Payroll: number = 0;
    let actual_Payroll: number = 0;
    let sseProfit: number = 0;
    let Fees: number = 0;

    if (loc.Costs) {
      loc.Costs.forEach((cost: CDFLocationCost) => {
        if (cost.Cost.Name == "Worker's Comp") {
          bid_WC += cost.Total ? cost.Total : 0;
          actual_WC += cost.Actual_Total ? cost.Actual_Total : 0;
        }

        if (cost.Cost.Name == "General Liability") {
          bid_GL += cost.Total ? cost.Total : 0;
          actual_GL += cost.Actual_Total ? cost.Actual_Total : 0;
        }

        if (cost.Cost.CostType.Value == "Fees") {
          Fees += cost.Total ? cost.Total : 0;
        }
      });
    }
    if (loc.SSEs) {
      loc.SSEs.forEach((sse: CDFLocationSSE) => {
        sseProfit += sse.Value * (sse.Markup / 100);
      });
    }

    if (loc.Taxes) {
      loc.Taxes.forEach((tax: CDFLocationTax) => {
        if (tax.Type.Value == "Stops Plus") {
          StopsPlus += tax.Amount ? tax.Amount : 0;
        }
      });
    }

    if (loc.Markup) {
      loc.Staff.forEach((staff: Staff) => {
        if (staff.NonUnion_Benefits.length > 0) {
          staff.NonUnion_Benefits.forEach((benefit: StaffNonUnionBenefit) => {
            NonUnionMarkUp +=
              (benefit.Contribution - benefit.Rate) * staff.NumEmployees;
          });
        }
      });
    }

    let payrollProcessing = loc.Summary
      ? loc.Summary.TotalPayrollProcessing
      : 0;
    let payrollProcessingActual = loc.Summary
      ? loc.Summary.TotalPayrollProcessingActual
      : 0;

    return (
      bid_WC -
      actual_WC +
      (bid_GL - actual_GL) +
      StopsPlus +
      NonUnionMarkUp +
      (payrollProcessing - payrollProcessingActual) +
      Fees +
      sseProfit
    );
  }

  private calculateTotal(
    levels: number[],
    costs: LevelCost[],
    type?: string,
    shift?: string,
    actual?: Boolean
  ) {
    let sum: number = 0;

    if (costs) {
      costs.forEach((cost: LevelCost) => {
        if (levels.indexOf(cost.Level) != -1) {
          if (shift) {
            if (shift == cost.Shift) {
              if (actual) sum += cost.Actual ? cost.Actual : 0;
              else sum += cost.Value ? cost.Value : 0;
            }
          } else if (type) {
            if (shift == cost.Type) {
              if (actual) sum += cost.Actual ? cost.Actual : 0;
              else sum += cost.Value ? cost.Value : 0;
            }
          } else {
            if (actual) sum += cost.Actual ? cost.Actual : 0;
            else sum += cost.Value ? cost.Value : 0;
          }
        }
      });
    }

    return sum;
  }

  public recalculateCosts(loc: CDFLocation, weeks?: number) {
    loc.Costs.forEach(c => {
      let type = c.Cost.Name;
      let newValue = this.calculateCost(
        loc,
        c.PricingMethod.Value,
        c.Value,
        weeks
      );

      c.Total = newValue;

      if (c.Actual_Value) {
        c.Actual_Total = this.calculateCost(
          loc,
          c.PricingMethod.Value,
          c.Actual_Value,
          weeks
        );
      } else {
        c.Actual_Value = c.Value;
        c.Actual_Total = newValue;
      }
    });
  }

  public calculateCost(
    loc: CDFLocation,
    method: string,
    value: number,
    weeks?: number,
    months?: number
  ) {
    let amount: number = 0;

    switch (method) {
      case "Cost per Union Head Count":
        amount = this.getUnionEmployeeCount(loc) * value;
        break;
      case "Cost per non-Union Head Count":
        amount = this.getNonUnionEmployeeCount(loc) * value;
        break;
      case "Cost per Head Count":
        amount = this.getTotalEmployeeCount(loc) * value;
        break;
      case "Cost per Gross Square Foot":
        amount = value * loc.BuildSqFt;
        break;
      case "Cost per Rentable Square Foot":
        amount = value * loc.RentableSqFt;
        break;
      case "Cost per Common Area Square Foot":
        amount = value * loc.CommonSqFt;
        break;
      case "Cost per Cleanable Square Foot":
        amount = value * loc.CleanableSqFt;
        break;
      case "Lump Sum":
        amount = value;
        break;
      case "Cost per Man Hour":
        amount = this.getDailyHourTotal(loc) * weeks * value;
        break;
      case "% of Base Labor":
        amount = loc.Summary.BaseWages * (value / 100);
        break;
      case "% of Total Labor":
        amount = loc.Summary.TotalLabor * (value / 100);
        break;
      case "% of Total Union Labor":
        amount = loc.Summary.TotalUnionLabor * (value / 100);
        break;
      case "% of Total Non-Union Labor":
        amount = loc.Summary.TotalNonUnionLabor * (value / 100);
        break;
      case "% of Total Bid (excl fees)":
        amount = loc.Summary.TotalWithoutFees * (value / 100);
        break;
      case "% of Total Bid (excl profit, discount)":
        amount = loc.Summary.TotalWithoutProfit * (value / 100);
        break;
      case "% of Total Bid (incl fees)":
        amount = loc.Summary.TotalWithFees * (value / 100);
        break;
      case "% of Total Bid":
        amount = loc.Summary.TotalWithTax * (value / 100);
        break;
      case "Lump Sum":
        amount = value;
        break;
      case "Depreciate Monthly":
        amount = value / months;
        break;
      case "Cost Per Night Shift Head Count":
        amount = this.getNightShiftEmployeeCount(loc) * value;
        break;
      case "Cost Per Day Shift Head Count":
        amount = this.getDayShiftEmployeeCount(loc) * value;
        break;
      default:
        break;
    }

    return amount;
  }

  public getUnionEmployeeCount(loc: CDFLocation) {
    let sum = 0;

    if (loc.Staff) {
      for (let x of loc.Staff) {
        if (x.LaborType.Value == "Union") {
          sum += x.NumEmployees;
        }
      }
    }

    return sum;
  }

  public getUnionLabor(loc: CDFLocation, weeks: number) {
    let sum = 0;

    if (loc.Staff) {
      for (let x of loc.Staff) {
        if (x.LaborType.Value == "Union") {
          sum += x.DailyHours * x.NumEmployees * x.DaysPerWeek * x.Rate * weeks;
        }
      }
    }

    return sum;
  }

  public getNonUnionEmployeeCount(loc: CDFLocation) {
    let sum = 0;

    if (loc.Staff) {
      for (let x of loc.Staff) {
        if (x.LaborType.Value == "Non-Union") {
          sum += x.NumEmployees;
        }
      }
    }

    return sum;
  }

  public getNightShiftEmployeeCount(loc: CDFLocation) {
    let sum = 0;

    if (loc.Staff) {
      for (let x of loc.Staff) {
        if (x.Shift.Value == "Night Shift") {
          sum += x.NumEmployees;
        }
      }
    }
    return sum;
  }

  public getDayShiftEmployeeCount(loc: CDFLocation) {
    let sum = 0;

    if (loc.Staff) {
      for (let x of loc.Staff) {
        if (x.Shift.Value == "Day Shift") {
          sum += x.NumEmployees;
        }
      }
    }
    return sum;
  }

  public getNonUnionLabor(loc: CDFLocation, weeks: number) {
    let sum = 0;

    if (loc.Staff) {
      for (let x of loc.Staff) {
        if (x.LaborType.Value == "Non-Union") {
          sum += x.DailyHours * x.NumEmployees * x.DaysPerWeek * x.Rate * weeks;
        }
      }
    }

    return sum;
  }

  public getTotalEmployeeCount(loc: CDFLocation) {
    let sum = 0;

    if (loc.Staff) {
      for (let x of loc.Staff) {
        sum += x.NumEmployees;
      }
    }

    return sum;
  }

  public getProductivityRateHourTotal(loc: CDFLocation) {
    let sum = 0;

    if (loc.Staff) {
      for (let x of loc.Staff) {
        if (x.ProductionRate == true) sum += x.DailyHours * x.NumEmployees;
      }
    }

    return sum;
  }

  public getDailyHourTotal(loc: CDFLocation) {
    let sum = 0;

    if (loc.Staff) {
      for (let x of loc.Staff) {
        sum += x.DailyHours * x.NumEmployees;
      }
    }

    return sum;
  }

  public getMonthlyStaffingCost(loc: CDFLocation, weeks: number) {
    let sum = 0;
    if (loc.Staff) {
      for (let x of loc.Staff) {
        sum += x.DailyHours * x.NumEmployees * x.DaysPerWeek * x.Rate * weeks;
      }
    }

    return sum;
  }

  public sumMonthlyCosts(loc: CDFLocation, weeks: number) {
    let total = 0;

    if (loc.Costs) {
      for (let cost of loc.Costs) {
        total += cost.Total;
      }
    }

    return total;
  }

  public sumMonthlyHours(loc: CDFLocation) {
    let sum = 0;

    if (loc.Staff) {
      for (let x of loc.Staff) {
        sum += x.DailyHours * x.DaysPerWeek * x.NumEmployees;
      }
    }

    return sum;
  }

  public sumUnionBenefits(loc: CDFLocation) {
    let total = 0;

    if (loc.Staff) {
      loc.Staff.forEach(staff => {
        if (staff.AES_Benefits && staff.AES_Benefits.length > 0) {
          staff.AES_Benefits.forEach(benefit => {
            if (benefit.Active)
              total += benefit.Contribution * staff.NumEmployees;
          });
        }

        if (staff.CBM_Benefits && staff.CBM_Benefits.length > 0) {
          staff.CBM_Benefits.forEach(benefit => {
            if (benefit.Active)
              total += benefit.Contribution * staff.NumEmployees;
          });
        }
      });
    }

    return total;
  }

  public calulateTotalsByCategory(
    loc: CDFLocation,
    val: string,
    period?: string
  ) {
    if (loc.Costs) {
      let data = this.groupBy.transform(loc.Costs, "Cost.CostType.Value");
      let sum: number = 0;

      if (data[val]) {
        data[val].forEach(element => {
          sum += this.calculateCost(
            loc,
            element.PricingMethod.Value,
            element.Value
          );
        });
      }

      return sum ? sum : 0;
    } else return 0;
  }

  public sumMonthlyTaxes(loc: CDFLocation) {
    let total = 0;

    if (loc.Taxes) {
      loc.Taxes.forEach(tax => {
        total += tax.Amount;
      });
    }

    return total;
  }

  public summaryTotals(loc: CDFLocation, weeks: number): LocationSummary {
    let summary = new LocationSummary();

    // summary = this.getLocationTotals(loc, weeks);

    return summary;
  }
}
