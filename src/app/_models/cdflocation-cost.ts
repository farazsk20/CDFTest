import { PricingMethod } from "./pricing-method";
import { Cost } from "./cost";
import { CDFLocation } from "./cdflocation";

export class CDFLocationCost {
  Id: number;
  FromDate: Date;
  ToDate: Date;
  PricingMethod: PricingMethod;
  Cost: Cost;
  Value: number;
  Actual_Value: number;
  Location: CDFLocation;
  Location_Id: number;
  Total: number;
  Actual_Total: number;
}
