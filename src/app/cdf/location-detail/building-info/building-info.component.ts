import { TaxTypeService } from 'src/app/_services/tax-type.service';
import { StopFlag } from './../../../_models/stop-flag';
import { StopFlagService } from './../../../_services/stop-flag.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CDFLocation } from 'src/app/_models/cdflocation';
import { TaxService } from 'src/app/_services/tax.service';
import { Tax } from 'src/app/_models/tax';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { TaxInfoComponent } from '../tax-info/tax-info.component';
import { UnionService } from 'src/app/_services/union.service';
import { AES_Union } from 'src/app/_models/AES_Union';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { CBM_Union } from 'src/app/_models/CBM_Union';
import { NonUnionBenefitsService } from 'src/app/_services/non-union-benefits.service';
import { NonUnionBenefit } from 'src/app/_models/non-union-benefit';
import { CDFLocationTax } from 'src/app/_models/cdflocation-tax';
import { LocationService } from 'src/app/_services/location.service';
import { CdfLocationService } from 'src/app/_services/cdf-location.service';
import { ConfirmBenefitDeleteComponent } from '../../dialog/confirm-benefit-delete/confirm-benefit-delete.component';
import { pairwise, startWith, debounceTime } from 'rxjs/operators';
import { TaxType } from 'src/app/_models/tax-type';
import { StaffService } from 'src/app/_services/staff.service';
import { type } from 'os';
import { ToastrService } from 'ngx-toastr';
import { CdfLocactionTaxService } from 'src/app/_services/cdf-locaction-tax.service';
import { LocationSummary } from 'src/app/_models/location-summary';
//faraz code start

import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

//faraz code end
@Component({
    selector: 'app-building-info',
    templateUrl: './building-info.component.html',
    styleUrls: ['./building-info.component.css']
})
export class BuildingInfoComponent implements OnInit {

    myControl: FormControl = new FormControl();
    bankCtrl: FormControl = new FormControl();
    bankFilterCtrl: FormControl = new FormControl();

    bankCtrl1: FormControl = new FormControl();
    bankFilterCtrl1: FormControl = new FormControl();



    @Input() location: CDFLocation;
    @Input() weeks: number;
    @Input() contractStartDate: Date;
    @Input() contractEndDate: Date;
    @Input() formGroup: FormGroup;
    @Output() changed = new EventEmitter<CDFLocation>();
    @Output() formReady = new EventEmitter<FormGroup>();

    Taxes: Tax[];
    TaxTypes: TaxType[];
    AES_Unions: AES_Union[];
    CBM_Unions: CBM_Union[];
    NonUnionBenefits: NonUnionBenefit[];
    buildingInfoForm: FormGroup;
    StopFlags: StopFlag[];
    showMonthsMessage: boolean;

    public filteredBanks: ReplaySubject<CBM_Union[]> = new ReplaySubject<CBM_Union[]>(1);
    public filteredBanks1: ReplaySubject<AES_Union[]> = new ReplaySubject<AES_Union[]>(1);


    constructor(private taxService: TaxService,
        private unnionService: UnionService,
        private nonUnionService: NonUnionBenefitsService,
        private cdfLocationService: CdfLocationService,
        private stopFlagService: StopFlagService,
        private TaxTypeService: TaxTypeService,
        private TaxService: TaxService,
        private cdfLocationTaxService: CdfLocactionTaxService,
        // private bottomSheet: MatBottomSheet,
        private staffService: StaffService,
        private fb: FormBuilder,
        private benefitDialog: MatDialog,
        private locationService: CdfLocationService,
        private toastr: ToastrService) { }
    protected _onDestroy = new Subject<void>();
    ngOnInit() {
        this.AES_Unions = this.location.LOS ? this.location.LOS.AES_Unions : [];
        this.CBM_Unions = this.location.LOS ? this.location.LOS.CBM_Unions : [];
        this.NonUnionBenefits = [];
        this.StopFlags = [];
        this.TaxTypes = [];
        this.Taxes = [];

        this.filteredBanks.next(this.CBM_Unions.slice());
        this.filteredBanks1.next(this.AES_Unions.slice());

        this.bankFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterBanks();
            });

        this.bankFilterCtrl1.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterBanks1();
            });

        this.TaxTypeService.Get().subscribe(
            (result: TaxType[]) => {
                this.TaxTypes = result;
            },
            err => {
                console.log(err);
            }
        )

        this.stopFlagService.Get().subscribe(
            (result: StopFlag[]) => {
                this.StopFlags = result;
            },
            err => {
                console.log(err);
            }
        )

        this.nonUnionService.Get().subscribe(
            (result: NonUnionBenefit[]) => {
                this.NonUnionBenefits = result;
                console.log(result);

            },
            err => {
                console.log(err);
            }
        )

        this.buildingInfoForm = this.fb.group({
            StopFlag: ['', Validators.required],
            Months: [''],
            AES_Union: [''],
            CBM_Union: [''],
            Address: ['', Validators.required],
            Address2: [''],
            City: ['', Validators.required],
            State: ['', Validators.required],
            ZipCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
            BuildSqFt: ['', Validators.required],
            RentableSqFt: [''],
            CommonSqFt: [''],
            CleanableSqFt: [''],
            VacantSqFt: [''],
            NonUnionBenefit: [''],
            Markup: [''],
            Note: ['']
        });

        this.buildingInfoForm.patchValue({
            AES_Union: this.location.AES_Union,
            CBM_Union: this.location.CBM_Union,
            StopFlag: this.location.StopFlag,
            Months: this.location.Months,
            Address: this.location.Location.Address,
            Address2: this.location.Location.Address2,
            City: this.location.Location.City,
            State: this.location.Location.State,
            ZipCode: this.location.Location.ZipCode,
            BuildSqFt: this.location.BuildSqFt ? this.location.BuildSqFt : this.location.Location.BuildSqFt,
            RentableSqFt: this.location.RentableSqFt ? this.location.RentableSqFt : this.location.Location.RentableSqFt,
            CommonSqFt: this.location.CommonSqFt ? this.location.CommonSqFt : this.location.Location.CommonSqFt,
            CleanableSqFt: this.location.CleanableSqFt ? this.location.CleanableSqFt : this.location.Location.CleanableSqFt,
            VacantSqFt: this.location.VacantSqFt ? this.location.VacantSqFt : this.location.Location.VacantSqFt,
            NonUnionBenefit: this.location.NonUnionBenefit,
            Markup: this.location.Markup,
            Note: this.location.Note
            // OtherNonUnion: this.location.Other_NonUnion,
        });

        this.checkMonths(this.buildingInfoForm.get("StopFlag").value);
        this.buildingInfoForm.get('StopFlag').valueChanges.subscribe(
            (value: any) => {
                this.checkMonths(value);
            });

        this.buildingInfoForm.get('Note').valueChanges
            .pipe(debounceTime(2000))
            .subscribe(
                (value: any) => {
                    this.saveLocation();
                });


        this.buildingInfoForm.valueChanges
            .pipe(startWith(this.location), pairwise())
            .subscribe(([prev, next]: [any, any]) => {
                if (next.CBM_Union && prev.CBM_Union && next.CBM_Union.Name != prev.CBM_Union.Name && next.CBM_Union.Name != this.location.CBM_Union.Name) {
                    // this.location.CBM_Union = next.CBM_Union;
                    this.confirmBenefitDeletion('CBM', prev).then(res => {
                        this.saveLocation();
                    });
                    // this.saveLocation();
                } else if (next.AES_Union && prev.AES_Union && next.AES_Union.Name != prev.AES_Union.Name && next.AES_Union.Name != this.location.AES_Union.Name) {
                    // this.location.AES_Union = next.AES_Union;
                    this.confirmBenefitDeletion('AES', prev).then(res => {
                        this.saveLocation();
                    });
                    // this.saveLocation();
                } else if (next.NonUnionBenefit && prev.NonUnionBenefit && next.NonUnionBenefit != this.location.NonUnionBenefit) {
                    this.confirmBenefitDeletion('NonUnion', prev).then(res => {
                        this.saveLocation();
                    });
                    // this.saveLocation();
                } else {

                    if (next.CBM_Union && next.CBM_Union != prev.CBM_Union) {
                        this.location.CBM_Union = this.buildingInfoForm.controls['CBM_Union'].value;
                        this.saveLocation();
                    } else if (next.AES_Union && next.AES_Union != prev.AES_Union) {
                        this.location.AES_Union = this.buildingInfoForm.controls['AES_Union'].value;
                        this.saveLocation();
                    }

                    if (next.NonUnionBenefit && next.NonUnionBenefit != prev.NonUnionBenefit) {
                        this.location.NonUnionBenefit = this.buildingInfoForm.controls['NonUnionBenefit'].value;
                        this.saveLocation();
                    }
                    // this.changed.emit(this.location);
                }


                if (next.StopFlag && next.StopFlag != prev.StopFlag) {
                    this.saveLocation();
                }

                if (next.Markup != prev.Markup) {
                    this.saveLocation();
                }

            });

        this.formReady.emit(this.buildingInfoForm);


    }

    checkMonths(value: any): void {
        const monthsControl = this.buildingInfoForm.get('Months');

        if (value) {
            if ((value.Value === "Stop" || value.Value === "Stops Plus") && !monthsControl.value) {
                this.showMonthsMessage = true;
            }
            else {
                this.showMonthsMessage = false;
            }

            if (value.Value === "Stop" || value.Value === "Stops Plus") {
                monthsControl.setValidators([Validators.required]);
            }
            else {
                monthsControl.clearValidators();
            }

            monthsControl.updateValueAndValidity();
        }
    }

    saveLocation() {
        if (this.buildingInfoForm.get('CBM_Union').value) {
            this.location.CBM_Union = this.buildingInfoForm.get('CBM_Union').value;
        }

        if (this.buildingInfoForm.get('AES_Union').value) {
            this.location.AES_Union = this.buildingInfoForm.get('AES_Union').value;
        }

        if (this.buildingInfoForm.get('NonUnionBenefit').value) {
            this.location.NonUnionBenefit = this.buildingInfoForm.get('NonUnionBenefit').value;
        }

        if (this.buildingInfoForm.get('StopFlag').value) {
            this.location.StopFlag = this.buildingInfoForm.get('StopFlag').value;
        }

        if (this.buildingInfoForm.get('Months').value) {
            this.location.Months = this.buildingInfoForm.get('Months').value;
        }

        if (this.buildingInfoForm.get('Markup').value !== null) {
            this.location.Markup = this.buildingInfoForm.get('Markup').value;
        }

        if (this.buildingInfoForm.get('Note').value != null) {
            this.location.Note = this.buildingInfoForm.get('Note').value;
        }

        this.changed.emit(this.location);
    }

    confirmBenefitDeletion(benefitType: string, loc: CDFLocation) {
        let promise = new Promise((resolve, reject) => {

            const dialogRef = this.benefitDialog.open(ConfirmBenefitDeleteComponent, {
                width: '250px'
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result == true) {

                    this.location.Staff.forEach(staff => {
                        // if (this.location.CBM_Union) {
                        //   this.location.CBM_Union = this.buildingInfoForm.get('CBM_Union').value;
                        //   staff.CBM_Benefits = this.staffService.getCBM_UnionBenefits(staff, this.location.CBM_Union, this.weeks, this.contractStartDate, this.contractEndDate);
                        // } else if (this.location.AES_Union) {
                        //   this.location.AES_Union = this.buildingInfoForm.get('AES_Union').value;
                        //   staff.AES_Benefits = this.staffService.getAES_UnionBenefits(staff, this.location.AES_Union, this.weeks, this.contractStartDate, this.contractEndDate);
                        // } else if (staff.NonUnion_Benefits && staff.NonUnion_Benefits.length > 0) {
                        //   this.location.NonUnionBenefit = this.buildingInfoForm.get('NonUnionBenefit').value;
                        //   staff.NonUnion_Benefits = this.staffService.AddNonUnionBenefit(staff, this.location);
                        // }
                        if (staff.LaborType.Value == "Union") {
                            switch (benefitType) {
                                case 'CBM':
                                    this.location.CBM_Union = this.buildingInfoForm.get('CBM_Union').value;
                                    staff.CBM_Benefits = this.staffService.getCBM_UnionBenefits(staff, this.location.CBM_Union, this.weeks, this.contractStartDate, this.contractEndDate);

                                    break;
                                case 'AES':
                                    this.location.AES_Union = this.buildingInfoForm.get('AES_Union').value;
                                    staff.AES_Benefits = this.staffService.getAES_UnionBenefits(staff, this.location.AES_Union, this.weeks, this.contractStartDate, this.contractEndDate);

                                    break;
                            }
                        }
                        else if (staff.LaborType.Value == "Non-Union") {
                            this.location.NonUnionBenefit = this.buildingInfoForm.get('NonUnionBenefit').value;
                            staff.NonUnion_Benefits = this.staffService.AddNonUnionBenefit(staff, this.location);
                        }

                        resolve();

                    });
                    // this.changed.emit(this.location);

                } else {
                    switch (benefitType) {
                        case 'CBM':
                            this.location.CBM_Union = loc.CBM_Union;
                            this.buildingInfoForm.get('CBM_Union').setValue(loc.CBM_Union);
                            break;
                        case 'AES':
                            this.location.AES_Union = loc.AES_Union;
                            this.buildingInfoForm.get('AES_Union').setValue(loc.AES_Union);
                            break;
                        case 'NonUnion':
                            this.location.NonUnionBenefit = loc.NonUnionBenefit;
                            this.buildingInfoForm.get('NonUnionBenefit').setValue(loc.NonUnionBenefit);
                            break;
                    }

                    // this.changed.emit(this.location);
                }

                resolve();

            });
        })

        return promise;
    }

    compareAES_UnionsFn(unionA: AES_Union, unionB: AES_Union) {
        return unionA && unionB ? unionA.Id === unionB.Id : unionA === unionB;
    }

    compareCBM_UnionsFn(unionA: CBM_Union, unionB: CBM_Union) {
        return unionA && unionB ? unionA.Id === unionB.Id : unionA === unionB;
    }

    compareNonUnionFn(NonUnionA: NonUnionBenefit, NonUnionB: NonUnionBenefit) {
        return NonUnionA && NonUnionB ? NonUnionA.Id === NonUnionB.Id : NonUnionA === NonUnionB;
    }

    compareStopFlagFn(StopFlagA: StopFlag, StopFlagB: StopFlag) {
        return StopFlagA && StopFlagB ? StopFlagA.Id === StopFlagB.Id : StopFlagA === StopFlagB;
    }

    StopFlagSelected(loc: CDFLocation) {
        this.location.StopFlag = this.buildingInfoForm.controls['StopFlag'].value;

        if (this.location.StopFlag.Value === 'Stops Plus') {

            if (!this.location.Taxes.find((tax) =>
                tax.Type && tax.Type.Value === 'Stops Plus'
            )) {

                let newTax = new CDFLocationTax();
                let Type = this.TaxTypes.find((item) => item.Value === 'Stops Plus')

                if (Type) newTax.Type = Type;
                newTax.Override = true;
                newTax.Rate = 0;
                newTax.Limit = 0;
                newTax.Amount = 0;
                this.location.Taxes.push(newTax);
            }
        }
    }

    NonUnionSelected(loc: CDFLocation) {
        this.location.NonUnionBenefit = this.buildingInfoForm.controls['NonUnionBenefit'].value;
        this.changed.emit(this.location);
    }

    AES_UnionSelected(loc: CDFLocation) {
        this.location.AES_Union = this.buildingInfoForm.controls['AES_Union'].value;
        this.changed.emit(this.location);
    }

    CBM_UnionSelected(loc: CDFLocation) {
        this.location.CBM_Union = this.buildingInfoForm.controls['CBM_Union'].value;
        this.changed.emit(this.location);
    }

    protected filterBanks() {
        if (!this.CBM_Unions) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrl.value;
        if (!search) {
            this.filteredBanks.next(this.CBM_Unions.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanks.next(
            this.CBM_Unions.filter(CBM_Union => CBM_Union.Name.toLowerCase().indexOf(search) > -1)
        );
    }


    protected filterBanks1() {
        if (!this.AES_Unions) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrl1.value;
        if (!search) {
            this.filteredBanks1.next(this.AES_Unions.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanks1.next(
            this.AES_Unions.filter(AES_Union => AES_Union.Name.toLowerCase().indexOf(search) > -1)
        );
    }

    //faraz code end

}
