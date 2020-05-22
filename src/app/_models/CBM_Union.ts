import { BenefitType } from "./benefit-type";
import { PricingMethod } from "./pricing-method";
import { RateType } from "./rate-type";
import { CBM_Rate } from "./CBM_Rate";
import { CBMDeducationGroup } from "./cbm-deducation-group";

export class CBM_Union {
  Id: number;
  Name: string;
  Code: string;
  HW_PT_Single: number;
  HW_PT_Family: number;
  HW_PT_RateType: RateType;
  HW_FT_Single: number;
  HW_FT_Family: number;
  HW_FT_RateType: RateType;
  Pension: number;
  Pension_RateType: RateType;
  Training: number;
  Training_RateType: RateType;
  MCTF: number;
  MCTF_RateType: RateType;
  LTEF: number;
  LTEF_RateType: RateType;
  LTTF: number;
  LTTF_RateType: RateType;
  Legal: number;
  Legal_RateType: RateType;
  Annuity: number;
  Annuity_RateType: RateType;
  Life: number;
  Life_RateType: RateType;
  _401K: number;
  _401K_RateType: RateType;
  SuppHW: number;
  SuppHW_RateType: RateType;
  Retirement: number;
  Retirement_RateType: RateType;
  Industry: number;
  Industry_RateType: RateType;

  DeductionGroup: CBMDeducationGroup;


}
