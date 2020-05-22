import { CostType } from "./cost-type";
import { PricingMethod } from "./pricing-method";
import { Actual } from "./actual";
import { CostPricingMethod } from "./cost-pricing-method";
import { CostLevel } from "./cost-level";

export class Cost {
  Id: number;
  Name: string;
  CostType: CostType;
  DefaultValue: Number;
  MaxLimit: Number;
  Required: Boolean;
  PricingMethod: PricingMethod;
  Actuals: Actual[];
  CostPricingMethods: CostPricingMethod[];
  Level: CostLevel;

}
