import { FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { CDFLocation } from 'src/app/_models/cdflocation';
import { UnionService } from 'src/app/_services/union.service';
import { AES_Union } from 'src/app/_models/AES_Union';
import { MatBottomSheet } from '@angular/material';
import { CdfLocationService } from 'src/app/_services/cdf-location.service';
import { LocationSummary } from 'src/app/_models/location-summary';
import { TaxInfoComponent } from '../tax-info/tax-info.component';
import { CDFLocationTax } from 'src/app/_models/cdflocation-tax';
import { ToastrService } from 'ngx-toastr';
import { CdfLocactionTaxService } from 'src/app/_services/cdf-locaction-tax.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  @Input() location: CDFLocation;
  @Input() weeks: number;
  totalMonthlyCost: number;
 

  constructor(
    private locService: CdfLocationService,
    private cdfLocationTaxService: CdfLocactionTaxService,
    private toastr: ToastrService,
    private bottomSheet: MatBottomSheet) { }
 

  ngOnInit() {


  }

  openTaxesBottomSheet(): void {
    this.bottomSheet.open(TaxInfoComponent, {
      data: { taxes: this.location.Taxes, location: this.location, weeks: this.weeks },
      panelClass: 'TaxesBottomSheet',
      disableClose: true
    }).afterDismissed().subscribe((res: FormArray[]) => {
      if (res) {
        res.forEach((tax, indx) => {
          if (indx <= (this.location.Taxes.length - 1)) {
            this.location.Taxes[indx].Type = tax['Type'];
            this.location.Taxes[indx].Rate = tax['Rate'];
            this.location.Taxes[indx].Limit = tax['Limit'];
            this.location.Taxes[indx].EffectiveDate = tax['EffectiveDate'];
            this.location.Taxes[indx].Amount = tax['Amount'];
            this.location.Taxes[indx].Override = tax['Override'];
          } else {
            let newTax = new CDFLocationTax();
            newTax.Type = tax['Type'];
            newTax.Rate = tax['Rate'];
            newTax.Limit = tax['Limit'];
            newTax.EffectiveDate = tax['EffectiveDate'];
            newTax.Amount = tax['Amount'];
            newTax.Override = tax['Override'];
            newTax.Added = tax['Added'];
            this.location.Taxes.push(newTax);
          }
        });
      }
    });
  }

  calculateBuildingProductivityRate() {
    let rate = this.location.BuildSqFt / (this.location.Summary ? this.location.Summary.TotalLabor : 0);

    this.location.ProductivityRate = rate;
    return rate;
  }

  calculateMonthlyCostPSF() {
    let val = (this.location.Summary ? this.location.Summary.TotalWithoutTax : 0) / this.location.BuildSqFt;

    return val;
  }

  calculateMonthlyGrandTotal() {
    // let val = this.location.Summary ? this.location.Summary : 0 + this.summary.monthlyTotalOverhead ? this.summary.monthlyTotalOverhead : 0;

    // this.summary.monthlyGrandTotal = val;
    // return val;
  }

  calculateVacancyCredit() {
    let val = this.location.VacantSqFt * this.calculateMonthlyCostPSF();

    this.location.VacancyCredit = val;
    return val;
  }

  calculateCurrentMonthlyCost() {
    // let val = this.calculateMonthlyGrandTotal() - this.calculateVacancyCredit();
    // return val;
  }

  async refresh(){
    this.toastr.info("Refreshing Summary totals...", 'Refesh Summary Totals');

    this.location.Summary = <LocationSummary>await this.locService.getLocationTotals(this.location, this.weeks);

    if (this.location.Taxes) {
      this.location.Taxes.forEach(tax => {
        tax.Amount = this.cdfLocationTaxService.calculateTax(tax, this.location, this.weeks);
      });
    }

    this.locService.SaveLocation(this.location).subscribe(async result => {
      this.location.Summary = <LocationSummary>await this.locService.getLocationTotals(this.location, this.weeks);
      //this.toastr.success("Saved Successfully", 'Success');
    },
      err => {
        this.toastr.error("Error Refreshing!", 'Error');
      
    });
  }

}
