import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CDFLocation } from "src/app/_models/cdflocation";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { AddCostComponent } from "../../dialog/add-cost/add-cost.component";
import { PricingMethodService } from "src/app/_services/pricing-method.service";
import { PricingMethod } from "src/app/_models/pricing-method";
import { CDFLocationCostService } from "src/app/_services/cdflocation-cost.service";
import { CDFLocationCost } from "src/app/_models/cdflocation-cost";
import { GroupByPipe } from "ngx-pipes";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { transformAll } from "@angular/compiler/src/render3/r3_ast";
import { SelectionModel } from "@angular/cdk/collections";
import { UnionService } from "src/app/_services/union.service";
import { AES_Union } from "src/app/_models/AES_Union";
import { CdfLocationService } from "src/app/_services/cdf-location.service";
import { CostService } from "src/app/_services/cost.service";
import { Cost } from "src/app/_models/cost";
import * as moment from "moment";
import { CostPricingMethod } from "src/app/_models/cost-pricing-method";
import { CostType } from "src/app/_models/cost-type";
import { CostTypeService } from "src/app/_services/cost-type.service";
import { CdkFixedSizeVirtualScroll } from "@angular/cdk/scrolling";
//faraz code start

import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

//faraz code end

@Component({
  selector: "app-costs",
  templateUrl: "./costs.component.html",
  styleUrls: ["./costs.component.css"]
})
export class CostsComponent implements OnInit {
  bankCtrl: FormControl = new FormControl();
  bankFilterCtrl: FormControl = new FormControl();

  bankCtrl1: FormControl = new FormControl();
  bankFilterCtrl1: FormControl = new FormControl();

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
  PricingMethods: PricingMethod[];
  costTypes: CostType[];
  Costs: Cost[];
  requiredCosts: Cost[];
  optionalCosts: Cost[];
  newCost: CDFLocationCost = new CDFLocationCost();
  savingNewCost: boolean = false;
  public filteredBanks: ReplaySubject<CostType[]> = new ReplaySubject<CostType[]>(1);
  public filteredBanks1: ReplaySubject<Cost[]> = new ReplaySubject<Cost[]>(1);
  constructor(
    public dialog: MatDialog,
    private CDFLocationCostService: CDFLocationCostService,
    private cdfLocationCost: CDFLocationCostService,
    private groupBy: GroupByPipe,
    private pricingMethodService: PricingMethodService,
    private costTypeService: CostTypeService,
    private locService: CdfLocationService,
    private costService: CostService
  ) { }
  protected _onDestroy = new Subject<void>();
  ngOnInit() {
    var pricingMethods = localStorage.getItem("pricingMethods");
    var costTypes = localStorage.getItem("costTypes");

    if (pricingMethods) this.PricingMethods = JSON.parse(pricingMethods);
    else {
      this.pricingMethodService.Get().subscribe((result: PricingMethod[]) => {
        this.PricingMethods = result;
        localStorage.setItem("pricingMethods", JSON.stringify(result));
      });
    }

    if (costTypes) this.costTypes = JSON.parse(costTypes);
    else {
      this.costTypeService.Get().subscribe((result: CostType[]) => {
        this.costTypes = result;
        localStorage.setItem("costTypes", JSON.stringify(result));
      });
    }

    this.costService.Get().subscribe((result: Cost[]) => {
      this.Costs = result;

      this.requiredCosts = result.filter(function (cost) {
        return cost.Required == true;
      });

      if (!this.location.Costs) this.location.Costs = [];

      this.requiredCosts.forEach(required => {
        let exist = this.location.Costs.map(function (cost) {
          return cost.Id == required.Id;
        });

        if (!exist) {
          // let newCost: CDFLocationCost = required;
          // this.location.Costs.push(newCost);
        }
      });
    });

    if (!this.location.Staff) this.location.Staff = [];

    this.displayedColumns = [
      "Name",
      "PricingMethod",
      "Value",
      "MonthlyCost",
      "YearlyCost",
      "StartDate",
      "EndDate"
    ];

    this.initialSelection = [];
    this.selection = new SelectionModel<any>(
      this.allowMultiSelect,
      this.initialSelection
    );

    this.dataSource = new MatTableDataSource(this.location.Staff);

    this.newCost.FromDate = this.ContractStartDate;
    this.newCost.ToDate = this.ContractEndDate;
    this.newCost.Location = this.location;
    this.filteredBanks.next(this.costTypes.slice());


    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });

    // this.filteredBanks1.next(this.Costs.slice());
    // this.bankFilterCtrl1.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterBanks1();
    //   });

    // this.calculateTotals();
  }

  clearNewCost() {
    this.newCost = new CDFLocationCost();
    this.newCost.FromDate = this.ContractStartDate;
    this.newCost.ToDate = this.ContractEndDate;
    this.newCost.Location = this.location;
  }

  filterCosts(type: string) {
    return this.Costs
      ? this.Costs.filter(cost => {
        return cost.CostType ? cost.CostType.Value == type : false;
      })
      : null;
  }

  calculateCost(cost: CDFLocationCost) {
    // let type = cost.Cost.Name;
    // let newValue = this.locService.calculateCost(
    //   loc,
    //   cost.PricingMethod.Value,
    //   cost.Value,
    //   weeks
    // );

    // cost.Total = newValue;

    cost.Total = this.locService.calculateCost(
      this.location,
      cost.PricingMethod.Value,
      cost.Value,
      this.WeeksPerMonth
    );

    if (cost.Actual_Value) {
      cost.Actual_Total = this.locService.calculateCost(
        this.location,
        cost.PricingMethod.Value,
        cost.Actual_Value,
        this.WeeksPerMonth
      );
    } else {
      cost.Actual_Value = cost.Value;
      cost.Actual_Total = cost.Total;
    }

    if (cost.Id) {
      cost.Location_Id = this.location.Id;
      this.savingNewCost = true;
      this.cdfLocationCost.Post(cost).subscribe(
        result => {
          this.savingNewCost = false;
        },
        err => {
          console.log(err);
          this.savingNewCost = false;
        }
      );
    }
  }

  addCost(cost: CDFLocationCost) {
    this.savingNewCost = true;

    this.cdfLocationCost.Post(cost).subscribe(
      result => {
        this.CDFLocationCostService.GetLocationCosts(
          this.location.Id
        ).subscribe((result: any) => {
          this.location.Costs = result;
          this.clearNewCost();
          this.savingNewCost = false;
        });
      },
      err => {
        console.log(err);
        this.savingNewCost = false;
      }
    );
  }

  getPricingMethods(cost: Cost) {
    if (cost) {
      let pricingMethods: PricingMethod[] = [];

      cost.CostPricingMethods.forEach(m => {
        pricingMethods.push(m.PricingMethod);
      });

      return pricingMethods;
    } else {
      return null;
    }
  }

  AddNewCost() {
    const dialogRef = this.dialog.open(AddCostComponent, {
      width: "650px",
      disableClose: true,
      data: {
        location: this.location,
        ContractStartDate: moment(this.ContractStartDate).format("L"),
        ContractEndDate: moment(this.ContractEndDate).format("L"),
        WeeksPerMonth: this.WeeksPerMonth
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      let res: CDFLocationCost = result;
      res.Location = this.location;

      this.cdfLocationCost.Post(res).subscribe(
        result => {
          this.CDFLocationCostService.GetLocationCosts(
            this.location.Id
          ).subscribe((result: any) => {
            this.location.Costs = result;
          });
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  compareCostsFn(costA: Cost, costB: Cost) {
    return costA && costB ? costA.Id === costB.Id : costA === costB;
  }

  comparePricingMethodsFn(methodA: PricingMethod, methodB: PricingMethod) {
    return methodA && methodB ? methodA.Id === methodB.Id : methodA === methodB;
  }
  protected filterBanks() {
    if (!this.costTypes) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.costTypes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.costTypes.filter(costType => costType.Value.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterBanks1() {
    if (!this.Costs) {
      return;
    }

    // get the search keyword
    let search = this.bankFilterCtrl1.value;
    if (!search) {
      this.filteredBanks1.next(this.Costs.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks1.next(
      this.Costs.filter(Cost => Cost.Name.toLowerCase().indexOf(search) > -1)
    );
  }
}
