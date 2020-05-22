import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RateTypeService } from 'src/app/_services/rate-type.service';
import { RateType } from 'src/app/_models/rate-type';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { StaffCBMBenefit } from 'src/app/_models/staff-cbm-benefit';
import { Staff } from 'src/app/_models/staff';
import { StaffNonUnionBenefit } from 'src/app/_models/staff-non-union-benefit';
import { BenefitType } from 'src/app/_models/benefit-type';
import { PricingMethod } from 'src/app/_models/pricing-method';
import { JobClassification } from 'src/app/_models/job-classification';
import { NonUnionBenefit } from 'src/app/_models/non-union-benefit';

@Component({
  selector: 'app-non-union-benefits',
  templateUrl: './non-union-benefits.component.html',
  styleUrls: ['./non-union-benefits.component.css']
})
export class NonUnionBenefitsComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormArray>()
  @Input() benefits: StaffNonUnionBenefit[];
  @Input() formGroup: FormGroup;
  @Input() staff: Staff;
  @Input() weeksPerMonth: number;

  rateTypes: RateType[];
  NonUnion_Benefits: FormArray;


  constructor(private fb: FormBuilder,
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


    this.benefits.forEach((item: StaffNonUnionBenefit) => {
      let benefit: FormGroup = this.fb.group({
        Code: [item.NonUnionBenefit.Code],
        Rate: [item.Rate],
        RateType: [item.NonUnionBenefit.RateType.Value],
        Contribution: [item.Contribution],
        Override: [false],
      });

      if (!this.NonUnion_Benefits)
        this.NonUnion_Benefits = new FormArray([]);

      this.NonUnion_Benefits.push(benefit);
    });

    this.formReady.emit(this.NonUnion_Benefits);

  }

  update_NonUnion_Contribution(rate: any, indx: number) {
    if (rate.controls.Rate.value) {
      var myRate = rate.controls.Rate.value;
      var myRateType = rate.controls.RateType.value.Value;

      let benefit = new StaffNonUnionBenefit();

      // benefit.Rate = rate.controls['Rate'].value;
      // benefit.Override = rate.controls['Override'].value;
      // benefit.Contribution = this.calculateTotal(benefit.Rate, this.staff);

      this.NonUnion_Benefits.controls[indx].get('Rate').setValue(rate.controls.Rate.value);
      this.NonUnion_Benefits.controls[indx].get('Override').setValue(rate.controls.Override.value);
      this.NonUnion_Benefits.controls[indx].get('Contribution').setValue(this.calculateTotal(rate.controls.Rate.value, this.staff));

      this.staff.NonUnion_Benefits[indx].Rate = rate.controls.Rate.value;
      this.staff.NonUnion_Benefits[indx].Override = rate.controls.Override.value;
      this.staff.NonUnion_Benefits[indx].Contribution = this.calculateTotal(rate.controls.Rate.value, this.staff);
    }
  }

  calculateTotal(rate: number, staff: Staff): number {
    return rate * staff.NumEmployees;
  }

  toggleNonUnion_Override(event: any, benefit: FormGroup, indx: number) {
    let myBenefit = this.staff.NonUnion_Benefits[indx];

    if (event.checked == false) {
      benefit.controls['Rate'].setValue(this.getRate(myBenefit.NonUnionBenefit, this.staff));
      benefit.controls['Contribution'].setValue(this.calculateTotal(this.getRate(myBenefit.NonUnionBenefit, this.staff), this.staff));
    }

    this.NonUnion_Benefits[indx] = benefit;
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
