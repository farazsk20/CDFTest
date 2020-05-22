import { AES_UnionBenefit } from "./AES_UnionBenefit";
import { BenefitType } from "./benefit-type";
import { PricingMethod } from "./pricing-method";

export class StaffAESBenefit {
  Id: number;
  Type: BenefitType;
  PricingMethod: PricingMethod;
  QualifyingHours: number;
  MinContribution: number;
  FullContribution: number;
  EffectiveDate: Date;
  ExpirationDate: Date;
  Comments: string;
  Contribution: number;
  Actual_Contribution: number;
  Override: boolean;
  RateNumber: number;
  Rate: number;
  AES_UnionBenefit: AES_UnionBenefit;
  Added: boolean;
  Active: boolean;
}
