import { Lookup } from "./lookup";
import { CostPricingMethod } from "./cost-pricing-method";

export class PricingMethod extends Lookup {
  Type: string
  CostPricingMethods: CostPricingMethod[];
}
