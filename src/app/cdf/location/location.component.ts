import { CdfComponent } from "./../cdf.component";
import { CDFLocationTax } from "./../../_models/cdflocation-tax";
import { CdfLocactionTaxService } from "./../../_services/cdf-locaction-tax.service";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { CdfService } from "src/app/_services/cdf.service";
import { switchMap, pairwise } from "rxjs/operators";
import {
  MatDialog,
  MatTableDataSource,
  MatDatepickerInputEvent
} from "@angular/material";
import { AddLocationComponent } from "../dialog/add-location/add-location.component";
import { CdfLocationService } from "src/app/_services/cdf-location.service";
import { CDFLocation } from "src/app/_models/cdflocation";
import { CDF } from "src/app/_models/cdf";
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { CdfSummary } from "src/app/_models/cdf-summary";
import { Industry } from "src/app/_models/industry";
import { IndustryService } from "src/app/_services/industry.service";
import { Company } from "src/app/_models/company";
import { ContractType } from "src/app/_models/contract-type";
import { PaymentTerm } from "src/app/_models/payment-term";
import { CompanyService } from "src/app/_services/company.service";
import { ContractTypeService } from "src/app/_services/contract-type.service";
import { PaymentTermService } from "src/app/_services/payment-term.service";
import { ToastrService } from "ngx-toastr";
import { LocationSummary } from "src/app/_models/location-summary";
import { CostService } from "src/app/_services/cost.service";
import { Cost } from "src/app/_models/cost";
import { HttpErrorResponse } from "@angular/common/http";
import { CDFLocationCost } from "src/app/_models/cdflocation-cost";
import { StaffService } from "src/app/_services/staff.service";
import { ConfirmBenefitDeleteComponent } from "../dialog/confirm-benefit-delete/confirm-benefit-delete.component";
import { AES_UnionBenefit } from "src/app/_models/AES_UnionBenefit";
import { Actual } from "src/app/_models/actual";
import { CostPricingMethod } from "src/app/_models/cost-pricing-method";

@Component({
  selector: "app-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.css"]
})
export class LocationComponent implements OnInit {
  cdf: CDF;
  displayedColumns: any[];
  dataSource: MatTableDataSource<CDF[]>;
  CdfForm: FormGroup;
  summary: CdfSummary;
  selectedTab: number;
  Industries: Industry[];
  Companies: Company[];
  ContractTypes: ContractType[];
  PaymentTerms: PaymentTerm[];
  Costs: Cost[];

  monthlyCosts: number;
  monthlyOverhead: number;
  totalCosts: number;
  monthlyBenefits: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private cdfService: CdfService,
    private cdfLocationService: CdfLocationService,
    private IndustryService: IndustryService,
    private CompanyService: CompanyService,
    private ContractTypeService: ContractTypeService,
    private PaymentTermService: PaymentTermService,
    private cdfLocationTaxService: CdfLocactionTaxService,
    private costService: CostService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private staffService: StaffService,
    private benefitDialog: MatDialog
  ) {}

  ngOnInit() {
    var Industries = localStorage.getItem("Industries");
    var Companies = localStorage.getItem("Companies");
    var ContractTypes = localStorage.getItem("ContractTypes");
    var PaymentTerms = localStorage.getItem("PaymentTerms");

    this.selectedTab = 0;

    this.costService.Get().subscribe(
      (result: Cost[]) => {
        this.Costs = result;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );

    if (Industries) this.Industries = JSON.parse(Industries);
    else {
      this.IndustryService.Get().subscribe((result: Industry[]) => {
        this.Industries = result;
        localStorage.setItem("Industries", JSON.stringify(result));
      });
    }

    if (Companies) this.Companies = JSON.parse(Companies);
    else {
      this.CompanyService.Get().subscribe((result: Company[]) => {
        this.Companies = result;
        localStorage.setItem("Companies", JSON.stringify(result));
      });
    }

    if (ContractTypes) this.ContractTypes = JSON.parse(ContractTypes);
    else {
      this.ContractTypeService.Get().subscribe((result: ContractType[]) => {
        this.ContractTypes = result;
        localStorage.setItem("ContractTypes", JSON.stringify(result));
      });
    }

    if (PaymentTerms) this.PaymentTerms = JSON.parse(PaymentTerms);
    else {
      this.PaymentTermService.Get().subscribe((result: PaymentTerm[]) => {
        this.PaymentTerms = result;
        localStorage.setItem("PaymentTerms", JSON.stringify(result));
      });
    }

    this.summary = new CdfSummary();
    this.summary.totalMonthlyCosts = 0;
    this.summary.totalMonthlyOverhead = 0;
    this.summary.totalWeeklyCosts = 0;
    this.summary.totalWeeklyOverhead = 0;

    this.CdfForm = this.fb.group({
      Title: ["", Validators.required],
      Company: [""],
      CustomerName: [""],
      JobNumber: [""],
      SalesLead: [""],
      PricingLead: [""],
      ContractType: [""],
      Industry: [""],
      ContractStartDate: [new Date(), Validators.required],
      ContractEndDate: [new Date(), Validators.required],
      ContractExecutionDate: [new Date()],
      SubmissionDate: [new Date()],
      WeeksPerMonth: ["", Validators.required],
      LocationDetail: new FormArray(<FormGroup[]>[])
    });

    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.cdfService.GetCdf(params.get("id"))
        )
      )
      .subscribe((result: any) => {
        this.cdf = result;
        if (!this.cdf.Locations) this.cdf.Locations = [];
        this.calculateTotals();
        this.CdfForm.patchValue(result);
        this.calculateTotals();
      });

    this.displayedColumns = ["cdfTitle"];

    this.CdfForm.controls["WeeksPerMonth"].valueChanges.subscribe(val => {
      // this.calculateTotals();
    });

    this.CdfForm.valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [CDF, CDF]) => {
        if (this.CdfForm.valid) {
          if (this.locationDetail.controls.length > 0) {
            this.cdf.Locations.forEach((loc, indx) => {
              if (this.locationDetail.controls[indx]) {
                let formGroup: FormGroup = this.locationDetail.controls[indx]
                  .value;

                loc.Months = formGroup["Months"];
                loc.StopFlag = formGroup["StopFlag"];
                loc.CleanableSqFt = formGroup["CleanableSqFt"];
                loc.VacantSqFt = formGroup["VacantSqFt"];
                loc.CommonSqFt = formGroup["CommonSqFt"];
                loc.RentableSqFt = formGroup["RentableSqFt"];
                loc.BuildSqFt = formGroup["BuildSqFt"];
              }
            });
          }

          this.calculateTotals();
        }
      });
  }

  confirmBenefitDeletion(event: MatDatepickerInputEvent<Date>) {
    let startDate = this.CdfForm.get("ContractStartDate").value;
    let endDate = this.CdfForm.get("ContractEndDate").value;

    const dialogRef = this.benefitDialog.open(ConfirmBenefitDeleteComponent, {
      width: "250px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.cdf.ContractStartDate = startDate;
        this.cdf.ContractEndDate = endDate;

        this.cdf.Locations.forEach(location => {
          location.Staff.forEach(staff => {
            if (staff.LaborType.Value == "Union" && location.CBM_Union)
              staff.CBM_Benefits = this.staffService.getCBM_UnionBenefits(
                staff,
                location.CBM_Union,
                this.cdf.WeeksPerMonth,
                this.cdf.ContractStartDate,
                this.cdf.ContractEndDate
              );
            else if (staff.LaborType.Value == "Union" && location.AES_Union)
              staff.AES_Benefits = this.staffService.getAES_UnionBenefits(
                staff,
                location.AES_Union,
                this.cdf.WeeksPerMonth,
                this.cdf.ContractStartDate,
                this.cdf.ContractEndDate
              );
            else if (staff.LaborType.Value == "Non-Union" ) {
              staff.NonUnion_Benefits = this.staffService.AddNonUnionBenefit(
                staff,
                location
              );
            }
          });
        });
      } else {
        this.CdfForm.get("ContractStartDate").setValue(
          this.cdf.ContractStartDate
        );
        this.CdfForm.get("ContractEndDate").setValue(this.cdf.ContractEndDate);
      }
    });
  }

  public get locationDetail(): FormArray {
    return this.CdfForm.get("LocationDetail") as FormArray;
  }

  formInitialized(name: string, form: FormGroup) {
    this.locationDetail.push(form);
    console.log(`${name} has been initialized`);
  }

  saveCDF() {
    this.toastr.info("Saving updates...", "Saving");

    this.cdf.ContractStartDate = this.CdfForm.controls[
      "ContractStartDate"
    ].value;
    this.cdf.ContractEndDate = this.CdfForm.controls["ContractEndDate"].value;
    this.cdf.Title = this.CdfForm.controls["Title"].value;
    this.cdf.Company = this.CdfForm.controls["Company"].value;
    this.cdf.CustomerName = this.CdfForm.controls["CustomerName"].value;
    this.cdf.JobNumber = this.CdfForm.controls["JobNumber"].value;
    this.cdf.SalesLead = this.CdfForm.controls["SalesLead"].value;
    this.cdf.ContractType = this.CdfForm.controls["ContractType"].value;
    this.cdf.Industry = this.CdfForm.controls["Industry"].value;
    this.cdf.ContractExecutionDate = this.CdfForm.controls[
      "ContractExecutionDate"
    ].value;
    this.cdf.SubmissionDate = this.CdfForm.controls["SubmissionDate"].value;
    this.cdf.WeeksPerMonth = this.CdfForm.controls["WeeksPerMonth"].value;

    this.cdfService.Post(this.cdf).subscribe(async result => {
      this.cdf.Locations.forEach(
        async loc => {
          loc.Summary = <LocationSummary>(
            await this.cdfLocationService.getLocationTotals(
              loc,
              this.CdfForm.controls["WeeksPerMonth"].value
            )
          );

          if (loc.Taxes) {
            loc.Taxes.forEach(tax => {
              tax.Amount = this.cdfLocationTaxService.calculateTax(
                tax,
                loc,
                this.CdfForm.controls["WeeksPerMonth"].value
              );
            });
          }

          this.cdfLocationService.SaveLocation(loc).subscribe(
            async result => {
              loc.Summary = <LocationSummary>(
                await this.cdfLocationService.getLocationTotals(
                  loc,
                  this.CdfForm.controls["WeeksPerMonth"].value
                )
              );

              this.cdfLocationService.recalculateCosts(
                loc,
                this.CdfForm.controls["WeeksPerMonth"].value
              );

              this.toastr.success("Saved Successfully", "Success");
            },
            err => {
              this.toastr.error("Error Saving!", "Error");
            }
          );
        },
        err => {
          this.toastr.error("Error Saving!", "Error");
        }
      );
    });
  }

  addLocation() {
    const dialogRef = this.dialog.open(AddLocationComponent, {
      width: "500px",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async result => {
      let newLocation: CDFLocation = result;

      newLocation.CDF_Id = this.cdf.Id;
      newLocation.BuildSqFt = newLocation.BuildSqFt
        ? newLocation.BuildSqFt
        : newLocation.Location.BuildSqFt;
      newLocation.RentableSqFt = newLocation.RentableSqFt
        ? newLocation.RentableSqFt
        : newLocation.Location.RentableSqFt;
      newLocation.CommonSqFt = newLocation.CommonSqFt
        ? newLocation.CommonSqFt
        : newLocation.Location.CommonSqFt;
      newLocation.CleanableSqFt = newLocation.CleanableSqFt
        ? newLocation.CleanableSqFt
        : newLocation.Location.CleanableSqFt;
      newLocation.VacantSqFt = newLocation.VacantSqFt
        ? newLocation.VacantSqFt
        : newLocation.Location.VacantSqFt;
      newLocation.Taxes = await this.cdfLocationTaxService.addTaxes(
        newLocation,
        this.cdf.WeeksPerMonth
      );

      this.addRequiredCosts(newLocation);

      if (result) {
        this.cdfLocationService
          .SaveLocation(newLocation)
          .subscribe((result: CDFLocation) => {
            console.log("New Location: " + result);
            newLocation.Id = result.Id;
            this.cdf.Locations.push(newLocation);

            this.selectedTab = this.cdf.Locations.length - 1;
          });
      }
    });
  }

  removeLocation() {
    this.cdf.Locations.splice(this.selectedTab, 1);
    // this.selectedTab = this.selectedTab - 1;
  }

  addRequiredCosts(location: CDFLocation) {
    let requiredCosts: Cost[] = this.Costs.filter(cost => {
      return cost.Required == true;
    });

    let weeks = this.CdfForm.controls["WeeksPerMonth"].value;

    location.Costs = [];

    requiredCosts.forEach(cost => {
      let newCost = new CDFLocationCost();
      let actual = new Actual();
      let defaultPricingMethod = new CostPricingMethod();

      if (cost.CostPricingMethods) {
        defaultPricingMethod = cost.CostPricingMethods.find(pm => {
          return pm.Default == true;
        });

        if (defaultPricingMethod) {
          cost.PricingMethod = defaultPricingMethod.PricingMethod;
        }
      }

      if (cost.Actuals) {
        cost.Actuals.forEach(item => {
          if (item.Company.Name == this.cdf.Company.Name) {
            if (location.Location.State == "CA") {
              if (item.State == "CA") {
                actual = item;
              }
            } else {
              if (item.State == "OOS") {
                actual = item;
              }
            }
          }
        });
      }

      newCost.Cost = cost;
      newCost.PricingMethod = cost.PricingMethod;
      newCost.Value = 0;
      newCost.FromDate = this.cdf.ContractStartDate;
      newCost.ToDate = this.cdf.ContractEndDate;
      newCost.Actual_Value = actual.Amount;

      location.Costs.push(newCost);
    });
  }

  async addTaxes(location, weeks) {
    let taxes: CDFLocationTax[];

    taxes = await this.cdfLocationTaxService.addTaxes(location, weeks);
  }

  calculateTotals() {
    if (this.cdf) {
      let weeks = this.CdfForm.controls["WeeksPerMonth"].value;
      this.monthlyCosts = 0;
      this.monthlyOverhead = 0;
      this.totalCosts = 0;
      this.monthlyBenefits = 0;

      this.cdf.Locations.forEach(loc => {
        let myLoc: LocationSummary;
        myLoc = this.cdfLocationService.summaryTotals(loc, weeks);
        // let myLoc = this.cdfLocationService.CalculateTotals(loc, weeks);

        // let totalPayroll = this.cdfLocationService.getMonthlyStaffingCost(loc, weeks);

        // this.monthlyCosts += myLoc.monthlyTotalCosts + myLoc.monthlyTotalStaffing;
        // this.monthlyBenefits += myLoc.totalUnionBenefits;
        // this.monthlyOverhead += myLoc.monthlyTotalOverhead;
        // this.totalCosts += myLoc.totalMonthlyCosts;

        if (loc.Taxes) {
          loc.Taxes.forEach(tax => {
            tax.Amount = this.cdfLocationTaxService.calculateTax(
              tax,
              loc,
              weeks
            );
          });
        }

        if (loc.Staff) {
          loc.Staff.forEach(staff => {
            if (staff.CBM_Benefits && staff.CBM_Benefits.length > 0) {
              staff.CBM_Benefits.forEach(benefit => {
                benefit.Contribution = this.staffService.calculateCBMRate(
                  benefit.Rate,
                  benefit.RateType.Value,
                  staff,
                  weeks
                );
              });
            } else if (staff.AES_Benefits && staff.AES_Benefits.length > 0) {
              staff.AES_Benefits.forEach(benefit => {
                let rate = benefit;

                let myBenefit = new AES_UnionBenefit();

                myBenefit.Rate = rate.Rate;
                myBenefit.PricingMethod = rate.PricingMethod;
                myBenefit.Type = rate.Type;
                myBenefit.Override = rate.Override;
                myBenefit.ExpirationDate = rate.ExpirationDate;
                myBenefit.EffectiveDate = rate.EffectiveDate;

                myBenefit = this.staffService.calculateAESBenefit(
                  rate,
                  staff,
                  weeks
                );

                benefit.Contribution = myBenefit ? myBenefit.Contribution : 0;
              });
            } else if (
              staff.NonUnion_Benefits &&
              staff.NonUnion_Benefits.length > 0
            ) {
              staff.NonUnion_Benefits.forEach(benefit => {
                benefit.Contribution = this.staffService.calculateNonUnionTotal(
                  benefit.Rate,
                  staff,
                  loc.Markup
                );
              });
            }
          });
        }
      });
    }
  }

  onChange() {
    this.saveCDF();
  }

  compareCompanyFn(CompanyA: Company, CompanyB: Company) {
    return CompanyA && CompanyB
      ? CompanyA.Id === CompanyB.Id
      : CompanyA === CompanyB;
  }

  compareIndustryFn(IndustryA: Industry, IndustryB: Industry) {
    return IndustryA && IndustryB
      ? IndustryA.Id === IndustryB.Id
      : IndustryA === IndustryB;
  }

  compareContractTypeFn(
    ContractTypeA: ContractType,
    ContractTypeB: ContractType
  ) {
    return ContractTypeA && ContractTypeB
      ? ContractTypeA.Id === ContractTypeB.Id
      : ContractTypeA === ContractTypeB;
  }

  comparePaymentTermFn(PaymentTermA: PaymentTerm, PaymentTermB: PaymentTerm) {
    return PaymentTermA && PaymentTermB
      ? PaymentTermA.Id === PaymentTermB.Id
      : PaymentTermA === PaymentTermB;
  }
}
