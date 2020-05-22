import { SSEType } from "./sse-type";
import { SSECategory } from "./sse-category";
import { ContractTerm } from "./contract-term";
import { ContractType } from "./contract-type";
import { PricingMethod } from "./pricing-method";
import { CDFLocation } from "./cdflocation";

export class CDFLocationSSE {
  Id: number;
  Name: string;
  SSE_Type: SSEType;
  Category: SSECategory;
  VendorName: string;
  Description: string;
  ContractTerm: ContractTerm;
  ContractType: ContractType;
  FromDate: Date;
  ToDate: Date;
  PricingMethod: PricingMethod;
  Value: number;
  MonthlyValue: number;
  Markup: number;
  Location: CDFLocation;
  Location_Id: number;
}
