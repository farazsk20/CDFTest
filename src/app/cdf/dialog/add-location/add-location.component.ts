import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { RegionService } from "src/app/_services/region.service";
import { HttpErrorResponse } from "@angular/common/http";
import { LOSService } from "src/app/_services/los.service";
import { LOS } from "src/app/_models/los";
import { CDFLocation } from "src/app/_models/cdflocation";
import { UnionService } from "src/app/_services/union.service";
import { AES_Union } from "src/app/_models/AES_Union";
import { CostService } from "src/app/_services/cost.service";
import { Cost } from "src/app/_models/cost";
import { CDFLocationCost } from "src/app/_models/cdflocation-cost";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: "app-add-location",
  templateUrl: "./add-location.component.html",
  styleUrls: ["./add-location.component.css"]
})
export class AddLocationComponent implements OnInit {

  myControl: FormControl = new FormControl();
  myControlloc: FormControl = new FormControl();
  myControllos: FormControl = new FormControl();
  options = [
    'One',
    'Two',
    'Three'
  ];
  filteredOptions: Observable<any[]>;
  filteredOptionsLoc: Observable<any[]>;
  filteredOptionsLos: Observable<any[]>;
  regions: any[];
  Locations: any[];
  selectedRegion: any;
  selectedLocation: CDFLocation;
  LOS: LOS[];
  Costs: Cost[];
  regions1: any[];

  constructor(
    public dialogRef: MatDialogRef<AddLocationComponent>,
    private router: Router,
    private regionService: RegionService,
    private losService: LOSService,
    private costService: CostService,
    private unnionService: UnionService
  ) { }

  ngOnInit() {
    this.selectedLocation = new CDFLocation();

    this.regionService.Get().subscribe(
      result => {
        this.regions = result;
        // faraz code start
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(null),
            map(val => this.filter(val))
          );
        // faraz code end
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );


    this.losService.Get().subscribe(
      (result: LOS[]) => {
        this.LOS = result;
        this.filteredOptionsLos = this.myControllos.valueChanges
          .pipe(
            startWith(null),
            map(val => this.filterLos(val))
          );
      }
    );

  }

  regionSelect(region) {
    debugger;
    // this.Locations = region.Locations;
    // this.selectedRegion = null;
    region = this.regions1;
    this.Locations = region[0].Locations;
    this.selectedRegion = null;
    this.filteredOptionsLoc = this.myControlloc.valueChanges
      .pipe(
        startWith(null),
        map(val => this.filterLoc(val))
      );
  }

  filter(val: any): string[] {

    this.regions1 = this.regions;
    let realval = val && typeof val === 'object' ? val.Name : val;
    let result = [];
    let lastOption = null;
    for (let i = 0; i < this.regions1.length; i++) {
      this.regions1[i].Name.toLowerCase().s
      if (!realval || this.regions1[i].Name.toLowerCase().indexOf(realval.toLowerCase()) !== -1) {
        if (this.regions1[i].Name !== lastOption) {
          lastOption = this.regions1[i].Name;
          result.push(this.regions1[i]);
        }
      }
    }
    this.regions1 = result;
    return result;
  }

  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.Name : value;
  }

  filterLoc(val: any): string[] {


    let realval = val && typeof val === 'object' ? val.Name : val;
    let result = [];
    let lastOption = null;
    for (let i = 0; i < this.Locations.length; i++) {
      if (!realval || this.Locations[i].Name.toLowerCase().indexOf(realval.toLowerCase()) !== -1) {
        if (this.Locations[i].Name !== lastOption) {
          lastOption = this.Locations[i].Name;
          result.push(this.Locations[i]);
        }
      }
    }
    // this.Locations = result;
    return result;
  }

  displayFnLoc(value: any): string {
    return value && typeof value === 'object' ? value.Name : value;
  }

  filterLos(val: any): string[] {


    let realval = val && typeof val === 'object' ? val.Name : val;
    let result = [];
    let lastOption = null;
    for (let i = 0; i < this.LOS.length; i++) {
      if (!realval || this.LOS[i].Value.toLowerCase().indexOf(realval.toLowerCase()) !== -1) {
        if (this.LOS[i].Value !== lastOption) {
          lastOption = this.LOS[i].Value;
          result.push(this.LOS[i]);
        }
      }
    }
    // this.Locations = result;
    return result;
  }

  displayFnLos(value: any): string {
    return value && typeof value === 'object' ? value.Value : value;
  }


}
