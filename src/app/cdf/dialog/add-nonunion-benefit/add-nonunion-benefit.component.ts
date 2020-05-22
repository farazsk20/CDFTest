import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RateType } from 'src/app/_models/rate-type';
import { RateTypeService } from 'src/app/_services/rate-type.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Staff } from 'src/app/_models/staff';
import { BenefitType } from 'src/app/_models/benefit-type';
import { PricingMethod } from 'src/app/_models/pricing-method';
import { JobClassification } from 'src/app/_models/job-classification';
import { NonUnionBenefit } from 'src/app/_models/non-union-benefit';
import { StaffNonUnionBenefit } from 'src/app/_models/staff-non-union-benefit';
import * as moment from 'moment';
import { startWith, pairwise } from 'rxjs/operators';
import { StaffCBMBenefit } from 'src/app/_models/staff-cbm-benefit';

@Component({
  selector: 'app-add-nonunion-benefit',
  templateUrl: './add-nonunion-benefit.component.html',
  styleUrls: ['./add-nonunion-benefit.component.css']
})
export class AddNonunionBenefitComponent implements OnInit {

  frmNonUnionBenefit: FormGroup;
  rateTypes: RateType[];
  NonUnion_Benefits: FormArray;

  constructor(

    public dialogRef: MatDialogRef<AddNonunionBenefitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private rateTypeService: RateTypeService, ) { }

  ngOnInit() {
    var rateTypes = localStorage.getItem('RateTypes');

    if (rateTypes) this.rateTypes = JSON.parse(rateTypes);
    else {
      this.rateTypeService.Get().subscribe(
        (result: RateType[]) => {
          this.rateTypes = result;
          localStorage.setItem('RateTypes', JSON.stringify(result));
        }
      )
    }


    this.frmNonUnionBenefit = this.fb.group({
      Code: [{ value: '', readonly: true }],
      Rate: [''],
      RateType: [''],
      Contribution: [{ value: '', readonly: true }],
      Override: [false],
    });

    if (!this.NonUnion_Benefits)
      this.NonUnion_Benefits = new FormArray([]);

    if (this.data.benefit) {
      this.frmNonUnionBenefit.patchValue(this.data.benefit);
    }

    this.frmNonUnionBenefit.valueChanges.pipe(startWith(this.frmNonUnionBenefit.value), pairwise()).subscribe(([prev, next]: [StaffNonUnionBenefit, StaffNonUnionBenefit]) => {
      this.checkOverride()
    });
  }


  close() {
    this.dialogRef.close(this.frmNonUnionBenefit.value);
  }

  get Contribution() {
    return this.frmNonUnionBenefit.get('Contribution') as FormControl;
  }

  get Rate() {
    return this.frmNonUnionBenefit.get('Rate') as FormControl;
  }

  get RateType() {
    return this.frmNonUnionBenefit.get('RateType') as FormControl;
  }

  checkOverride() {
    let overridden: boolean;

    if (this.Rate.value != this.data.benefit.Rate
      || this.RateType.value.Id != this.data.benefit.RateType.Id) {
      if (this.frmNonUnionBenefit.get('Override').value == false)
        this.frmNonUnionBenefit.get('Override').setValue(true);
    } else {
      if (this.frmNonUnionBenefit.get('Override').value == true)
        this.frmNonUnionBenefit.get('Override').setValue(false);
    }
  }

  update_NonUnion_Contribution() {
    if (this.frmNonUnionBenefit.valid) {
      this.frmNonUnionBenefit.get('Contribution').setValue(this.calculateTotal(this.Rate.value, this.data.staff));
    }
  }

  calculateTotal(rate: number, staff: Staff): number {
    return rate * (1 + this.data.Markup/100);
  }

  toggleNonUnion_Override(event: any) {
    let myBenefit = this.data.staff.NonUnion_Benefits[this.data.indx];

    if (event.checked == false) {
      this.frmNonUnionBenefit.get('Rate').setValue(this.getRate(myBenefit.NonUnionBenefit, this.data.staff));
      this.frmNonUnionBenefit.get('Contribution').setValue(this.calculateTotal(this.getRate(myBenefit.NonUnionBenefit, this.data.staff), this.data.staff));
    }
  }

  getRate(rate: NonUnionBenefit, staff: Staff) {
    let newRate: number;
    switch (staff.HWStatus.Value) {
      case 'EE':
        newRate = rate.EE_Rate;
        break;
      case 'EE+1':
        newRate = rate.EE_1_Rate;
        break;
      case 'Family':
        newRate = rate.Family_Rate;
        break;
    }

    return newRate;
  }

  calculateHours(staff: Staff, weeksPerMonth: number) {
    return staff.DailyHours * staff.NumEmployees * staff.DaysPerWeek * weeksPerMonth;
  }

  compareRateTypeFn(rateTypeA: RateType, rateTypeB: RateType) {
    return rateTypeA && rateTypeB ? rateTypeA.Id === rateTypeB.Id : rateTypeA === rateTypeB;
  }

  compareBenefitTypeFn(benefitTypeA: BenefitType, benefitTypeB: BenefitType) {
    return benefitTypeA && benefitTypeB ? benefitTypeA.Id === benefitTypeB.Id : benefitTypeA === benefitTypeB;
  }

  comparePricingMethodFn(PricingMethodA: PricingMethod, PricingMethodB: PricingMethod) {
    return PricingMethodA && PricingMethodB ? PricingMethodA.Id === PricingMethodB.Id : PricingMethodA === PricingMethodB;
  }
  compareClassificationFn(JobClassificationA: JobClassification, JobClassificationB: JobClassification) {
    return JobClassificationA && JobClassificationB ? JobClassificationA.Id === JobClassificationB.Id : JobClassificationA === JobClassificationB;
  }

}
