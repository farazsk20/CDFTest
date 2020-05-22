import { CBM_Rate } from "../_models/CBM_Rate";
import { BenefitType } from "../_models/benefit-type";
import { RateType } from "../_models/rate-type";
import { Staff } from "../_models/staff";

export class CDFReportCBMBenefit extends CBM_Rate{
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
    Staff: Staff;
}