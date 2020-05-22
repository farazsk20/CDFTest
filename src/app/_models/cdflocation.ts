import { StopFlag } from "./stop-flag";
import { Location } from "./location";
import { Staff } from "./staff";
import { CDFLocationCost } from "./cdflocation-cost";
import { CDF } from "./cdf";
import { LOS } from "./los";
import { AES_Union } from "./AES_Union";
import { CBM_Union } from "./CBM_Union";
import { NonUnionBenefit } from "./non-union-benefit";
import { CDFLocationTax } from "./cdflocation-tax";
import { LocationSummary } from "./location-summary";
import { CDFLocationSSE } from "./cdflocation-sse";

export class CDFLocation {
  public constructor(init?: Partial<CDFLocation>) {
    Object.assign(this, init);
  }

  Id: number;
  Location: Location;
  SalesLead: string;
  PricingLead: string;
  BuildSqFt: number;
  RentableSqFt: number;
  CommonSqFt: number;
  CleanableSqFt: number;
  VacantSqFt: number;
  VacancyCredit: number;
  TaxRate: number;
  ProductivityRate: number;
  AES_Union: AES_Union;
  CBM_Union: CBM_Union;
  StopFlag: StopFlag;
  Months: number;
  Staff: Staff[];
  Costs: CDFLocationCost[];
  Taxes: CDFLocationTax[];
  SSEs: CDFLocationSSE[];
  LOS: LOS;
  CDF: CDF;
  CDF_Id: number;
  NonUnionBenefit: NonUnionBenefit;
  NonUnionRate: number;
  Other_NonUnion: number;
  Markup: number;
  Note: string;
  Summary: LocationSummary;
}
