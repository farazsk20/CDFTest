import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { StaffCBMBenefit } from 'src/app/_models/staff-cbm-benefit';
import { Staff } from 'src/app/_models/staff';
import { BenefitTypeService } from 'src/app/_services/benefit-type.service';
import { RateTypeService } from 'src/app/_services/rate-type.service';
import { BenefitType } from 'src/app/_models/benefit-type';
import { RateType } from 'src/app/_models/rate-type';
import { StaffAESBenefit } from 'src/app/_models/staff-aes-benefit';
import { PricingMethod } from 'src/app/_models/pricing-method';
import { JobClassification } from 'src/app/_models/job-classification';
import { AES_UnionBenefit } from 'src/app/_models/AES_UnionBenefit';
import { PricingMethodService } from 'src/app/_services/pricing-method.service';

@Component({
  selector: 'app-aes-union-benefits',
  templateUrl: './aes-union-benefits.component.html',
  styleUrls: ['./aes-union-benefits.component.css']
})
export class AesUnionBenefitsComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormArray>();
  @Input() benefits: StaffAESBenefit[];
  @Input() formGroup: FormGroup;
  @Input() staff: Staff;
  @Input() weeksPerMonth: number;

  benefitTypes: BenefitType[];
  rateTypes: RateType[];
  pricingMethods: PricingMethod[];

  AES_Benefits: FormArray;

  constructor(private fb: FormBuilder,
    private benefitTypeService: BenefitTypeService,
    private rateTypeService: RateTypeService,
    private pricingMethodService: PricingMethodService, ) { }

  ngOnInit() {
    var benefitTypes = localStorage.getItem('BenefitTypes');
    var rateTypes = localStorage.getItem('RateTypes');
    var pricingMethods = localStorage.getItem('PricingMethods');

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

    if (pricingMethods) this.pricingMethods = JSON.parse(pricingMethods);
    else {
      this.pricingMethodService.Get().subscribe(
        (result: PricingMethod[]) => {
          this.pricingMethods = result;
          localStorage.setItem('PricingMethods', JSON.stringify(result));
        }
      )
    }

    this.benefits.forEach((item: StaffAESBenefit) => {
      let benefit: FormGroup = this.fb.group({
        BenefitType: [item.Type],
        Rate: [item.Rate],
        RateType: [item.PricingMethod],
        Contribution: [item.Contribution],
        EffectiveDate: [item.EffectiveDate],
        ExpirationDate: [item.ExpirationDate],
        Override: [{ value: item.Override ? item.Override : false, disabled: item.Added ? item.Added : false }],
      });

      if (!this.AES_Benefits)
        this.AES_Benefits = new FormArray([]);

      this.AES_Benefits.push(benefit);
    });

    this.formReady.emit(this.AES_Benefits);
  }

  toggleAES_Override(event: any, benefit: FormGroup, indx: number) {
    let myBenefit = this.staff.AES_Benefits[indx];
    let pricingMethod = benefit.controls['RateType'].value;
    let override = benefit.controls['Override'].value;

    myBenefit.AES_UnionBenefit = this.calculateRate(myBenefit.AES_UnionBenefit, this.staff);

    if (event.checked == false) {
      benefit.controls['Rate'].setValue(myBenefit.AES_UnionBenefit.Rate);
      benefit.controls['RateType'].setValue(myBenefit.AES_UnionBenefit.PricingMethod);
      benefit.controls['BenefitType'].setValue(myBenefit.AES_UnionBenefit.Type);
      benefit.controls['EffectiveDate'].setValue(myBenefit.AES_UnionBenefit.EffectiveDate);
      benefit.controls['ExpirationDate'].setValue(myBenefit.AES_UnionBenefit.ExpirationDate);
      benefit.controls['Contribution'].setValue(myBenefit.AES_UnionBenefit.Contribution);
    }

    this.AES_Benefits[indx] = benefit;
  }

  update_AES_Contribution(rate: FormGroup, indx: number) {
    // let benefit: AES_UnionBenefit = this.calculateRate(rate, this.staff);
    if (rate['RateType'].value && rate['Rate'].value) {

      let benefit = new AES_UnionBenefit();


      benefit.Rate = rate['Rate'].value;
      benefit.PricingMethod = rate['RateType'].value;
      benefit.Type = rate['BenefitType'].value;
      benefit.Override = rate['Override'].value;
      benefit.ExpirationDate = rate['ExpirationDate'].value;
      benefit.EffectiveDate = rate['EffectiveDate'].value;

      this.staff.AES_Benefits[indx].Rate = rate['Rate'].value;
      this.staff.AES_Benefits[indx].Type = rate['BenefitType'].value;
      this.staff.AES_Benefits[indx].PricingMethod = rate['RateType'].value;
      this.staff.AES_Benefits[indx].Override = rate['Override'].value;
      this.staff.AES_Benefits[indx].ExpirationDate = rate['ExpirationDate'].value;
      this.staff.AES_Benefits[indx].EffectiveDate = rate['EffectiveDate'].value;

      benefit = this.calculateRate(benefit, this.staff);

      this.AES_Benefits.controls[indx].get('Contribution').setValue(benefit.Contribution);
    }
  }

  calculateRate(benefit: any, newStaff: Staff): AES_UnionBenefit {
    let monthlyHrs = this.calculateHours(newStaff, this.weeksPerMonth);
    let contribution: number;
    let rate: number;

    if (benefit.PricingMethod && benefit.Type && benefit.Rate) {
      switch (benefit.PricingMethod.Value) {
        case 'Flat_Reg':
        case 'Flat_All':
          if (benefit.Override) {
            contribution = benefit.Rate;
            rate = benefit.Rate;
          } else {
            if (monthlyHrs >= benefit.QualifyingHours) {
              contribution = benefit.FullContribution;
              rate = benefit.FullContribution;
            }
            else {
              contribution = benefit.MinContribution;
              rate = benefit.MinContribution;
            }
          }
          break;
        case 'Hour_Reg':
        case 'Hour_All':
        case 'HourCap_Reg':
        case 'HourCap_All':
          if (benefit.Override) {
            contribution = benefit.Rate * monthlyHrs;
            rate = benefit.Rate;
          }
          else {
            if (monthlyHrs >= benefit.QualifyingHours) {
              contribution = benefit.FullContribution * monthlyHrs;
              rate = benefit.FullContribution;
            }
            else {
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
      return null
    }
  }

  add_AES_Benefit(benefit: StaffAESBenefit): void {
    this.staff.AES_Benefits.push(benefit);
    this.AES_Benefits.push(this.Create_AES_Benefit(benefit));
  }

  Create_AES_Benefit(benefit: StaffAESBenefit): FormGroup {

    return this.fb.group({
      BenefitType: [],
      Rate: [],
      RateType: [],
      Contribution: [],
      EffectiveDate: [],
      ExpirationDate: [],
      Override: [{ value: benefit.Override, disabled: true }],
    });
  }

  add_AES_Rate() {
    let newBenefit = new StaffAESBenefit();
    newBenefit.Override = true;
    newBenefit.Added = true;
    this.add_AES_Benefit(newBenefit);
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
