import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { StaffCBMBenefit } from 'src/app/_models/staff-cbm-benefit';
import { Staff } from 'src/app/_models/staff';
import { CBM_Rate } from 'src/app/_models/CBM_Rate';
import { RateType } from 'src/app/_models/rate-type';
import { BenefitType } from 'src/app/_models/benefit-type';
import { PricingMethod } from 'src/app/_models/pricing-method';
import { JobClassification } from 'src/app/_models/job-classification';
import { BenefitTypeService } from 'src/app/_services/benefit-type.service';
import { RateTypeService } from 'src/app/_services/rate-type.service';
import { pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-cbm-union-benefits',
  templateUrl: './cbm-union-benefits.component.html',
  styleUrls: ['./cbm-union-benefits.component.css']
})
export class CbmUnionBenefitsComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormArray>()
  @Input() benefits: StaffCBMBenefit[];
  @Input() formGroup: FormGroup;
  @Input() staff: Staff;
  @Input() weeksPerMonth: number;

  benefitTypes: BenefitType[];
  rateTypes: RateType[];

  CBM_Benefits: FormArray;

  constructor(private fb: FormBuilder,
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

    this.benefits.forEach((item: StaffCBMBenefit) => {
      let benefit: FormGroup = this.fb.group({
        BenefitType: [item.BenefitType],
        Rate: [item.Rate],
        RateType: [item.RateType],
        Contribution: [item.Contribution],
        EffectiveDate: [item.EffectiveDate],
        ExpirationDate: [item.ExpirationDate],
        Override: [{ value: item.Override ? item.Override : false, disabled: item.Added ? item.Added : false }],
      });

      if (!this.CBM_Benefits)
        this.CBM_Benefits = new FormArray([]);

      this.CBM_Benefits.push(benefit);
    });



    console.log(`CBM Benefits: ${this.benefits ? this.benefits.length : 'None'}`);

    this.formReady.emit(this.CBM_Benefits);
  }

  toggleCBM_Override(event: any, benefit: FormGroup, indx: number) {
    let myBenefit = this.staff.CBM_Benefits[indx];
    let pricingMethod = benefit.controls['RateType'].value;
    let override = benefit.controls['Override'].value;

    if (event.checked == false) {
      benefit.controls['Rate'].setValue(this.getRate(myBenefit.RateNumber, myBenefit.CBM_Rate));
      benefit.controls['RateType'].setValue(myBenefit.CBM_Rate_Type);
      benefit.controls['BenefitType'].setValue(myBenefit.CBM_Rate.BenefitType);
      benefit.controls['EffectiveDate'].setValue(myBenefit.CBM_Rate.EffectiveDate);
      benefit.controls['ExpirationDate'].setValue(myBenefit.CBM_Rate.ExpirationDate);
      benefit.controls['Contribution'].setValue(this.calculateRate(benefit.controls['Rate'].value, myBenefit.RateType.Value, this.staff));
    }

    this.CBM_Benefits[indx] = benefit;
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


  calculateRate(Rate: number, RateType: string, Staff: Staff) {
    let MonthlyHours = this.calculateHours(Staff, this.weeksPerMonth);

    if (RateType == 'Hourly')
      return Rate * MonthlyHours;
    else
      return Rate;
  }

  update_CBM_Contribution(rate: any, indx: number) {
    if (rate.controls.RateType.value && rate.controls.Rate.value) {
      var myRate = rate.controls.Rate.value;
      var myRateType = rate.controls.RateType.value.Value;

      this.CBM_Benefits.controls[indx].get('BenefitType').setValue(rate.controls.BenefitType.value);
      this.CBM_Benefits.controls[indx].get('Rate').setValue(rate.controls.Rate.value);
      this.CBM_Benefits.controls[indx].get('RateType').setValue(rate.controls.RateType.value);
      this.CBM_Benefits.controls[indx].get('EffectiveDate').setValue(rate.controls.EffectiveDate.value);
      this.CBM_Benefits.controls[indx].get('ExpirationDate').setValue(rate.controls.ExpirationDate.value);
      this.CBM_Benefits.controls[indx].get('Override').setValue(rate.controls.Override.value);
      this.CBM_Benefits.controls[indx].get('Contribution').setValue(this.calculateRate(myRate, myRateType, this.staff));

      this.staff.CBM_Benefits[indx].BenefitType = rate.controls.BenefitType.value;
      this.staff.CBM_Benefits[indx].Rate = rate.controls.Rate.value;
      this.staff.CBM_Benefits[indx].RateType = rate.controls.RateType.value;
      this.staff.CBM_Benefits[indx].EffectiveDate = rate.controls.EffectiveDate.value;
      this.staff.CBM_Benefits[indx].ExpirationDate = rate.controls.ExpirationDate.value;
      this.staff.CBM_Benefits[indx].Override = rate.controls.Override.value;
      this.staff.CBM_Benefits[indx].Contribution = this.calculateRate(myRate, myRateType, this.staff);

    }
  }

  Add_CBM_Benefit(benefit: StaffCBMBenefit): void {
    this.staff.CBM_Benefits.push(benefit);
    this.CBM_Benefits.push(this.Create_CBM_Benefit(benefit));
  }


  Create_CBM_Benefit(benefit: StaffCBMBenefit): FormGroup {

    return this.fb.group({
      BenefitType: [benefit.BenefitType],
      Rate: [benefit.Rate],
      RateType: [benefit.RateType],
      Contribution: [benefit.Contribution],
      EffectiveDate: [benefit.EffectiveDate],
      ExpirationDate: [benefit.ExpirationDate],
      Override: [{ value: benefit.Override, disabled: true }],
    });
  }

  add_CBM_Rate() {
    let newBenefit = new StaffCBMBenefit();
    newBenefit.Override = true;
    newBenefit.Added = true;
    this.Add_CBM_Benefit(newBenefit);
  }

  isAdded(indx: number) {
    if (this.staff.CBM_Benefits[indx].Added) return true;
    else return false;
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

  comparePricingMethodFn(PricingMethodA: PricingMethod, PricingMethodB: PricingMethod) {
    return PricingMethodA && PricingMethodB ? PricingMethodA.Id === PricingMethodB.Id : PricingMethodA === PricingMethodB;
  }
  compareClassificationFn(JobClassificationA: JobClassification, JobClassificationB: JobClassification) {
    return JobClassificationA && JobClassificationB ? JobClassificationA.Id === JobClassificationB.Id : JobClassificationA === JobClassificationB;
  }

}
