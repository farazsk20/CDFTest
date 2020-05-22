import { CBM_Rate } from "./CBM_Rate";
import { BenefitType } from "./benefit-type";
import { RateType } from "./rate-type";

export class StaffCBMBenefit extends CBM_Rate {

  Id: number;
  BenefitType: BenefitType;
  EffectiveDate: Date;
  ExpirationDate: Date;
  RateType: RateType;
  Contribution: number;
  Actual_Contribution: number;
  Override: boolean;
  RateNumber: number;
  Rate: number;
  Added: boolean;
  CBM_Rate: CBM_Rate;
  CBM_Rate_Type: RateType;
  Active: boolean;
}
