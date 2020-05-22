import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Staff } from "../_models/Staff";
import * as moment from "moment";
import { AES_Union } from "../_models/AES_Union";
import { StaffAESBenefit } from "../_models/staff-aes-benefit";
import { CBM_Union } from "../_models/CBM_Union";
import { CBM_Rate } from "../_models/CBM_Rate";
import { StaffCBMBenefit } from "../_models/staff-cbm-benefit";
import { RateType } from "../_models/rate-type";
import { StaffNonUnionBenefit } from "../_models/staff-non-union-benefit";
import { CDFLocation } from "../_models/cdflocation";
import { AES_UnionBenefit } from "../_models/AES_UnionBenefit";
import { NonUnionBenefit } from "../_models/non-union-benefit";

@Injectable({
  providedIn: "root"
})
export class StaffService {
  constructor(private http: HttpClient) {}

  Get(id: number) {
    return this.http.get(`${environment.apiEndpoint}/Staff/${id}`);
  }

  GetCDFStaff(id: number) {
    return this.http.get(`${environment.apiEndpoint}/GetCDFStaff/${id}`);
  }

  Post(staff: Staff) {
    return this.http.post(`${environment.apiEndpoint}/Staff`, staff);
  }

  Put(staff: Staff) {
    return this.http.put(`${environment.apiEndpoint}/Staff/${staff.Id}`, staff);
  }

  getAES_UnionBenefits(
    staff: Staff,
    union: AES_Union,
    weeks: number,
    startDate: Date,
    endDate
  ) {
    let benefits: StaffAESBenefit[];

    let monthlyHrs = this.calculateHours(staff, weeks);
    let contribution: number;
    let rate: number;
    let now = moment().format("L");
    let contractBeginDate = moment(startDate).format("L");
    let contractEndDate = moment(endDate).format("L");

    if (!staff.AES_Benefits) staff.AES_Benefits = [];

    union.AES_Benefits.forEach(benefit => {
      let EffectiveDate = moment(benefit.EffectiveDate).format("L");
      let ExpirationDate = moment(benefit.ExpirationDate).format("L");

      // if (moment(EffectiveDate).isBetween(contractBeginDate, contractEndDate)) {
      if (
        (moment(EffectiveDate).isValid() &&
          moment(EffectiveDate).isSameOrAfter(contractBeginDate) &&
          moment(EffectiveDate).isSameOrBefore(contractEndDate)) ||
        (moment(EffectiveDate).isValid() &&
          moment(ExpirationDate).isValid() &&
          moment(EffectiveDate).isBefore(contractBeginDate) &&
          moment(ExpirationDate).isAfter(contractBeginDate)) ||
        (moment(EffectiveDate).isValid() &&
          !moment(ExpirationDate).isValid() &&
          moment(EffectiveDate).isSameOrBefore(contractBeginDate))
      ) {
        let newBenefit = new StaffAESBenefit();
        newBenefit.AES_UnionBenefit = benefit;
        newBenefit.EffectiveDate = benefit.EffectiveDate;
        newBenefit.ExpirationDate = benefit.ExpirationDate;
        newBenefit.Rate = benefit.Rate;
        newBenefit.Type = benefit.Type;
        newBenefit.PricingMethod = benefit.PricingMethod;
        newBenefit.Override = benefit.Override;
        newBenefit.QualifyingHours = benefit.QualifyingHours;
        newBenefit.FullContribution = benefit.FullContribution;
        newBenefit.MinContribution = benefit.MinContribution;

        switch (newBenefit.PricingMethod.Value) {
          case "PctGross":
            rate = benefit.FullContribution;
            contribution = monthlyHrs * staff.Rate * benefit.FullContribution;
            break;
          case "Hour_OT":
          case "Hour_DT":
          case "Manual":
          case "HourPremium_All":
            contribution = 0;
            rate = 0;
            break;
          case "Flat_Reg":
          case "Flat_All":
            if (newBenefit.Override) {
              contribution = newBenefit.Rate;
              rate = newBenefit.Rate;
            } else {
              if (monthlyHrs >= newBenefit.QualifyingHours) {
                contribution = newBenefit.FullContribution;
                rate = newBenefit.FullContribution;
              } else {
                contribution = newBenefit.MinContribution;
                rate = newBenefit.MinContribution;
              }
            }
            break;
          case "Flat_Week_All":
            rate = newBenefit.FullContribution;
            contribution = rate * weeks;
            break;
          case 'HourCap_Reg':
            if (benefit.Override) {
              contribution = benefit.Rate * monthlyHrs;
              rate = benefit.Rate;
            }
            else {
              if (monthlyHrs >= benefit.QualifyingHours) {
                contribution = benefit.FullContribution * monthlyHrs;
                rate = benefit.FullContribution;
              }
              else {
                contribution = benefit.MinContribution * monthlyHrs;
                rate = benefit.MinContribution * monthlyHrs;
              }
            }
            break;
          case "Hour_Reg":
          case "Hour_All":
          case "HourCap_All":
            if (benefit.Override) {
              contribution = newBenefit.Rate * monthlyHrs;
              rate = newBenefit.Rate;
            } else {
              if (monthlyHrs >= newBenefit.QualifyingHours) {
                contribution = newBenefit.FullContribution * monthlyHrs;
                rate = newBenefit.FullContribution;
              } else {
                contribution = newBenefit.MinContribution * monthlyHrs;
                rate = newBenefit.MinContribution;
              }
            }
            break;
          default:
            break;
        }

        newBenefit.Contribution = contribution;
        newBenefit.Rate = rate;

        if (
          moment(EffectiveDate).isValid() &&
          ((moment(ExpirationDate).isValid() &&
            moment(contractBeginDate).isSameOrAfter(EffectiveDate) &&
            moment(contractBeginDate).isSameOrBefore(ExpirationDate)) ||
            (moment(contractBeginDate).isSameOrAfter(EffectiveDate) &&
              !moment(ExpirationDate).isValid()))
        ) {
          newBenefit.Active = true;
        } else {
          newBenefit.Active = false;
        }

        if (!benefits) benefits = [];

        benefits.push(newBenefit);
      }
    });

    return benefits;
  }

  AddNonUnionBenefit(staff: Staff, loc: CDFLocation) {
    let benefits: StaffNonUnionBenefit[];
    let benefit: StaffNonUnionBenefit = new StaffNonUnionBenefit();
    benefit.NonUnionBenefit = loc.NonUnionBenefit;

    switch (staff.HWStatus.Value) {
      case "EE":
        benefit.Rate = benefit.NonUnionBenefit.EE_Rate;
        break;
      case "EE+1":
        benefit.Rate = benefit.NonUnionBenefit.EE_1_Rate;
        break;
      case "Family":
        benefit.Rate = benefit.NonUnionBenefit.Family_Rate;
        break;
    }

    benefit.Contribution = benefit.Rate * (1 + loc.Markup / 100);

    if (benefits) benefits.push(benefit);
    else benefits = [benefit];

    return benefits;
  }

  getCBM_UnionBenefits(
    staff: Staff,
    union: CBM_Union,
    weeks: number,
    startDate: Date,
    endDate: Date
  ) {
    let benefits: StaffCBMBenefit[];

    let now = moment().format("L");
    let contractBeginDate = moment(startDate).format("L");
    let contractEndDate = moment(endDate).format("L");

    if (!staff.CBM_Benefits) staff.CBM_Benefits = [];

    union.DeductionGroup.Rates.forEach(rate => {
      let rateNum: number;
      let rateType: RateType;
      let EffectiveDate = moment(rate.EffectiveDate).format("L");
      let ExpirationDate = moment(rate.ExpirationDate).format("L");
      let newBenefit = new StaffCBMBenefit();

      newBenefit.CBM_Rate = rate;
      newBenefit.EffectiveDate = rate.EffectiveDate;
      newBenefit.ExpirationDate = rate.ExpirationDate;

      if (
        (moment(EffectiveDate).isValid() &&
          moment(EffectiveDate).isSameOrAfter(contractBeginDate) &&
          moment(EffectiveDate).isSameOrBefore(contractEndDate)) ||
        (moment(EffectiveDate).isValid() &&
          moment(ExpirationDate).isValid() &&
          moment(EffectiveDate).isBefore(contractBeginDate) &&
          moment(ExpirationDate).isAfter(contractBeginDate)) ||
        (moment(EffectiveDate).isValid() &&
          !moment(ExpirationDate).isValid() &&
          moment(EffectiveDate).isSameOrBefore(contractBeginDate))
      ) {
        switch (rate.BenefitType.Value) {
          case "HandW":
            if (staff.HWStatus.Value == "EE") {
              // Single
              newBenefit.RateNumber = union.HW_FT_Single;
              newBenefit.RateType = union.HW_FT_RateType;
              newBenefit.CBM_Rate_Type = union.HW_FT_RateType;
            } else {
              // Not Single
              newBenefit.RateNumber = union.HW_FT_Family;
              newBenefit.RateType = union.HW_FT_RateType;
              newBenefit.CBM_Rate_Type = union.HW_FT_RateType;
            }

            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );
            break;
          case "Pension":
            newBenefit.RateNumber = union.Pension;
            newBenefit.RateType = union.Pension_RateType;
            newBenefit.CBM_Rate_Type = union.Pension_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "Training":
            newBenefit.RateNumber = union.Training;
            newBenefit.RateType = union.Training_RateType;
            newBenefit.CBM_Rate_Type = union.Training_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "MCTF":
            newBenefit.RateNumber = union.MCTF;
            newBenefit.RateType = union.MCTF_RateType;
            newBenefit.CBM_Rate_Type = union.MCTF_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "LTEF":
            newBenefit.RateNumber = union.LTEF;
            newBenefit.RateType = union.LTEF_RateType;
            newBenefit.CBM_Rate_Type = union.LTEF_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "LTTF":
            newBenefit.RateNumber = union.LTTF;
            newBenefit.RateType = union.LTTF_RateType;
            newBenefit.CBM_Rate_Type = union.LTTF_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "Legal":
            newBenefit.RateNumber = union.Legal;
            newBenefit.RateType = union.Legal_RateType;
            newBenefit.CBM_Rate_Type = union.Legal_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "Annuity":
            newBenefit.RateNumber = union.Annuity;
            newBenefit.RateType = union.Annuity_RateType;
            newBenefit.CBM_Rate_Type = union.Annuity_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "Life":
            newBenefit.RateNumber = union.Life;
            newBenefit.RateType = union.Life_RateType;
            newBenefit.CBM_Rate_Type = union.Life_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "401K":
            newBenefit.RateNumber = union._401K;
            newBenefit.RateType = union._401K_RateType;
            newBenefit.CBM_Rate_Type = union._401K_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "SuppHW":
            newBenefit.RateNumber = union.SuppHW;
            newBenefit.RateType = union.SuppHW_RateType;
            newBenefit.CBM_Rate_Type = union.SuppHW_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "Retirement":
            newBenefit.RateNumber = union.Retirement;
            newBenefit.RateType = union.Retirement_RateType;
            newBenefit.CBM_Rate_Type = union.Retirement_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          case "Industry":
            newBenefit.RateNumber = union.Industry;
            newBenefit.RateType = union.Industry_RateType;
            newBenefit.CBM_Rate_Type = union.Industry_RateType;
            newBenefit.Rate = this.getRate(newBenefit.RateNumber, rate);

            newBenefit.Contribution = this.calculateRate(
              newBenefit.Rate,
              newBenefit.RateType.Value,
              staff,
              weeks
            );

            break;
          default:
            break;
        }

        newBenefit.BenefitType = rate.BenefitType;
        newBenefit.CBM_Rate = rate;

        if (
          moment(EffectiveDate).isValid() &&
          ((moment(ExpirationDate).isValid() &&
            moment(contractBeginDate).isSameOrAfter(EffectiveDate) &&
            moment(contractBeginDate).isSameOrBefore(ExpirationDate)) ||
            (moment(contractBeginDate).isSameOrAfter(EffectiveDate) &&
              !moment(ExpirationDate).isValid()))
        ) {
          newBenefit.Active = true;
        } else {
          newBenefit.Active = false;
        }

        if (!benefits) benefits = [];

        benefits.push(newBenefit);
      }
    });

    return benefits;
  }

  calculateNonUnionTotal(rate: number, staff: Staff, markUp: number): number {
    return rate * (1 + markUp / 100);
  }

  calculateAESBenefit(
    benefit: AES_UnionBenefit,
    newStaff: Staff,
    weeks: number
  ) {
    let monthlyHrs = this.calculateHours(newStaff, weeks);
    let contribution: number;
    let rate: number;

    if (benefit.PricingMethod && benefit.Type) {
      switch (benefit.PricingMethod.Value) {
        case "PctGross":
          rate = benefit.FullContribution;
          contribution = monthlyHrs * newStaff.Rate * benefit.FullContribution;
          break;
        case "Hour_OT":
        case "Hour_DT":
        case "Manual":
        case "HourPremium_All":
          contribution = 0;
          rate = 0;
          break;
        case "Flat_Reg":
        case "Flat_All":
          if (benefit.Override) {
            contribution = benefit.Rate;
            rate = benefit.Rate;
          } else {
            if (monthlyHrs >= benefit.QualifyingHours) {
              contribution = benefit.FullContribution;
              rate = benefit.FullContribution;
            } else {
              contribution = benefit.MinContribution;
              rate = benefit.MinContribution;
            }
          }
          break;
        case "HourCap_Reg":
          if (benefit.Override) {
            contribution = benefit.Rate * monthlyHrs;
            rate = benefit.Rate;
          } else {
            if (monthlyHrs >= benefit.QualifyingHours) {
              contribution = benefit.FullContribution ;
              rate = benefit.FullContribution;
            } else {
              contribution = benefit.MinContribution * monthlyHrs;
              rate = benefit.MinContribution * monthlyHrs;
            }
          }
          break;
        case "Hour_Reg":
        case "Hour_All":
        case "HourCap_All":
          if (benefit.Override) {
            contribution = benefit.Rate * monthlyHrs;
            rate = benefit.Rate;
          } else {
            if (monthlyHrs >= benefit.QualifyingHours) {
              contribution = benefit.FullContribution * monthlyHrs;
              rate = benefit.FullContribution;
            } else {
              contribution = benefit.MinContribution * monthlyHrs;
              rate = benefit.MinContribution;
            }
          }
          break;
        default:
          break;
      }

      benefit.Contribution = contribution;
      benefit.Rate = rate;

      return benefit;
    } else {
      return null;
    }
  }

  calculateCBMRate(
    Rate: number,
    RateType: string,
    Staff: Staff,
    weeks: number
  ) {
    let MonthlyHours = this.calculateHours(Staff, weeks);

    if (RateType == "Hourly") return Rate * MonthlyHours;
    else if (RateType == "Weekly") return Rate * weeks;
    else return Rate;
  }

  getRate(rateNum: number, rate: CBM_Rate): number {
    let myRate: number;

    switch (rateNum) {
      case 1:
        myRate = rate.Rate_1;
        break;
      case 2:
        myRate = rate.Rate_2;
        break;
      case 3:
        myRate = rate.Rate_3;
        break;
      case 4:
        myRate = rate.Rate_4;
        break;

      default:
        myRate = 0;
        break;
    }

    return myRate ? myRate : 0;
  }

  calculateRate(Rate: number, RateType: string, Staff: Staff, weeks: number) {
    let MonthlyHours = this.calculateHours(Staff, weeks);

    if (RateType == "Hourly") return Rate * MonthlyHours;
    else if (RateType == "Weekly") return Rate * weeks;
    else return Rate;
  }

  calculateHours(staff: Staff, weeksPerMonth: number) {
    return staff.DailyHours * staff.DaysPerWeek * weeksPerMonth;
  }
}
