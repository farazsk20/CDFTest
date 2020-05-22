import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  MatTableDataSource,
  MatDialog,
  MatBottomSheet
} from "@angular/material";
import { CDFLocation } from "src/app/_models/cdflocation";
import { AddStaffComponent } from "../../dialog/add-staff/add-staff.component";
import { SelectionModel } from "@angular/cdk/collections";
import { StaffService } from "src/app/_services/staff.service";
import { Staff } from "src/app/_models/staff";
import { CdfLocationService } from "src/app/_services/cdf-location.service";
import { AesUnionInfoComponent } from "../aes-union-info/aes-union-info.component";
import { CbmUnionInfoComponent } from "../cbm-union-info/cbm-union-info.component";
import { AngularWaitBarrier } from "blocking-proxy/built/lib/angular_wait_barrier";
import { ToastrService } from "ngx-toastr";
import { ConfirmStaffingActualsComponent } from "../../dialog/confirm-staffing-actuals/confirm-staffing-actuals.component";
import { LocationSummary } from "src/app/_models/location-summary";
import { CdfLocactionTaxService } from "src/app/_services/cdf-locaction-tax.service";

@Component({
  selector: "app-staffing-details",
  templateUrl: "./staffingDetails.component.html",
  styleUrls: ["./staffingDetails.component.css"]
})
export class staffingDetailsComponent implements OnInit {
  @Input() location: CDFLocation;
  @Input() ContractStartDate: Date;
  @Input() ContractEndDate: Date;
  @Input() WeeksPerMonth: number;
  @Output() added = new EventEmitter<CDFLocation>();

  dataSource: MatTableDataSource<any>;
  selection: SelectionModel<any>;
  displayedColumns: string[];
  initialSelection: any[];
  allowMultiSelect: boolean = true;

  constructor(
    public dialog: MatDialog,
    private staffService: StaffService,
    private locService: CdfLocationService,
    private cdfLocationTaxService: CdfLocactionTaxService,
    private bottomSheet: MatBottomSheet,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.displayedColumns = [
      "Select",
      "Classification",
      "Number",
      "Hours",
      "Days",
      // "WeeklyHours",
      "MonthlyHours",
      "Rate",
      // "WeeklyCost",
      "MonthlyCost",
      "Benefits"
    ];

    this.initialSelection = [];

    this.selection = new SelectionModel<any>(
      this.allowMultiSelect,
      this.initialSelection
    );

    this.dataSource = new MatTableDataSource(this.location.Staff);

    // this.getDailyHourTotal();
    // this.getEmployeeCount();
    // this.getMonthlyCost();
    // this.getWeeklyCost();
  }

  EditStaff(Staff: Staff) {
    const dialogRef = this.dialog.open(AddStaffComponent, {
      width: "1000px",
      disableClose: true,
      data: {
        location: this.location,
        ContractStartDate: this.ContractStartDate,
        ContractEndDate: this.ContractEndDate,
        WeeksPerMonth: this.WeeksPerMonth,
        Staff: Staff
      }
    });

    dialogRef.afterClosed().subscribe((result: Staff) => {
      if (result != null) {
        this.toastr.info("Saving updates...", "Saving");
        let res: Staff = result;

        res.CDFLocation_Id = this.location.Id;

        if (res.LaborType.Value == "Union") {
          res.NonUnion_Benefits = [];
        } else {
          res.AES_Benefits = [];
          res.CBM_Benefits = [];
        }

        this.staffService.Post(res).subscribe((res: Staff) => {
          this.staffService.Get(res.Id).subscribe(async (response: Staff) => {
            var elementPos = this.location.Staff.map(function(x) {
              return x.Id;
            }).indexOf(res.Id);
            this.location.Staff.splice(elementPos, 1, response);

            this.dataSource = new MatTableDataSource(this.location.Staff);

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
                this.locService.recalculateCosts(
                  this.location,
                  this.WeeksPerMonth
                );
                this.toastr.success("Saved Successfully", "Success");
              },
              err => {
                this.toastr.error("Error Saving!", "Error");
              }
            );

            this.selection.clear();
          });
        });
      }
    });
  }

  AddNewStaff() {
    const dialogRef = this.dialog.open(AddStaffComponent, {
      width: "1000px",
      disableClose: true,
      data: {
        location: this.location,
        ContractStartDate: this.ContractStartDate,
        ContractEndDate: this.ContractEndDate,
        WeeksPerMonth: this.WeeksPerMonth
      }
    });

    dialogRef.afterClosed().subscribe((result: Staff) => {
      if (result != null) {
        let res: Staff = result;
        this.toastr.info("Saving updates...", "Saving");

        res.CDFLocation_Id = this.location.Id;

        if (res.LaborType.Value == "Union") {
          res.NonUnion_Benefits = [];
        } else {
          res.AES_Benefits = [];
          res.CBM_Benefits = [];
        }

        this.staffService.Post(res).subscribe((response: Staff) => {
          res.Id = response.Id;

          this.staffService.Get(response.Id).subscribe((response: Staff) => {
            if (this.location.Staff) this.location.Staff.push(response);
            else this.location.Staff = [response];

            this.dataSource = new MatTableDataSource(this.location.Staff);
            this.added.emit(this.location);
          });
        });
      }
    });
  }

  RemoveStaff() {
    this.selection.selected.forEach(element => {
      this.location.Staff.map((s, indx) => {
        if (s.Id === element.Id) {
          this.location.Staff.splice(indx, 1);
          console.log(element);
          this.added.emit(this.location);
        }
      });
    });

    this.dataSource.data = this.location.Staff;
  }

  confirmActuals() {
    const dialogRef = this.dialog.open(ConfirmStaffingActualsComponent, {
      width: "800px",
      disableClose: true,
      data: {
        location: this.location
      }
    });

    dialogRef.afterClosed().subscribe((result: Staff[]) => {
      if (result != null) {
        result.forEach((staff: Staff, index) => {
          this.location.Staff[index].Actual_NumEmployees =
            staff.Actual_NumEmployees;
        });

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
    });
  }

  openBenefitsBottomSheet(staff: Staff): void {
    if (staff.AES_Benefits.length > 0) {
      this.bottomSheet.open(AesUnionInfoComponent, {
        data: { Benefits: staff.AES_Benefits },
        panelClass: "TaxesBottomSheet"
      });
    } else if (staff.CBM_Benefits.length > 0) {
      this.bottomSheet.open(CbmUnionInfoComponent, {
        data: { Benefits: staff.CBM_Benefits },
        panelClass: "TaxesBottomSheet"
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
