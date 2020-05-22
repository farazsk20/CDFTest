import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { JobClassificationService } from "src/app/_services/job-classification.service";
import { CdfLocationService } from "src/app/_services/cdf-location.service";
import { CDFLocation } from "src/app/_models/cdflocation";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { AddStaffComponent } from "../dialog/add-staff/add-staff.component";
import { Router } from "@angular/router";
import { Staff } from "src/app/_models/staff";
import { UnionService } from "src/app/_services/union.service";
import { AES_Union } from "src/app/_models/AES_Union";
import { LocationSummary } from "src/app/_models/location-summary";
import { FormArray, FormGroup, FormBuilder } from "@angular/forms";
import { ConfirmBidDeleteComponent } from "../dialog/confirm-bid-delete/confirm-bid-delete.component";
import { ToastrService } from "ngx-toastr";
import { CdfLocactionTaxService } from "src/app/_services/cdf-locaction-tax.service";

@Component({
  selector: "app-location-detail",
  templateUrl: "./location-detail.component.html",
  styleUrls: ["./location-detail.component.css"]
})
export class LocationDetailComponent implements OnInit {
  @Input() location: CDFLocation;
  @Input() ContractStartDate: Date;
  @Input() ContractEndDate: Date;
  @Input() WeeksPerMonth: number;
  @Output() changed = new EventEmitter<CDFLocation>();
  @Output() formReady = new EventEmitter<FormGroup>();
  @Output() locationDeleted = new EventEmitter();

  @Input() formGroup: FormGroup;

  FormArray = this.fb.array([]);

  showStep: boolean = true;
  displayedColumns: any;
  initialSelection: any[];
  allowMultiSelect: boolean = true;
  selection: SelectionModel<any>;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  summary: LocationSummary;

  constructor(
    private jobClassService: JobClassificationService,
    private cdfLocationTaxService: CdfLocactionTaxService,
    private locService: CdfLocationService,
    private router: Router,
    private locationDeleteDialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.initialSelection = [];
    this.summary = new LocationSummary();

    if (!this.location.Summary) {
      this.location.Summary = <LocationSummary>(
        await this.locService.getLocationTotals(
          this.location,
          this.WeeksPerMonth
        )
      );
    }

    this.selection = new SelectionModel<any>(
      this.allowMultiSelect,
      this.initialSelection
    );

    this.location.BuildSqFt = this.location.BuildSqFt
      ? this.location.BuildSqFt
      : this.location.Location.BuildSqFt;
    this.location.RentableSqFt = this.location.RentableSqFt
      ? this.location.RentableSqFt
      : this.location.Location.RentableSqFt;
    this.location.CommonSqFt = this.location.CommonSqFt
      ? this.location.CommonSqFt
      : this.location.Location.CommonSqFt;
    this.location.CleanableSqFt = this.location.CleanableSqFt
      ? this.location.CleanableSqFt
      : this.location.Location.CleanableSqFt;
    this.location.VacantSqFt = this.location.VacantSqFt
      ? this.location.VacantSqFt
      : this.location.Location.VacantSqFt;

    this.dataSource = new MatTableDataSource(this.location.Staff);
  }

  formInitialized(name: string, form: FormGroup) {
    // this.formGroup.setControl(name, form);
    // this.FormArray.push(form);
    this.formReady.emit(form);

    console.log(`${name} has been initialized`);
  }

  confirmDelete() {
    let promise = new Promise((resolve, reject) => {
      const dialogRef = this.locationDeleteDialog.open(
        ConfirmBidDeleteComponent,
        {
          width: "250px"
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.locService.Delete(this.location.Id).subscribe(
            res => {
              this.toastr.success(
                "The bid was delete successfully!",
                "Delete!"
              );
              this.locationDeleted.emit();
            },
            err => {
              this.toastr.error(
                "The bid was not deleted successfully!",
                "Error!"
              );
            }
          );
        }

        resolve();
      });
    });

    return promise;
  }

  async onAdd() {
    // this.changed.emit(this.location);

    this.locService.SaveLocation(this.location).subscribe(
      async result => {
        this.location.Summary = <LocationSummary>(
          await this.locService.getLocationTotals(
            this.location,
            this.WeeksPerMonth
          )
        );

        if (this.location.Taxes) {
          this.location.Taxes.forEach(tax => {
            tax.Amount = this.cdfLocationTaxService.calculateTax(
              tax,
              this.location,
              this.WeeksPerMonth
            );
          });
        }

        this.locService.SaveLocation(this.location).subscribe(
          async result => {
            this.location.Summary = <LocationSummary>(
              await this.locService.getLocationTotals(
                this.location,
                this.WeeksPerMonth
              )
            );
            this.locService.recalculateCosts(this.location, this.WeeksPerMonth);
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
  }

  async onChange(loc: CDFLocation) {
    this.location = loc;
    this.location.Summary = <LocationSummary>(
      await this.locService.getLocationTotals(this.location, this.WeeksPerMonth)
    );
    this.locService.recalculateCosts(this.location, this.WeeksPerMonth);
    this.changed.emit(this.location);
  }

  async saveLocation() {
    this.toastr.info("Saving Bid", 'Save');

    this.location.Summary = <LocationSummary>await this.locService.getLocationTotals(this.location, this.WeeksPerMonth);

    if (this.location.Taxes) {
      this.location.Taxes.forEach(tax => {
        tax.Amount = this.cdfLocationTaxService.calculateTax(tax, this.location, this.WeeksPerMonth);
      });
    }

    this.locService.SaveLocation(this.location).subscribe(async result => {
      this.location.Summary = <LocationSummary>await this.locService.getLocationTotals(this.location, this.WeeksPerMonth);
      this.toastr.success("Saved Bid Successfully", 'Success');
    },
      err => {
        this.toastr.error("Error Saving Bid!", 'Error');

      });
  }

}
