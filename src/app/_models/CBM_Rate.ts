import { BenefitType } from "./benefit-type";
import { PricingMethod } from "./pricing-method";
import { RateType } from "./rate-type";

export class CBM_Rate {
  Id: number;
  BenefitType: BenefitType;
  EffectiveDate: Date;
  ExpirationDate: Date;
  Rate_1: number;
  Rate_2: number;
  Rate_3: number;
  Rate_4: number;
  Plan_1: string;
  Plan_2: string;
  Plan_3: string;
  Plan_4: string;
  RateType: RateType;
  Contribution: number;
  Override: boolean;
  RateNumber: number;
  Rate: number;
  Added: boolean;
}
