import { PropertyBindingType } from "@angular/compiler";
import { Region } from "./region";
import { PropertyType } from "./property-type";

export class Location {
  Id: number;
  Name: string;
  Region: Region;
  PropertyType: PropertyType;
  Address: string;
  Address2: string;
  City: string;
  State: string;
  ZipCode: string;
  SalesLead: string;
  PricingLead: string;
  BuildSqFt: number;
  RentableSqFt: number;
  CommonSqFt: number;
  CleanableSqFt: number;
  VacantSqFt: number;
  VacancyCredit: number;
}
