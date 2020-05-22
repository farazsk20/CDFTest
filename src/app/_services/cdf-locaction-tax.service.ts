import { TaxService } from "./tax.service";
import { CDFLocationTax } from "./../_models/cdflocation-tax";
import { CdfLocationService } from "./cdf-location.service";
import { CDFLocation } from "src/app/_models/cdflocation";
import { Injectable } from "@angular/core";
import { Tax } from "../_models/tax";
import { LocationSummary } from "../_models/location-summary";

@Injectable({
  providedIn: "root"
})
export class CdfLocactionTaxService {
  constructor(
    private cdfLocationService: CdfLocationService,
    private taxService: TaxService
  ) {}

  public calculateTax(
    tax: CDFLocationTax,
    location: CDFLocation,
    weeks: number
  ): number {
    let taxAmount: number;
    let totalCosts = location.Summary ? location.Summary.TotalWithoutTax : 0;
    let TotalLabor = location.Summary ? location.Summary.TotalLabor : 0;
    let empCount = this.cdfLocationService.getTotalEmployeeCount(location);
    let type = tax.Type ? tax.Type : tax.Tax.Type;
    let taxRate = tax.Rate / 100;

    if (type) {
      switch (type.Value) {
        case "Stops Plus":
        case "Medicare":
        case "Social Security":
          taxAmount = TotalLabor * taxRate;
          break;
        case "State Unemployment Insurance":
        case "Federal Unemployment Insurance":
          if (location.StopFlag) {
            switch (location.StopFlag.Value) {
              case "Average":
              case "No Stop":
                taxAmount = taxRate * TotalLabor;
                break;
              case "Stop":
              case "Stops Plus":
                taxAmount = (empCount * tax.Limit * taxRate) / location.Months;
                break;
              default:
                taxAmount = 0;
                break;
            }
          } else {
            taxAmount = 0;
          }
          break;
        case "Sales Tax":
        case "Gross Receipt Tax":
          if (location.Summary && location.Summary.TotalWithFees) {
            taxAmount = location.Summary.TotalWithFees * taxRate;
          } else {
            taxAmount = 0;
          }
          break;
        default:
          taxAmount = TotalLabor * taxRate;
          break;
      }
    } else {
      taxAmount = 0;
    }

    return taxAmount;
  }

  public async addTaxes(
    location: CDFLocation,
    weeks: number
  ): Promise<CDFLocationTax[]> {
    let payroll = location.Summary ? location.Summary.TotalLabor : 0;

    await this.taxService
      .Get(location.Location.ZipCode, location.Location.State)
      .then(
        (result: Tax[]) => {
          result.forEach(tax => {
            if (tax.Type.Value != "Stops Plus") {
              let newTax = new CDFLocationTax();

              newTax.Type = tax.Type;
              newTax.Tax = tax;
              newTax.Rate = tax.Rate;
              newTax.Limit = tax.Limit;
              newTax.EffectiveDate = tax.EffectiveDate;
              newTax.EndingDate = tax.EndingDate;
              newTax.Amount = this.calculateTax(newTax, location, weeks);
              newTax.Override = false;

              if (!location.Taxes) location.Taxes = [];

              location.Taxes.push(newTax);
            }
          });
        },
        err => {
          console.log(err);
        }
      );

    return location.Taxes;
  }

  public calcuateTaxes(
    location: CDFLocation,
    weeks: number,
    summary: LocationSummary
  ) {
    location.Taxes.forEach(tax => {
      tax.Amount = this.calculateTax(tax, location, weeks);
    });
  }
}
