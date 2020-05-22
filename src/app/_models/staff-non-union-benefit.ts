import { NonUnionBenefit } from "./non-union-benefit";
import { RateType } from "./rate-type";

export class StaffNonUnionBenefit {
  Id: number;
  Rate: number;
  Contribution: number;
  Actual_Contribution: number;
  Override: boolean;
  RateType: RateType;
  NonUnionBenefit: NonUnionBenefit;
}
