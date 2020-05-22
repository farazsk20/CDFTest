import { BenefitType } from "../_models/benefit-type";
import { PricingMethod } from "../_models/pricing-method";
import { AES_UnionBenefit } from "../_models/AES_UnionBenefit";
import { Staff } from "../_models/staff";

export class CDFReportAESBenefit{
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
    Staff: Staff;
}