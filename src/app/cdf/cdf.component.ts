import {
  Component,
  OnInit,
  DoCheck,
  IterableDiffers,
  ViewChild
} from "@angular/core";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { AddLocationComponent } from "./dialog/add-location/add-location.component";
import { Router } from "@angular/router";
import { CdfService } from "../_services/cdf.service";
import { DialogCdfTitleComponent } from "./dialog/dialog-cdf-title/dialog-cdf-title.component";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-cdf",
  templateUrl: "./cdf.component.html",
  styleUrls: ["./cdf.component.css"]
})
export class CdfComponent implements OnInit, DoCheck {
  newCDF: any;
  CDF: any;
  differ: any;
  changed: boolean;
  isDirty: boolean;
  dataSource: MatTableDataSource<any[]>;
  displayedColumns: any[];
  initialSelection: any[];
  allowMultiSelect: boolean = true;
  selection: SelectionModel<any>;
  selectedCdf: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private cdfService: CdfService,
    private differs: IterableDiffers
  ) { }

  ngOnInit() {
    if (localStorage.getItem("current_CDF"))
      this.CDF = JSON.parse(localStorage.getItem("newCDF"));

    this.cdfService.GetList().subscribe(
      (result: any) => {
        this.dataSource = new MatTableDataSource(result);
      },
      err => {
        console.log(err);
      }
    );

    this.differ = this.differs.find([]).create(null);

    this.displayedColumns = ["Select", "Id", "Title", "City", "State", "NumLocations", "Edit"];
    this.initialSelection = [];
    this.selection = new SelectionModel<any>(
      this.allowMultiSelect,
      this.initialSelection
    );
    this.selectedCdf = null;
  }

  ngDoCheck() {
    // const change = this.differ.diff(this.CDF.Locations);

    // if (change != null) this.isDirty = true;
  }

  openTitleDialog() {
    const dialogRef = this.dialog.open(DialogCdfTitleComponent, {
      width: "500px",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // If the portfolio is successfully created, then navigate to CDF
      if (result.Id != null) this.router.navigate(["/cdfDetails", result.Id]);
    });
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

  editCdf(row) {
    if (row.Id)
      this.router.navigate(["/cdfDetails", row.Id]);
  }

  //faraz code start
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
