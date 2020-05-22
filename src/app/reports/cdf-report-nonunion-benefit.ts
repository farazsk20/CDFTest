import { RateType } from "../_models/rate-type";
import { NonUnionBenefit } from "../_models/non-union-benefit";
import { Staff } from "../_models/staff";

export class CDFReportNonUnionBenefit{
    Id: number;
    Rate: number;
    Contribution: number;
    Actual_Contribution: number;
    Override: boolean;
    RateType: RateType;
    NonUnionBenefit: NonUnionBenefit;
    Staff:Staff;
}