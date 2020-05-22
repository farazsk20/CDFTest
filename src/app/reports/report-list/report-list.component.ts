import {
  Component,
  OnInit,
  DoCheck,
  IterableDiffers,
  ViewChild
} from "@angular/core";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { CdfService } from "../../_services/cdf.service";
import { SelectionModel } from "@angular/cdk/collections";
@Component({
  selector: "app-report-list",
  templateUrl: "./report-list.component.html",
  styleUrls: ["./report-list.component.css"]
})
export class ReportListComponent implements OnInit, DoCheck {
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
  ) {}
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
    this.displayedColumns = [
      "Title",
      "City",
      "State",
      "NumLocations",
      "Bids",
      "OpenCdfReport",
      "OpenWctReport",
      "OpenCostAnalysisReport"
    ];
    this.initialSelection = [];
    this.selection = new SelectionModel<any>(
      this.allowMultiSelect,
      this.initialSelection
    );
    this.selectedCdf = null;
  }
  ngDoCheck() {
    // const change = this.differ.diff(this.CDF.Locations);
    // if (change != null) this.isDirty = true;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  bidId: number;
  BidSelected(Id) {
    this.bidId = Id;
  }
  openCdfReport(row) {
    if (row.Id && this.bidId) {
      this.router.navigate(["/cdf-report", row.Id, this.bidId]);
    } else {
      alert("Please select a bid to view the report");
    }
  }

  openWctReport(row) {
    if (row.Id && this.bidId) {
      this.router.navigate(["/wct-report", row.Id, this.bidId]);
    } else {
      alert("Please select a bid to view the report");
    }
  }
  openCostAnalysisReport(row) {
    if (row.Id && this.bidId) {
      this.router.navigate(["/cost-analysis-report", row.Id, this.bidId]);
    } else {
      alert("Please select a bid to view the report");
    }
  }
}
