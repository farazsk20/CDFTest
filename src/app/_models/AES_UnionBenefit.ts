import { BenefitType } from "./benefit-type";
import { PricingMethod } from "./pricing-method";

export class AES_UnionBenefit {
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
  Override: boolean;
  RateNumber: number;
  Rate: number;
}
