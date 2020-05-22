import { Location } from "./location";
import { User } from "./user";
import { CDFLocation } from "./cdflocation";
import { Company } from "./company";
import { ContractType } from "./contract-type";
import { IndustryService } from "../_services/industry.service";
import { Industry } from "./industry";

export class CDF {
  Id: number;
  Title: string;
  Locations: CDFLocation[];
  LocationCount: number;
  SubmissionDate: Date;
  ContractExecutionDate: Date;
  ContractStartDate: Date;
  ContractEndDate: Date;
  WeekPerMonth: number;
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
  UserId: number;
  Company: Company;
  CustomerName: string;
  JobNumber: string;
  SalesLead: string;
  PricingLead: string;
  ContractType: ContractType;
  Industry: Industry;
  WeeksPerMonth: number;
}
