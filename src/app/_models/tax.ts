import { Area } from "./area";
import { TaxType } from "./tax-type";
import { StopFlag } from "./stop-flag";

export class Tax {
  Id: number;
  ZipCode: string;
  State: string;
  Area: Area;
  Rate: number;
  Limit: number;
  EffectiveDate: Date;
  EndingDate: Date;
  Type: TaxType;
  Required: Boolean;
  PayrollTax: Boolean;
  StopFlag: StopFlag;
}
