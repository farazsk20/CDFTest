import { RateType } from "./rate-type";

export class NonUnionBenefit {
  Id: number;
  Code: string;
  EE_Rate: number;
  EE_1_Rate: number;
  Family_Rate: number;
  RateType: RateType;
}
