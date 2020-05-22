import { Component, OnInit, Inject } from '@angular/core';
import { BenefitType } from 'src/app/_models/benefit-type';
import { RateType } from 'src/app/_models/rate-type';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BenefitTypeService } from 'src/app/_services/benefit-type.service';
import { RateTypeService } from 'src/app/_services/rate-type.service';
import { StaffCBMBenefit } from 'src/app/_models/staff-cbm-benefit';
import { Staff } from 'src/app/_models/staff';
import { pairwise, startWith } from 'rxjs/operators';
import * as moment from 'moment';
import { _ } from 'underscore';
import { CBM_Rate } from 'src/app/_models/CBM_Rate';
import { IfStmt } from '@angular/compiler';
import { ifStmt } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-add-cbm-benefit',
  templateUrl: './add-cbm-benefit.component.html',
  styleUrls: ['./add-cbm-benefit.component.css']
})
export class AddCbmBenefitComponent implements OnInit {

  frmCBMBenefit: FormGroup
  benefitTypes: BenefitType[];
  rateTypes: RateType[];

  constructor(
    public dialogRef: MatDialogRef<AddCbmBenefitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private benefitTypeService: BenefitTypeService,
    private rateTypeService: RateTypeService, ) { }

  ngOnInit() {
    var benefitTypes = localStorage.getItem('BenefitTypes');
    var rateTypes = localStorage.getItem('RateTypes');

    if (benefitTypes) this.benefitTypes = JSON.parse(benefitTypes);
    else {
      this.benefitTypeService.Get().subscribe(
        (result: BenefitType[]) => {
          this.benefitTypes = result;
          localStorage.setItem('BenefitTypes', JSON.stringify(result));
        }
      )
    }

    if (rateTypes) this.rateTypes = JSON.parse(rateTypes);
    else {
      this.rateTypeService.Get().subscribe(
        (result: RateType[]) => {
          this.rateTypes = result;
          localStorage.setItem('RateTypes', JSON.stringify(result));
        }
      )
    }

    this.frmCBMBenefit = this.fb.group({
      BenefitType: ['', Validators.required],
      Rate: ['', Validators.required],
      RateType: ['', Validators.required],
      Contribution: [''],
      EffectiveDate: ['', Validators.required],
      ExpirationDate: ['', Validators.required],
      Override: [false],
      Added: [false],
      Active: [false]
    });

    if (this.data.benefit) {
      this.frmCBMBenefit.patchValue(this.data.benefit);
    }

    this.frmCBMBenefit.valueChanges.pipe(startWith(this.frmCBMBenefit.value), pairwise()).subscribe(([prev, next]: [StaffCBMBenefit, StaffCBMBenefit]) => {
      let override = this.frmCBMBenefit.get('Override').value;
      let myBenefit = this.data.staff.CBM_Benefits[this.data.indx];

      this.checkOverride()
    });

  }

  get Contribution() {
    return this.frmCBMBenefit.get('Contribution') as FormControl;
  }

  get Rate() {
    return this.frmCBMBenefit.get('Rate') as FormControl;
  }

  get RateType() {
    return this.frmCBMBenefit.get('RateType') as FormControl;
  }

  get EffectiveDate() {
    return this.frmCBMBenefit.get('EffectiveDate') as FormControl;
  }

  get ExpirationDate() {
    return this.frmCBMBenefit.get('ExpirationDate') as FormControl;
  }

  get BenefitType() {
    return this.frmCBMBenefit.get('BenefitType') as FormControl;
  }

  checkOverride() {
    let overridden: boolean;
    let myBenefit = this.data.staff.CBM_Benefits[this.data.indx];

    if (this.Rate.value != this.getRate(myBenefit.RateNumber, myBenefit.CBM_Rate)
      || this.BenefitType.value.Id != this.data.benefit.BenefitType.Id
      || this.RateType.value.Id != this.data.benefit.RateType.Id
      || this.EffectiveDate.value != this.data.benefit.EffectiveDate
      || this.ExpirationDate.value != this.data.benefit.ExpirationDate) {
      if (this.frmCBMBenefit.get('Override').value == false)
        this.frmCBMBenefit.get('Override').setValue(true);
    } else {
      if (this.frmCBMBenefit.get('Override').value == true)
        this.frmCBMBenefit.get('Override').setValue(false);
    }
  }

  update_CBM_Contribution() {
    if (this.frmCBMBenefit.valid) {
      this.frmCBMBenefit.get('Contribution').setValue(this.calculateRate(this.Rate.value, this.RateType.value.Value, this.data.staff));
    }
  }

  calculateRate(Rate: number, RateType: string, Staff: Staff) {
    let MonthlyHours = this.calculateHours(Staff, this.data.WeeksPerMonth);

    if (RateType == 'Hourly')
      return Rate * MonthlyHours;
    else if (RateType == 'Weekly')
      return Rate * this.data.WeeksPerMonth;
    else
      return Rate;
  }

  close() {

    let effective = moment(this.frmCBMBenefit.get('EffectiveDate').value).format('L');
    let expiration = moment(this.frmCBMBenefit.get('ExpirationDate').value).format('L');
    let now = moment().format('L');

    if (moment(effective).isValid() && ((moment(expiration).isValid() && moment(this.data.BidStartDate).isBetween(effective, expiration)) || (moment(this.data.BidStartDate).isAfter(effective) && !moment(expiration).isValid()))) {
      this.frmCBMBenefit.get('Active').setValue(true);
    } else {
      this.frmCBMBenefit.get('Active').setValue(false);
    }

    this.dialogRef.close(this.frmCBMBenefit.value);
  }


  toggleCBM_Override(event: any) {
    let myBenefit = this.data.staff.CBM_Benefits[this.data.indx];

    if (event.checked == false) {
      this.frmCBMBenefit.get('Rate').setValue(this.getRate(myBenefit.RateNumber, myBenefit.CBM_Rate));
      this.frmCBMBenefit.get('RateType').setValue(myBenefit.CBM_Rate_Type);
      this.frmCBMBenefit.get('BenefitType').setValue(myBenefit.CBM_Rate.BenefitType);
      this.frmCBMBenefit.get('EffectiveDate').setValue(myBenefit.CBM_Rate.EffectiveDate);
      this.frmCBMBenefit.get('ExpirationDate').setValue(myBenefit.CBM_Rate.ExpirationDate);
      this.frmCBMBenefit.get('Contribution').setValue(this.calculateRate(this.Rate.value, this.RateType.value.Value, this.data.staff));
    }

  }

  getRate(rateNum: number, rate: CBM_Rate): number {
    let myRate: number;

    switch (rateNum) {
      case 1:
        myRate = rate.Rate_1;
        break;
      case 2:
        myRate = rate.Rate_2;
        break;
      case 3:
        myRate = rate.Rate_3;
        break;
      case 4:
        myRate = rate.Rate_4;
        break;

      default:
        myRate = 0;
        break;
    }

    return myRate ? myRate : 0;
  }

  calculateHours(staff: Staff, weeksPerMonth: number) {
    return staff.DailyHours * staff.DaysPerWeek * weeksPerMonth;
  }

  compareRateTypeFn(rateTypeA: RateType, rateTypeB: RateType) {
    return rateTypeA && rateTypeB ? rateTypeA.Id === rateTypeB.Id : rateTypeA === rateTypeB;
  }

  compareBenefitTypeFn(benefitTypeA: BenefitType, benefitTypeB: BenefitType) {
    return benefitTypeA && benefitTypeB ? benefitTypeA.Id === benefitTypeB.Id : benefitTypeA === benefitTypeB;
  }
}
