import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CDFLocation } from "src/app/_models/cdflocation";
import { PricingMethod } from "src/app/_models/pricing-method";
import { PricingMethodService } from "src/app/_services/pricing-method.service";
import { SSEType } from "src/app/_models/sse-type";
import { SSECategory } from "src/app/_models/sse-category";
import { ContractTerm } from "src/app/_models/contract-term";
import { ContractType } from "src/app/_models/contract-type";
import { SSETypeService } from "src/app/_services/sse-type.service";
import { SSECategoryService } from "src/app/_services/sse-category.service";
import { ContractTermsService } from "src/app/_services/contract-terms.service";
import { ContractTypeService } from "src/app/_services/contract-type.service";
import { CDFLocationSSE } from "src/app/_models/cdflocation-sse";
import { CdfLocationService } from "src/app/_services/cdf-location.service";
import * as moment from "moment";
import { CdfLocationSseService } from "src/app/_services/cdf-location-sse.service";
//faraz code start
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

//faraz code end

@Component({
  selector: "app-sse",
  templateUrl: "./sse.component.html",
  styleUrls: ["./sse.component.css"]
})
export class SseComponent implements OnInit {
  bankCtrl: FormControl = new FormControl();
  bankFilterCtrl: FormControl = new FormControl();

  bankCtrl1: FormControl = new FormControl();
  bankFilterCtrl1: FormControl = new FormControl();
  @Input() location: CDFLocation;
  @Input() ContractStartDate: Date;
  @Input() ContractEndDate: Date;
  @Input() WeeksPerMonth: number;
  @Output() added = new EventEmitter<CDFLocation>();

  PricingMethods: PricingMethod[];
  SSE_Types: SSEType[];
  SSE_Categories: SSECategory[];
  ContractTerms: ContractTerm[];
  ContractTypes: ContractType[];
  newSSE: CDFLocationSSE = new CDFLocationSSE();
  displayedColumns: string[] = [
    "Type",
    "Category",
    "Vendor",
    "Description",
    "ContractType",
    "PricingMethod",
    "Value",
    "MarkUp",
    "StartDate",
    "EndDate",
    "MonthlyValue"
  ];
  savingNewSSE: boolean = false;
  public filteredBanks: ReplaySubject<SSEType[]> = new ReplaySubject<SSEType[]>(1);
  public filteredBanks1: ReplaySubject<SSECategory[]> = new ReplaySubject<SSECategory[]>(1);

  constructor(
    private pricingMethodService: PricingMethodService,
    private sseTypesService: SSETypeService,
    private sseCategoriesService: SSECategoryService,
    private contractTermsService: ContractTermsService,
    private contractTypeService: ContractTypeService,
    private locService: CdfLocationService,
    private SSE_locService: CdfLocationSseService
  ) { }
  protected _onDestroy = new Subject<void>();
  ngOnInit() {
    var pricingMethods = localStorage.getItem("pricingMethods");
    var SSE_Types = localStorage.getItem("SSE_Types");
    var SSE_Categories = localStorage.getItem("SSE_Categories");
    var ContractTerms = localStorage.getItem("ContractTerms");
    var ContractTypes = localStorage.getItem("ContractTypes");

    if (pricingMethods) this.PricingMethods = JSON.parse(pricingMethods);
    else {
      this.pricingMethodService.Get().subscribe((result: PricingMethod[]) => {
        this.PricingMethods = result;
        localStorage.setItem("pricingMethods", JSON.stringify(result));
      });
    }

    if (SSE_Types) this.SSE_Types = JSON.parse(SSE_Types);
    else {
      this.sseTypesService.Get().subscribe((result: SSEType[]) => {
        this.SSE_Types = result;
        localStorage.setItem("SSE_Types", JSON.stringify(result));
      });
    }

    if (SSE_Categories) this.SSE_Categories = JSON.parse(SSE_Categories);
    else {
      this.sseCategoriesService.Get().subscribe((result: SSECategory[]) => {
        this.SSE_Categories = result;
        localStorage.setItem("SSE_Categories", JSON.stringify(result));
      });
    }

    if (ContractTerms) this.ContractTerms = JSON.parse(ContractTerms);
    else {
      this.contractTermsService.Get().subscribe((result: ContractTerm[]) => {
        this.ContractTerms = result;
        localStorage.setItem("ContractTerms", JSON.stringify(result));
      });
    }

    if (ContractTypes) this.ContractTypes = JSON.parse(ContractTypes);
    else {
      this.contractTypeService.Get().subscribe((result: ContractType[]) => {
        this.ContractTypes = result;
        localStorage.setItem("ContractTypes", JSON.stringify(result));
      });
    }

    this.newSSE.FromDate = this.ContractStartDate;
    this.newSSE.ToDate = this.ContractEndDate;
    this.newSSE.Location = this.location;

    this.filteredBanks.next(this.SSE_Types.slice());
    this.filteredBanks1.next(this.SSE_Categories.slice());

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
  }

  calculateCost(sse: CDFLocationSSE) {
    let months: number;

    if (sse.FromDate && sse.ToDate)
      months = this.calculateMonths(sse.ToDate, sse.FromDate);

    if (sse.Value && sse.PricingMethod) {
      if (sse.Markup) {
        sse.MonthlyValue =
          this.locService.calculateCost(
            this.location,
            sse.PricingMethod.Value,
            sse.Value,
            null,
            months
          ) *
          (1 + sse.Markup / 100);
      } else {
        sse.MonthlyValue = this.locService.calculateCost(
          this.location,
          sse.PricingMethod.Value,
          sse.Value,
          null,
          months
        );
      }
    }

    if (sse.Id) {
      sse.Location_Id = this.location.Id;
      this.savingNewSSE = true;
      this.SSE_locService.Post(sse).subscribe(
        result => {
          this.savingNewSSE = false;
        },
        err => {
          console.log(err);
          this.savingNewSSE = false;
        }
      );
    }
  }

  addSSE(sse: CDFLocationSSE) {
    sse.Location = this.location;
    this.savingNewSSE = true;
    this.SSE_locService.Post(sse).subscribe(
      result => {
        this.SSE_locService.GetLocationSSEs(this.location.Id).subscribe(
          (result: any) => {
            this.location.SSEs = result;
            this.savingNewSSE = false;
          }
        );
      },
      err => {
        console.log(err);
        this.savingNewSSE = false;
      }
    );

    this.clearNewSSE();
  }

  clearNewSSE() {
    this.newSSE = new CDFLocationSSE();
    this.newSSE.FromDate = this.ContractStartDate;
    this.newSSE.ToDate = this.ContractEndDate;
    this.newSSE.Location = this.location;
  }

  calculateMonths(start: Date, end: Date) {
    return moment(start).diff(moment(end), "months", true);
  }

  getPricingMethods() {
    return this.PricingMethods.filter(f => {
      return f.Type == "SSE";
    });
  }

  compareSSE_TypeMethodsFn(typeA: SSEType, typeB: SSEType) {
    return typeA && typeB ? typeA.Id === typeB.Id : typeA === typeB;
  }

  compareSSE_CategoryMethodsFn(catA: SSECategory, catB: SSECategory) {
    return catA && catB ? catA.Id === catB.Id : catA === catB;
  }

  comparePricingMethodsFn(methodA: PricingMethod, methodB: PricingMethod) {
    return methodA && methodB ? methodA.Id === methodB.Id : methodA === methodB;
  }

  compareContractTermsFn(termA: ContractTerm, termB: ContractTerm) {
    return termA && termB ? termA.Id === termB.Id : termA === termB;
  }

  compareContractTypesFn(typeA: ContractType, typeB: ContractType) {
    return typeA && typeB ? typeA.Id === typeB.Id : typeA === typeB;
  }

  protected filterBanks() {
    if (!this.SSE_Types) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.SSE_Types.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.SSE_Types.filter(SSE_Type => SSE_Type.Value.toLowerCase().indexOf(search) > -1)
    );
  }


  protected filterBanks1() {
    if (!this.SSE_Categories) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl1.value;
    if (!search) {
      this.filteredBanks1.next(this.SSE_Categories.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks1.next(
      this.SSE_Categories.filter(SSE_Categorie => SSE_Categorie.Name.toLowerCase().indexOf(search) > -1)
    );
  }

  //faraz code end
}
