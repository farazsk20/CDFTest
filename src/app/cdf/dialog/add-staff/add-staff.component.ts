import { NonUnionBenefit } from './../../../_models/non-union-benefit';
import { AddAesBenefitComponent } from './../add-aes-benefit/add-aes-benefit.component';
import { StaffAESBenefit } from './../../../_models/staff-aes-benefit';
import { AddNonunionBenefitComponent } from './../add-nonunion-benefit/add-nonunion-benefit.component';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange, MatDialog, MatRadioChange, MatRadioButton, MatInput } from '@angular/material';
import { StaffService } from 'src/app/_services/staff.service';
import { Staff } from 'src/app/_models/staff';
import { JobClassificationService } from 'src/app/_services/job-classification.service';
import { JobClassification } from 'src/app/_models/job-classification';
import { HWStatusService } from 'src/app/_services/hwstatus.service';
import { LaborTypeService } from 'src/app/_services/labor-type.service';
import { ShiftService } from 'src/app/_services/shift.service';
import { PdfLayoutBreakType } from '@syncfusion/ej2-pdf-export';
import { Shift } from 'src/app/_models/shift';
import { HWStatus } from 'src/app/_models/hw-status';
import { LaborType } from 'src/app/_models/labor-type';
import { CDFLocation } from 'src/app/_models/cdflocation';
import * as moment from 'moment';
import { AES_UnionBenefit } from 'src/app/_models/AES_UnionBenefit';
import { NgForm, FormBuilder, FormGroup, FormArray, FormsModule, Validators } from '@angular/forms';
import { CBM_Union } from 'src/app/_models/CBM_Union';
import { RateType } from 'src/app/_models/rate-type';
import { CBM_Rate } from 'src/app/_models/CBM_Rate';
import { pairwise } from 'rxjs/operators';
import { RateTypeService } from 'src/app/_services/rate-type.service';
import { StaffCBMBenefit } from 'src/app/_models/staff-cbm-benefit';
import { BenefitTypeService } from 'src/app/_services/benefit-type.service';
import { BenefitType } from 'src/app/_models/benefit-type';
import { PricingMethod } from 'src/app/_models/pricing-method';
import { PricingMethodService } from 'src/app/_services/pricing-method.service';
import { AES_Union } from 'src/app/_models/AES_Union';
import { StaffNonUnionBenefit } from 'src/app/_models/staff-non-union-benefit';
import { CbmUnionBenefitsComponent } from './cbm-union-benefits/cbm-union-benefits.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AddCbmBenefitComponent } from '../add-cbm-benefit/add-cbm-benefit.component';
import { ConfirmBenefitDeleteComponent } from '../confirm-benefit-delete/confirm-benefit-delete.component';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {
  original: Staff;
  jobClassifications: JobClassification[];
  shiftTypes: Shift[];
  hwStatusTypes: HWStatus[];
  rateTypes: RateType[];
  benefitTypes: BenefitType[];
  pricingMethods: PricingMethod[];
  laborTypes: LaborType[];
  selected: JobClassification;
  newStaff: Staff;
  location: CDFLocation;
  WeeksPerMonth: number;
  Markup: number;
  otherClassification: boolean = false;
  jobNoMatch: boolean = false;
  classification: any;

  // @ViewChild('frmAddLOS') ngForm: NgForm;
  frmAddStaff: FormGroup;
  filteredJobs: Observable<JobClassification[]>;

  @ViewChild('ClassificationFld') classificationFld: MatInput;



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddStaffComponent>,
    private jobClassService: JobClassificationService,
    private hwStatusService: HWStatusService,
    private shiftTypeService: ShiftService,
    private laborTypeService: LaborTypeService,
    private rateTypeService: RateTypeService,
    private benefitTypeService: BenefitTypeService,
    private pricingMethodService: PricingMethodService,
    private staffService: StaffService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private benefitDialog: MatDialog,
    private element: ElementRef
  ) {
  }

  ngOnInit() {
    var jobClassifications = localStorage.getItem('jobClassifications');
    var hwStatuses = localStorage.getItem('HWStatuses');
    var shifts = localStorage.getItem('Shifts');
    var laborTypes = localStorage.getItem('laborTypes');
    var rateTypes = localStorage.getItem('RateTypes');
    var benefitTypes = localStorage.getItem('BenefitTypes');
    var pricingMethods = localStorage.getItem('PricingMethods');
    this.location = this.data.location;
    this.newStaff = new Staff();
    this.WeeksPerMonth = this.data.WeeksPerMonth;
    this.Markup = this.location.Markup;


    if (benefitTypes) this.benefitTypes = JSON.parse(benefitTypes);
    else {
      this.benefitTypeService.Get().subscribe(
        (result: BenefitType[]) => {
          this.benefitTypes = result;
          localStorage.setItem('BenefitTypes', JSON.stringify(result));
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

    if (rateTypes) this.rateTypes = JSON.parse(rateTypes);
    else {
      this.rateTypeService.Get().subscribe(
        (result: RateType[]) => {
          this.rateTypes = result;
          localStorage.setItem('RateTypes', JSON.stringify(result));
        }
      )
    }

    if (shifts) this.shiftTypes = JSON.parse(shifts);
    else {
      this.shiftTypeService.Get().subscribe(
        (result: Shift[]) => {
          this.shiftTypes = result;
          localStorage.setItem('Shifts', JSON.stringify(result));
        }
      )
    }

    if (hwStatuses) this.hwStatusTypes = JSON.parse(hwStatuses);
    else {
      this.hwStatusService.Get().subscribe(
        (result: HWStatus[]) => {
          this.hwStatusTypes = result;
          localStorage.setItem('HWStatuses', JSON.stringify(result));
        }
      )
    }

    if (jobClassifications) this.jobClassifications = JSON.parse(jobClassifications);
    else {
      this.jobClassService.Get().subscribe(
        (result: JobClassification[]) => {
          this.jobClassifications = result;
          localStorage.setItem('jobClassifications', JSON.stringify(result));
        }
      )
    }

    if (laborTypes) this.laborTypes = JSON.parse(laborTypes);
    else {
      this.laborTypeService.Get().subscribe(
        (result: LaborType[]) => {
          this.laborTypes = result;
          localStorage.setItem('laborTypes', JSON.stringify(result));
        }
      )
    }

    if (!this.newStaff.Shift)
      this.newStaff.Shift = null;

    this.frmAddStaff = this.fb.group({
      Classification: ['', Validators.required],
      NumEmployees: ['', Validators.required],
      DailyHours: ['', Validators.required],
      DaysPerWeek: ['', Validators.required],
      Rate: ['', Validators.required],
      ProductionRate: [true],
      Shift: ['', Validators.required],
      LaborType: ['', Validators.required],
      HWStatus: ['', Validators.required],
      CBM_Benefits: this.fb.array([]),
      AES_Benefits: this.fb.array([]),
      NonUnion_Benefits: this.fb.array([]),
    });

    this.filteredJobs = this.frmAddStaff.controls['Classification'].valueChanges
      .pipe(
        startWith(''),
        map(job => {

          if (job.length < 1) {
            this.jobNoMatch = false;//to make sure this is reset
            return [];
          }
          var jobs = job ? this._filterJobs(job) : this.jobClassifications.slice();


          if (jobs.length === 0) {//autocomplete did not return anything

            this.jobNoMatch = true;

          } else {
            this.jobNoMatch = false;
          }
          return jobs;
        })
      );


    if (this.data.Staff) {
      this.newStaff = this.data.Staff;
      this.original = JSON.parse(JSON.stringify(this.data.Staff));;


      if (this.newStaff.Classification.Value.toLowerCase() === "other") {
        this.classification = this.newStaff.JobDescription;
        this.frmAddStaff.patchValue({
          Classification: { Id: null, Value: this.newStaff.JobDescription, Code: null }
        });
      }
      else {
        this.classification = this.newStaff.Classification;
        this.frmAddStaff.patchValue({
          Classification: this.newStaff.Classification
        });
      }

      this.frmAddStaff.patchValue({
        // Classification: classification,
        NumEmployees: this.newStaff.NumEmployees,
        DailyHours: this.newStaff.DailyHours,
        DaysPerWeek: this.newStaff.DaysPerWeek,
        Rate: this.newStaff.Rate,
        ProductionRate: this.newStaff.ProductionRate,
        Shift: this.newStaff.Shift,
        LaborType: this.newStaff.LaborType,
        HWStatus: this.newStaff.HWStatus
      });

      // Add CBM Benefits
      if (this.newStaff.CBM_Benefits && this.newStaff.CBM_Benefits.length > 0) {
        this.add_CBM_Benefits(this.newStaff.CBM_Benefits);
      } else if (this.newStaff.AES_Benefits && this.newStaff.AES_Benefits.length > 0) {
        this.add_AES_Benefits(this.newStaff.AES_Benefits);
      } else if (this.newStaff.NonUnion_Benefits && this.newStaff.NonUnion_Benefits.length > 0) {
        this.newStaff.NonUnion_Benefits = this.staffService.AddNonUnionBenefit(this.newStaff, this.location);
        this.add_NonUnion_Benefits(this.newStaff.NonUnion_Benefits);
      }

    }
    else {
      this.newStaff = new Staff();

      if (this.location.LOS.CBM_Unions.length > 0)
        this.newStaff.ProductionRate = true;
    }


    this.frmAddStaff.valueChanges.subscribe((next: Staff) => {
      if (this.frmAddStaff.valid) {

        if (!this.newStaff.Actual_NumEmployees) {
          this.newStaff.Actual_NumEmployees = this.newStaff.NumEmployees;
        }

        // Get the AES benefits
        if (next.LaborType.Value == 'Union' && this.location.LOS.AES_Unions.length > 0 && this.hasBenefits() == false) {
          this.newStaff.AES_Benefits = this.staffService.getAES_UnionBenefits(this.newStaff, this.location.AES_Union, this.WeeksPerMonth, this.data.ContractStartDate, this.data.ContractEndDate);
          this.add_AES_Benefits(this.newStaff.AES_Benefits);
        }

        // Get the CBM benefits
        if (next.LaborType.Value == 'Union' && this.location.LOS.CBM_Unions.length > 0 && this.hasBenefits() == false) {
          this.newStaff.CBM_Benefits = this.staffService.getCBM_UnionBenefits(this.newStaff, this.location.CBM_Union, this.WeeksPerMonth, this.data.ContractStartDate, this.data.ContractEndDate);
          this.add_CBM_Benefits(this.newStaff.CBM_Benefits);
        }

        // Get the NonUnion benefits
        if (next.LaborType.Value == 'Non-Union' && this.location.NonUnionBenefit && this.hasBenefits() == false) {
          this.newStaff.NonUnion_Benefits = this.staffService.AddNonUnionBenefit(this.newStaff, this.location);
          this.add_NonUnion_Benefits(this.newStaff.NonUnion_Benefits);
        }
      }
    })
  }

  get _CBM_Benefits() {
    return this.frmAddStaff.get('CBM_Benefits') as FormArray;
  }

  get _NonUnion_Benefits() {
    return this.frmAddStaff.get('NonUnion_Benefits') as FormArray;
  }

  get _AES_Benefits() {
    return this.frmAddStaff.get('AES_Benefits') as FormArray;
  }

  get _LaborType() {
    return this.frmAddStaff.get('LaborType') as FormArray;
  }

  hasBenefits(): boolean {
    if ((this._AES_Benefits && this._AES_Benefits.length > 0)
      || (this._CBM_Benefits && this._CBM_Benefits.length > 0)
      || (this._NonUnion_Benefits && this._NonUnion_Benefits.length > 0))
      return true;
    else
      return false;
  }

  updateBenefits() {
    if (this.frmAddStaff.valid) {
      if (this._CBM_Benefits && this._CBM_Benefits.length > 0) {
        this._CBM_Benefits.controls.forEach(benefit => {
          benefit.get('Contribution').setValue(this.staffService.calculateCBMRate(benefit.get('Rate').value, benefit.get('RateType').value.Value, this.newStaff, this.WeeksPerMonth));
        })
      }

      else if (this._AES_Benefits && this._AES_Benefits.length > 0) {
        this._AES_Benefits.controls.forEach(benefit => {
          let rate = benefit.value;

          let myBenefit = new AES_UnionBenefit();


          myBenefit.Rate = rate['Rate'];
          myBenefit.PricingMethod = rate['Type'];
          myBenefit.Type = rate['PricingMethod'];
          myBenefit.Override = rate['Override'];
          myBenefit.ExpirationDate = rate['ExpirationDate'];
          myBenefit.EffectiveDate = rate['EffectiveDate'];

          myBenefit = this.staffService.calculateAESBenefit(rate, this.newStaff, this.WeeksPerMonth);

          benefit.get('Contribution').setValue(myBenefit.Contribution);

        })
      }

      else if (this._NonUnion_Benefits && this._NonUnion_Benefits.length > 0) {
        this._NonUnion_Benefits.controls.forEach(benefit => {
          benefit.get('Contribution').setValue(this.staffService.calculateNonUnionTotal(benefit.get('Rate').value, this.newStaff, this.location.Markup));
        })
      }
    }
  }



  laborTypeChange(event: MatRadioChange) {
    let prev: LaborType;

    if (this.frmAddStaff.valid) {

      if (event.value.Id == 1) {
        prev = this.laborTypes.find(obj => obj.Id == 2);
      } else {
        prev = this.laborTypes.find(obj => obj.Id == 1);
      }

      const dialogRef = this.benefitDialog.open(ConfirmBenefitDeleteComponent, {
        width: '250px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          if (this.frmAddStaff.valid) {
            if (event.value.Value == 'Non-Union') {
              // Remove the current benefits from the form
              if (this._CBM_Benefits && this._CBM_Benefits.controls.length > 0) {
                while (this._CBM_Benefits.controls[0]) {
                  this._CBM_Benefits.removeAt(0);
                }
              } else if (this._AES_Benefits && this._AES_Benefits.controls.length > 0) {
                while (this._AES_Benefits.controls[0]) {
                  this._AES_Benefits.removeAt(0);
                }
              }
            } else {
              // Remove the current benefits from the form
              while (this._NonUnion_Benefits.controls[0]) {
                this._NonUnion_Benefits.removeAt(0);
              }
            }
          }
        } else {
          this.frmAddStaff.get('LaborType').setValue(prev);
        }
      });
    }
  }

  HWStatusChange(event: MatRadioChange) {
    const prev: HWStatus = this.newStaff.HWStatus;
    let laborType: LaborType = this.frmAddStaff.get('LaborType').value;

    this.newStaff.HWStatus = event.value;

    if (this.frmAddStaff.valid) {

      const dialogRef = this.benefitDialog.open(ConfirmBenefitDeleteComponent, {
        width: '250px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          if (laborType.Value == 'Non-Union') {
            this.removeBenefits('Non-Union');
          } else {
            if (this._CBM_Benefits && this._CBM_Benefits.controls.length > 0) {
              this.removeBenefits('CBM');

            } else if (this._AES_Benefits && this._AES_Benefits.controls.length > 0) {
              this.removeBenefits('AES');
            }
          }

        } else {
          this.newStaff.HWStatus = prev;
          this.frmAddStaff.get('HWStatus').setValue(prev);
        }
      });
    }
  }

  private removeBenefits(type: string) {
    let promise = new Promise((resolve, reject) => {
      switch (type) {
        case 'CBM':
          for (let index = this._CBM_Benefits.length - 1; index >= 0; index--) {
            this._CBM_Benefits.removeAt(index);
          }
          break;
        case 'AES':
          for (let index = this._AES_Benefits.length - 1; index >= 0; index--) {
            this._AES_Benefits.removeAt(index);
          }
          break;
        case 'Non-Union':
          for (let index = this._NonUnion_Benefits.length - 1; index >= 0; index--) {
            this._NonUnion_Benefits.removeAt(index);
          }
      }
      resolve();
    })

    return promise;
  }


  private add_AES_Benefits(benefits: StaffAESBenefit[]) {
    if (benefits && benefits.length > 0) {
      benefits.forEach((item: StaffAESBenefit) => {
        this.add_AES_Benefit(item);
      });
    }
  }

  private add_CBM_Benefits(benefits: StaffCBMBenefit[]) {
    if (benefits && benefits.length > 0) {
      benefits.forEach((item: StaffCBMBenefit) => {
        this.add_CBM_Benefit(item);
      });
    }
  }

  private add_NonUnion_Benefits(benefits: StaffNonUnionBenefit[]) {
    if (benefits && benefits.length > 0) {
      benefits.forEach((item: StaffNonUnionBenefit) => {
        this.add_NonUnion_Benefit(item);
      });
    }
  }

  private update_AES_Benefit(indx: number, staffBenefit: StaffAESBenefit) {
    let benefit = this._AES_Benefits.controls[indx];

    benefit.patchValue({
      Rate: staffBenefit.Rate,
      Contribution: staffBenefit.Contribution,
      EffectiveDate: staffBenefit.EffectiveDate,
      ExpirationDate: staffBenefit.ExpirationDate,
      Override: staffBenefit.Override,
      Added: staffBenefit.Added,
      Active: staffBenefit.Active,
      QualifyingHours: staffBenefit.QualifyingHours,
      MinContribution: staffBenefit.MinContribution,
      FullContribution: staffBenefit.FullContribution,
      RateNumber: staffBenefit.RateNumber,
      AES_UnionBenefit: staffBenefit.AES_UnionBenefit,
    });

    if (benefit.get('Type').value.Value != staffBenefit.Type.Value) {
      benefit.patchValue({
        BenefitType: staffBenefit.Type
      })
    }

    if (benefit.get('PricingMethod').value.Value != staffBenefit.PricingMethod.Value) {
      benefit.patchValue({
        RateType: staffBenefit.PricingMethod
      })
    }

  }

  private update_CBM_Benefit(indx: number, staffBenefit: StaffCBMBenefit) {
    let benefit = this._CBM_Benefits.controls[indx];

    benefit.patchValue({
      Rate: staffBenefit.Rate,
      Contribution: staffBenefit.Contribution,
      EffectiveDate: staffBenefit.EffectiveDate,
      ExpirationDate: staffBenefit.ExpirationDate,
      Override: staffBenefit.Override,
      Added: staffBenefit.Added,
      Active: staffBenefit.Active
    });

    if (benefit.get('BenefitType').value.Value != staffBenefit.BenefitType.Value) {
      benefit.patchValue({
        BenefitType: staffBenefit.BenefitType
      })
    }

    if (benefit.get('RateType').value.Value != staffBenefit.RateType.Value) {
      benefit.patchValue({
        RateType: staffBenefit.RateType
      })
    }

  }

  private update_NonUnion_Benefit(indx: number, staffBenefit: StaffNonUnionBenefit) {
    let benefit = this._NonUnion_Benefits.controls[indx];

    staffBenefit.Contribution = staffBenefit.Rate * (1 + this.location.Markup / 100);

    benefit.patchValue({
      Rate: staffBenefit.Rate,
      Contribution: staffBenefit.Contribution,
      Override: staffBenefit.Override,
      NonUnionBenefit: staffBenefit.NonUnionBenefit
    });

    if (benefit.get('RateType').value.Value != staffBenefit.RateType.Value) {
      benefit.patchValue({
        RateType: staffBenefit.RateType
      })
    }

  }

  private add_NonUnion_Benefit(staffBenefit: StaffNonUnionBenefit) {
    let benefit: FormGroup = this.fb.group({
      Code: [staffBenefit.NonUnionBenefit.Code],
      Rate: [staffBenefit.Rate],
      RateType: [staffBenefit.NonUnionBenefit.RateType],
      Contribution: [staffBenefit.Contribution],
      Override: [{ value: staffBenefit.Override ? staffBenefit.Override : false, disabled: true }],
      NonUnionBenefit: [staffBenefit.NonUnionBenefit],
      Markup: [this.Markup]
    });

    this._NonUnion_Benefits.push(benefit);
  }

  private add_CBM_Benefit(staffBenefit: StaffCBMBenefit) {

    let benefit: FormGroup = this.fb.group({
      BenefitType: [staffBenefit.BenefitType],
      Rate: [staffBenefit.Rate],
      RateType: [staffBenefit.RateType],
      Contribution: [staffBenefit.Contribution],
      EffectiveDate: [staffBenefit.EffectiveDate],
      ExpirationDate: [staffBenefit.ExpirationDate],
      Override: [{ value: staffBenefit.Override ? staffBenefit.Override : false, disabled: true }],
      Added: [{ value: staffBenefit.Added, disabled: true }],
      Active: [{ value: staffBenefit.Active, disabled: true }]
    });

    this._CBM_Benefits.push(benefit);
  }


  private add_AES_Benefit(staffBenefit: StaffAESBenefit) {

    let benefit: FormGroup = this.fb.group({
      Type: [staffBenefit.Type],
      Rate: [staffBenefit.Rate],
      PricingMethod: [staffBenefit.PricingMethod],
      Contribution: [staffBenefit.Contribution],
      EffectiveDate: [staffBenefit.EffectiveDate],
      ExpirationDate: [staffBenefit.ExpirationDate],
      Override: [{ value: staffBenefit.Override ? staffBenefit.Override : false, disabled: true }],
      Added: [{ value: staffBenefit.Added, disabled: true }],
      Active: [{ value: staffBenefit.Active, disabled: true }],
      QualifyingHours: [staffBenefit.QualifyingHours],
      MinContribution: [staffBenefit.MinContribution],
      FullContribution: [staffBenefit.FullContribution],
      RateNumber: [staffBenefit.RateNumber],
      AES_UnionBenefit: [staffBenefit.AES_UnionBenefit],
    });

    this._AES_Benefits.push(benefit);
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
      Added: [benefit.Added],
      Active: [benefit.Active]
    });
  }

  Create_AES_Benefit(benefit: StaffAESBenefit): FormGroup {
    return this.fb.group({
      BenefitType: [benefit.Type],
      Rate: [benefit.Rate],
      RateType: [benefit.PricingMethod],
      Contribution: [benefit.Contribution],
      EffectiveDate: [benefit.EffectiveDate],
      ExpirationDate: [benefit.ExpirationDate],
      Override: [{ value: benefit.Override, disabled: true }],
      Added: [benefit.Added],
      Active: [benefit.Active],
      QualifyingHours: [benefit.QualifyingHours],
      MinContribution: [benefit.MinContribution],
      FullContribution: [benefit.FullContribution],
      RateNumber: [benefit.RateNumber],
      AES_UnionBenefit: [benefit.AES_UnionBenefit],
    });
  }

  editCBMBenefit(indx: number) {
    let line = this._CBM_Benefits.controls[indx] as FormGroup;

    let dialogRef = this.dialog.open(AddCbmBenefitComponent, {
      width: '400px',
      data: {
        benefit: line.getRawValue(),
        staff: this.newStaff,
        WeeksPerMonth: this.WeeksPerMonth,
        BidStartDate: this.data.ContractStartDate,
        BidEndDate: this.data.ContractEndDate,
        indx: indx
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.update_CBM_Benefit(indx, result);
    })
  }

  editAESBenefit(indx: number) {
    let line = this._AES_Benefits.controls[indx] as FormGroup;

    let dialogRef = this.dialog.open(AddAesBenefitComponent, {
      width: '400px',
      data: {
        benefit: line.getRawValue(),
        staff: this.newStaff,
        WeeksPerMonth: this.WeeksPerMonth,
        BidStartDate: this.data.ContractStartDate,
        BidEndDate: this.data.ContractEndDate,
        indx: indx
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.update_AES_Benefit(indx, result);
    })
  }

  editNonUnionBenefit(indx: number) {
    let line = this._NonUnion_Benefits.controls[indx] as FormGroup;

    let dialogRef = this.dialog.open(AddNonunionBenefitComponent, {
      width: '400px',
      data: {
        benefit: line.getRawValue(),
        staff: this.newStaff,
        WeeksPerMonth: this.WeeksPerMonth,
        BidStartDate: this.data.ContractStartDate,
        BidEndDate: this.data.ContractEndDate,
        indx: indx,
        Markup: this.data.location.Markup
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.update_NonUnion_Benefit(indx, result);
    })
  }

  add_CBM_Rate() {
    let newBenefit = new StaffCBMBenefit();
    newBenefit.Override = true;
    newBenefit.Added = true;

    // this.Add_CBM_Benefit(newBenefit);

    let dialogRef = this.dialog.open(AddCbmBenefitComponent, {
      width: '400px',
      data: {
        benefit: newBenefit,
        staff: this.newStaff,
        WeeksPerMonth: this.WeeksPerMonth,
        BidStartDate: this.data.ContractStartDate,
        BidEndDate: this.data.ContractEndDate
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.add_CBM_Benefit(result);
    })
  }

  add_AES_Rate() {
    let newBenefit = new StaffAESBenefit();
    newBenefit.Override = true;
    newBenefit.Added = true;

    let dialogRef = this.dialog.open(AddAesBenefitComponent, {
      width: '400px',
      data: {
        benefit: newBenefit,
        staff: this.newStaff,
        WeeksPerMonth: this.WeeksPerMonth,
        BidStartDate: this.data.ContractStartDate,
        BidEndDate: this.data.ContractEndDate
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.add_AES_Benefit(result);
    })
  }

  private _filterJobs(value: string | JobClassification): JobClassification[] {
    if (typeof (value) === "object") {
      value = value.Value;
    }
    const filterValue = value.toString().toLowerCase();
    var jobClassifications = this.jobClassifications.filter(job => job.Value.toLowerCase().indexOf(filterValue) === 0);
    return jobClassifications;
  }

  getOptionText(option) {
    return option.Value;
  }

  CloseDialog() {


    this.SetValues();

    if (this.data.Staff) {
      this.newStaff.Id = this.data.Staff.Id;
    }

    return this.newStaff;
  }

  CancelChanges() {
    this.newStaff = this.original ? JSON.parse(JSON.stringify(this.original)) : this.newStaff;
  }

  private SetValues() {
    let Staff = this.newStaff;
    if (this.otherClassification === true) {
      this.newStaff.JobDescription = this.frmAddStaff.controls['Classification'].value;
      this.newStaff.Classification = null;
    }
    else {
      this.newStaff.Classification = this.frmAddStaff.controls['Classification'].value;
    }
    this.newStaff.NumEmployees = this.frmAddStaff.controls['NumEmployees'].value;
    this.newStaff.DailyHours = this.frmAddStaff.controls['DailyHours'].value;
    this.newStaff.DaysPerWeek = this.frmAddStaff.controls['DaysPerWeek'].value;
    this.newStaff.Rate = this.frmAddStaff.controls['Rate'].value;
    this.newStaff.ProductionRate = this.frmAddStaff.controls['ProductionRate'].value;
    this.newStaff.Shift = this.frmAddStaff.controls['Shift'].value;
    this.newStaff.LaborType = this.frmAddStaff.controls['LaborType'].value;
    this.newStaff.HWStatus = this.frmAddStaff.controls['HWStatus'].value;
    this.newStaff.CDFLocation_Id = Staff.CDFLocation_Id;
    this.newStaff.Id = Staff.Id;
    this.newStaff.Actual_NumEmployees = this.frmAddStaff.controls['NumEmployees'].value;

    if (this.frmAddStaff.controls['CBM_Benefits']) {

      for (let index = 0; index < this._CBM_Benefits.length; index++) {
        const benefit = this._CBM_Benefits.controls[index];
        let currentBenefit = this.newStaff.CBM_Benefits[index];

        if (currentBenefit) {
          currentBenefit.BenefitType = benefit.get('BenefitType').value;
          currentBenefit.Rate = benefit.get('Rate').value;
          currentBenefit.RateType = benefit.get('RateType').value;
          currentBenefit.Contribution = benefit.get('Contribution').value;
          currentBenefit.EffectiveDate = benefit.get('EffectiveDate').value;
          currentBenefit.ExpirationDate = benefit.get('ExpirationDate').value;
          currentBenefit.Override = benefit.get('Override').value;
          currentBenefit.Added = benefit.get('Added').value;
          currentBenefit.Active = benefit.get('Active').value;
        } else {
          let newBenefit = new StaffCBMBenefit();

          newBenefit.BenefitType = benefit.get('BenefitType').value;
          newBenefit.Rate = benefit.get('Rate').value;
          newBenefit.RateType = benefit.get('RateType').value;
          newBenefit.Contribution = benefit.get('Contribution').value;
          newBenefit.EffectiveDate = benefit.get('EffectiveDate').value;
          newBenefit.ExpirationDate = benefit.get('ExpirationDate').value;
          newBenefit.Override = benefit.get('Override').value;
          newBenefit.Added = benefit.get('Added').value;
          newBenefit.Active = benefit.get('Active').value;

          this.newStaff.CBM_Benefits.push(newBenefit);
        }
      }
    }

    if (this.frmAddStaff.controls['AES_Benefits']) {
      for (let index = 0; index < this._AES_Benefits.length; index++) {
        const benefit = this._AES_Benefits.controls[index] as FormGroup;
        let currentBenefit = this.newStaff.AES_Benefits[index];

        if (currentBenefit) {
          currentBenefit.Type = benefit.get('Type').value;
          currentBenefit.Rate = benefit.get('Rate').value;
          currentBenefit.PricingMethod = benefit.get('PricingMethod').value;
          currentBenefit.Contribution = benefit.get('Contribution').value;
          currentBenefit.EffectiveDate = benefit.get('EffectiveDate').value;
          currentBenefit.ExpirationDate = benefit.get('ExpirationDate').value;
          currentBenefit.Override = benefit.get('Override').value;
          currentBenefit.Added = benefit.get('Added').value;
          currentBenefit.Active = benefit.get('Active').value;
        } else {
          this.newStaff.AES_Benefits.push(benefit.getRawValue());
        }
      }
    }

    if (this.frmAddStaff.controls['NonUnion_Benefits']) {

      for (let index = 0; index < this._NonUnion_Benefits.length; index++) {
        const benefit = this._NonUnion_Benefits.controls[index];
        let currentBenefit = this.newStaff.NonUnion_Benefits[index];

        if (currentBenefit) {
          currentBenefit.Rate = benefit.get('Rate').value;
          currentBenefit.RateType = benefit.get('RateType').value;
          currentBenefit.Contribution = benefit.get('Contribution').value;
          currentBenefit.Override = benefit.get('Override').value;
        } else {
          this.newStaff.NonUnion_Benefits.push(benefit.value);
        }
      }
    }

  }

  formInitialized(name: string, form: FormGroup) {
    this.frmAddStaff.setControl(name, form);
  }

  toggleCBM_Override(event: MatCheckboxChange, benefit: FormGroup, indx: number) {
    let myBenefit = this.newStaff.CBM_Benefits[indx];
    let pricingMethod = benefit.controls['RateType'].value;
    let override = benefit.controls['Override'].value;

    benefit.controls['Override'].setValue(!myBenefit.Override);

    if (event.checked == false) {
      benefit.controls['Rate'].setValue(this.getRate(myBenefit.RateNumber, myBenefit.CBM_Rate));
      benefit.controls['RateType'].setValue(myBenefit.CBM_Rate_Type);
      benefit.controls['BenefitType'].setValue(myBenefit.CBM_Rate.BenefitType);
      benefit.controls['EffectiveDate'].setValue(myBenefit.CBM_Rate.EffectiveDate);
      benefit.controls['ExpirationDate'].setValue(myBenefit.CBM_Rate.ExpirationDate);
      benefit.controls['Contribution'].setValue(this.staffService.calculateCBMRate(benefit.controls['Rate'].value, myBenefit.RateType.Value, this.newStaff, this.WeeksPerMonth));
    }

    this.frmAddStaff.controls.CBM_Benefits[indx] = benefit;
  }

  Add_CBM_Benefit(benefit: StaffCBMBenefit): void {
    this.newStaff.CBM_Benefits.push(benefit);
    this._CBM_Benefits.push(this.Create_CBM_Benefit(benefit));
  }

  Add_AES_Benefit(benefit: StaffAESBenefit): void {
    this.newStaff.AES_Benefits.push(benefit);
    this._AES_Benefits.push(this.Create_AES_Benefit(benefit));
  }



  addRate() {

    if (this.newStaff.AES_Benefits.length > 0) {
      let newBenefit = new StaffAESBenefit();
      newBenefit.Override = true;
      this.newStaff.AES_Benefits.push(newBenefit);
    } else {
      let newBenefit = new StaffCBMBenefit();
      newBenefit.Override = true;
      this.newStaff.CBM_Benefits.push(newBenefit);
    }

  }

  toggleAES_Override(event: any, benefit: StaffAESBenefit) {
    if (!benefit.Added)
      benefit.Added = false;
    // if (event.checked == false) {
    //   this.calculateBenefit(benefit.AES_UnionBenefit, this.newStaff);
    // }
  }

  checkCBM_RateValidity(benefit: StaffAESBenefit) {
    if (benefit.Type && benefit.Rate && benefit.PricingMethod) {
      return true;
    } else {
      return false;
    }
  }

  checkAES_RateValidity(benefit: StaffAESBenefit) {
    if (benefit.PricingMethod && benefit.Rate && benefit.Type) {
      return true;
    } else {
      return false;
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

  updateContribution(rate: CBM_Rate) {
    rate.Contribution = this.staffService.calculateRate(rate.Rate, rate.RateType.Value, this.newStaff, this.WeeksPerMonth);
  }

  changeLaborType(laborType: LaborType) {
    this.newStaff.LaborType = laborType;
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

  checkClassification() {
    if (this.jobNoMatch) {
      var confirmResult = confirm("There is no matching Job classification. Do you wish to continue and save it?")

      if (confirmResult) {
        this.otherClassification = true;
      } else {
        this.otherClassification = false;//Classification is set to focus here to let the user type
        // this.element.nativeElement.querySelector('Classification').focus();
        this.classificationFld.focus();
        this.jobNoMatch = false;
      }

    }
  }

}
