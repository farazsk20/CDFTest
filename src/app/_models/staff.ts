import { JobClassification } from "./job-classification";
import { CDFLocation } from "./cdflocation";
import { Shift } from "./shift";
import { HWStatus } from "./hw-status";
import { LaborType } from "./labor-type";
import { StaffAESBenefit } from "./staff-aes-benefit";
import { StaffCBMBenefit } from "./staff-cbm-benefit";
import { StaffNonUnionBenefit } from "./staff-non-union-benefit";
import { StaffRate } from "./staff-rate";

export class Staff {
  Id: number;
  NumEmployees: number;
  Actual_NumEmployees: number;
  DailyHours: number;
  DaysPerWeek: number;
  Rate: number;
  ProductionRate: boolean;
  LaborType: LaborType;
  HWStatus: HWStatus;
  Shift: Shift;
  Classification: JobClassification;
  CDFLocation: CDFLocation;
  CDFLocation_Id: number;
  AES_Benefits: StaffAESBenefit[];
  CBM_Benefits: StaffCBMBenefit[];
  NonUnion_Benefits: StaffNonUnionBenefit[];
  Rates: StaffRate[];
  JobDescription: string;
}
