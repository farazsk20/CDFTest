import { Component, OnInit, Inject } from "@angular/core";
import { Staff } from "src/app/_models/staff";
import { RateType } from "src/app/_models/rate-type";
import { BenefitType } from "src/app/_models/benefit-type";
import * as moment from "moment";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BenefitTypeService } from "src/app/_services/benefit-type.service";
import { RateTypeService } from "src/app/_services/rate-type.service";
import { AES_UnionBenefit } from "src/app/_models/AES_UnionBenefit";
import { PricingMethod } from "src/app/_models/pricing-method";
import { JobClassification } from "src/app/_models/job-classification";
import { PricingMethodService } from "src/app/_services/pricing-method.service";
import { LocationService } from "src/app/_services/location.service";
import { CdfLocationService } from "src/app/_services/cdf-location.service";
import { startWith, pairwise } from "rxjs/operators";
import { StaffCBMBenefit } from "src/app/_models/staff-cbm-benefit";
import { StaffAESBenefit } from "src/app/_models/staff-aes-benefit";

@Component({
  selector: "app-add-aes-benefit",
  templateUrl: "./add-aes-benefit.component.html",
  styleUrls: ["./add-aes-benefit.component.css"]
})
export class AddAesBenefitComponent implements OnInit {
  frmAESBenefit: FormGroup;
  benefitTypes: BenefitType[];
  rateTypes: RateType[];
  pricingMethods: PricingMethod[];

  constructor(
    public dialogRef: MatDialogRef<AddAesBenefitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private benefitTypeService: BenefitTypeService,
    private rateTypeService: RateTypeService,
    private pricingMethodService: PricingMethodService,
    private locationService: CdfLocationService
  ) {}

  ngOnInit() {
    var benefitTypes = localStorage.getItem("BenefitTypes");
    var rateTypes = localStorage.getItem("RateTypes");
    var pricingMethods = localStorage.getItem("PricingMethods");

    if (benefitTypes) this.benefitTypes = JSON.parse(benefitTypes);
    else {
      this.benefitTypeService.Get().subscribe((result: BenefitType[]) => {
        this.benefitTypes = result;
        localStorage.setItem("BenefitTypes", JSON.stringify(result));
      });
    }

    if (rateTypes) this.rateTypes = JSON.parse(rateTypes);
    else {
      this.rateTypeService.Get().subscribe((result: RateType[]) => {
        this.rateTypes = result;
        localStorage.setItem("RateTypes", JSON.stringify(result));
      });
    }

    if (pricingMethods) this.pricingMethods = JSON.parse(pricingMethods);
    else {
      this.pricingMethodService.Get().subscribe((result: PricingMethod[]) => {
        this.pricingMethods = result;
        localStorage.setItem("PricingMethods", JSON.stringify(result));
      });
    }

    this.frmAESBenefit = this.fb.group({
      Type: ["", Validators.required],
      Rate: ["", Validators.required],
      PricingMethod: ["", Validators.required],
      Contribution: [""],
      EffectiveDate: ["", Validators.required],
      ExpirationDate: ["", Validators.required],
      Override: [false],
      Added: [false],
      Active: [false],
      QualifyingHours: [""],
      MinContribution: [""],
      FullContribution: [""],
      RateNumber: [""],
      AES_UnionBenefit: [""]
    });

    if (this.data.benefit) {
      this.frmAESBenefit.patchValue(this.data.benefit);
    }

    this.frmAESBenefit.valueChanges
      .pipe(startWith(this.frmAESBenefit.value), pairwise())
      .subscribe(([prev, next]: [StaffAESBenefit, StaffAESBenefit]) => {
        let override = this.frmAESBenefit.get("Override").value;
        let myBenefit = this.data.staff.AES_Benefits[this.data.indx];

        this.checkOverride();
      });
  }

  get Contribution() {
    return this.frmAESBenefit.get("Contribution") as FormControl;
  }

  get Rate() {
    return this.frmAESBenefit.get("Rate") as FormControl;
  }

  get PricingMethod() {
    return this.frmAESBenefit.get("PricingMethod") as FormControl;
  }

  get EffectiveDate() {
    return this.frmAESBenefit.get("EffectiveDate") as FormControl;
  }

  get ExpirationDate() {
    return this.frmAESBenefit.get("ExpirationDate") as FormControl;
  }

  get Type() {
    return this.frmAESBenefit.get("Type") as FormControl;
  }

  update_AES_Contribution() {
    // let benefit: AES_UnionBenefit = this.calculateRate(rate, this.staff);
    let rate = this.frmAESBenefit.getRawValue();

    if (this.frmAESBenefit.valid) {
      let benefit = new AES_UnionBenefit();

      benefit.Rate = rate["Rate"];
      benefit.PricingMethod = rate["Type"];
      benefit.Type = rate["PricingMethod"];
      benefit.Override = rate["Override"];
      benefit.ExpirationDate = rate["ExpirationDate"];
      benefit.EffectiveDate = rate["EffectiveDate"];

      benefit = this.calculateRate(rate, this.data.staff);

      this.frmAESBenefit.get("Contribution").setValue(benefit.Contribution);
    }
  }

  calculateRate(benefit: any, newStaff: Staff): AES_UnionBenefit {
    let monthlyHrs = this.calculateHours(newStaff, this.data.WeeksPerMonth);
    let contribution: number;
    let rate: number;

    if (benefit.PricingMethod && benefit.Type) {
      switch (benefit.PricingMethod.Value) {
        case "PctGross":
          rate = monthlyHrs * benefit.Rate * benefit.FullContribution;
          // contribution = this.locationService.getMonthlyStaffingCost()
          break;
        case "Hour_OT":
        case "Hour_DT":
        case "Manual":
        case "HourPremium_All":
          contribution: 0;
          rate: 0;
          break;
        case "Flat_Reg":
        case "Flat_All":
          if (benefit.Override) {
            contribution = benefit.Rate;
            rate = benefit.Rate;
          } else {
            if (monthlyHrs >= benefit.QualifyingHours) {
              contribution = benefit.FullContribution;
              rate = benefit.FullContribution;
            } else {
              contribution = benefit.MinContribution;
              rate = benefit.MinContribution;
            }
          }
          break;
        case 'HourCap_Reg':
          if (benefit.Override) {
            contribution = benefit.Rate * monthlyHrs;
            rate = benefit.Rate;
          }
          else {
            if (monthlyHrs >= benefit.QualifyingHours) {
              contribution = benefit.FullContribution ;
              rate = benefit.FullContribution;
            }
            else {
              contribution = benefit.MinContribution * monthlyHrs;
              rate = benefit.MinContribution ;
            }
          }
          break;
        case "Flat_Week_All":
          rate = benefit.FullContribution;
          contribution = rate * this.data.WeeksPerMonth;
          break;
        case "Hour_Reg":
        case "Hour_All":
        case "HourCap_All":
          if (benefit.Override) {
            contribution = benefit.Rate * monthlyHrs;
            rate = benefit.Rate;
          } else {
            if (monthlyHrs >= benefit.QualifyingHours) {
              contribution = benefit.FullContribution * monthlyHrs;
              rate = benefit.FullContribution;
            } else {
              contribution = benefit.MinContribution * monthlyHrs;
              rate = benefit.MinContribution;
            }
          }
          break;
        default:
          break;
      }

      benefit.Contribution = contribution;
      benefit.Rate = rate;

      return benefit;
    } else {
      return null;
    }
  }

  close() {
    let effective = moment(
      this.frmAESBenefit.get("EffectiveDate").value
    ).format("L");
    let expiration = moment(
      this.frmAESBenefit.get("ExpirationDate").value
    ).format("L");
    let now = moment().format("L");

    if (
      moment(effective).isValid() &&
      ((moment(expiration).isValid() &&
        moment(this.data.BidStartDate).isBetween(effective, expiration)) ||
        (moment(this.data.BidStartDate).isAfter(effective) &&
          !moment(expiration).isValid()))
    ) {
      this.frmAESBenefit.get("Active").setValue(true);
    } else {
      this.frmAESBenefit.get("Active").setValue(false);
    }

    this.dialogRef.close(this.frmAESBenefit.value);
  }

  checkOverride() {
    let overridden: boolean;
    let myBenefit = this.calculateRate(
      this.data.staff.AES_Benefits[this.data.indx],
      this.data.staff
    );

    if (
      this.Rate.value != this.data.benefit.Rate ||
      this.Type.value.Id != this.data.benefit.Type.Id ||
      this.PricingMethod.value.Id != this.data.benefit.PricingMethod.Id ||
      this.EffectiveDate.value != this.data.benefit.EffectiveDate ||
      this.ExpirationDate.value != this.data.benefit.ExpirationDate
    ) {
      if (this.frmAESBenefit.get("Override").value == false)
        this.frmAESBenefit.get("Override").setValue(true);
    } else {
      if (this.frmAESBenefit.get("Override").value == true)
        this.frmAESBenefit.get("Override").setValue(false);
    }
  }

  toggleAES_Override(event: any) {
    let myBenefit = this.data.staff.AES_Benefits[this.data.indx];

    myBenefit.AES_UnionBenefit = this.calculateRate(
      myBenefit.AES_UnionBenefit,
      this.data.staff
    );

    if (event.checked == false) {
      this.frmAESBenefit.get("Rate").setValue(myBenefit.AES_UnionBenefit.Rate);
      this.frmAESBenefit
        .get("PricingMethod")
        .setValue(myBenefit.AES_UnionBenefit.PricingMethod);
      this.frmAESBenefit.get("Type").setValue(myBenefit.AES_UnionBenefit.Type);
      this.frmAESBenefit
        .get("EffectiveDate")
        .setValue(myBenefit.AES_UnionBenefit.EffectiveDate);
      this.frmAESBenefit
        .get("ExpirationDate")
        .setValue(myBenefit.AES_UnionBenefit.ExpirationDate);
      this.frmAESBenefit
        .get("Contribution")
        .setValue(myBenefit.AES_UnionBenefit.Contribution);
    }
  }

  calculateHours(staff: Staff, weeksPerMonth: number) {
    return staff.DailyHours * staff.DaysPerWeek * weeksPerMonth;
  }

  compareRateTypeFn(rateTypeA: RateType, rateTypeB: RateType) {
    return rateTypeA && rateTypeB
      ? rateTypeA.Id === rateTypeB.Id
      : rateTypeA === rateTypeB;
  }

  compareBenefitTypeFn(benefitTypeA: BenefitType, benefitTypeB: BenefitType) {
    return benefitTypeA && benefitTypeB
      ? benefitTypeA.Id === benefitTypeB.Id
      : benefitTypeA === benefitTypeB;
  }

  comparePricingMethodFn(
    PricingMethodA: PricingMethod,
    PricingMethodB: PricingMethod
  ) {
    return PricingMethodA && PricingMethodB
      ? PricingMethodA.Id === PricingMethodB.Id
      : PricingMethodA === PricingMethodB;
  }
  compareClassificationFn(
    JobClassificationA: JobClassification,
    JobClassificationB: JobClassification
  ) {
    return JobClassificationA && JobClassificationB
      ? JobClassificationA.Id === JobClassificationB.Id
      : JobClassificationA === JobClassificationB;
  }
}
