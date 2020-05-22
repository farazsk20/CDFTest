import { TaxType } from './tax-type';
import { Tax } from "./tax";
import { StopFlag } from "./stop-flag";

export class CDFLocationTax {
  Id: number;
  ZipCode: string;
  State: string;
  Tax: Tax;
  Type: TaxType;
  Amount: number;
  Rate: number;
  Limit: number;
  EffectiveDate: Date;
  EndingDate: Date;
  Override: Boolean;
  Added: Boolean;
}
