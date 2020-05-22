import { LocationService } from 'src/app/_services/location.service';
import { PropertyType } from './../../_models/property-type';
import { PropertyTypeService } from './../../_services/property-type.service';
import { RegionService } from './../../_services/region.service';
import { StateService } from './../../_services/state.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Region } from 'src/app/_models/region';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from 'src/app/_models/location';
import { State } from 'src/app/_models/state';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.component.html',
  styleUrls: ['./new-location.component.css']
})
export class NewLocationComponent implements OnInit {
  propertyTypes: PropertyType[];
  regions: Region[];
  id: number;
  location: Location;
  states: State[];
  readOnly: boolean;

  constructor(private fb: FormBuilder,
    private router: Router,
    private locationService: LocationService,
    private regionService: RegionService,
    private propertyTypeService: PropertyTypeService,
    private stateService: StateService,
    private route: ActivatedRoute) { }

  formGroup = this.fb.group({
    Name: ['', [Validators.required]],
    Region: ['', [Validators.required]],
    PropertyType: ['', [Validators.required]],
    Address: ['', [Validators.required]],
    Address2:[''],
    City: ['', [Validators.required]],
    State: ['', [Validators.required]],
    ZipCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    BuildSqFt: ['', [Validators.required]],
    RentableSqFt: [],
    CommonSqFt: [],
    CleanableSqFt: [],
    VacantSqFt: [],
    VacancyCredit: []
  })

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));

    var propertyTypes = localStorage.getItem('PropertyTypes');
    var regions = localStorage.getItem('Regions');

    if (propertyTypes) this.propertyTypes = JSON.parse(propertyTypes);
    else {
      this.propertyTypeService.Get().subscribe(
        (result: PropertyType[]) => {
          this.propertyTypes = result;
          localStorage.setItem('PropertyTypes', JSON.stringify(result));
        }
      )
    }

    if (regions) this.regions = JSON.parse(regions);
    else {
      this.regionService.Get().subscribe(
        (result: Region[]) => {
          this.regions = result;
          localStorage.setItem('Regions', JSON.stringify(result));
        }
      )
    }

    if (this.id) {
      this.readOnly = true;
      this.locationService.Get(this.id).subscribe(
        (result: Location) => {
          this.formGroup.patchValue(result);
          this.location = result;
        }
      )
    }else{
      this.readOnly = false;
    }

    this.states = this.stateService.getStates();
  }

  get Name() {
    return this.formGroup.get('Name') as FormControl;
  }
  get Address() {
    return this.formGroup.get('Address') as FormControl;
  }
  get Address2() {
    return this.formGroup.get('Address2') as FormControl;
  }
  get Region() {
    return this.formGroup.get('Region') as FormControl;
  }
  get PropertyType() {
    return this.formGroup.get('PropertyType') as FormControl;
  }
  get City() {
    return this.formGroup.get('City') as FormControl;
  }
  get State() {
    return this.formGroup.get('State') as FormControl;
  }
  get ZipCode() {
    return this.formGroup.get('ZipCode') as FormControl;
  }
  get BuildSqFt() {
    return this.formGroup.get('BuildSqFt') as FormControl;
  }

  saveLocation() {
    if (this.id) {
      this.mapValues();

      this.locationService.Put(this.id, this.location).subscribe(
        res => {
          this.router.navigateByUrl('/locations');
        },
        err => {
          console.log(err);
        });
    } else {
      this.locationService.Post(this.formGroup.value).subscribe(
        res => {
          this.router.navigateByUrl('/locations');
        },
        err => {
          console.log(err);
        });
    }
  }

  mapValues() {
    this.location.Name = this.formGroup.value.Name;
    this.location.Region = this.formGroup.value.Region;
    this.location.PropertyType = this.formGroup.value.PropertyType;
    this.location.Address = this.formGroup.value.Address;
    this.location.Address2 = this.formGroup.value.Address2;
    this.location.City = this.formGroup.value.City;
    this.location.State = this.formGroup.value.State;
    this.location.ZipCode = this.formGroup.value.ZipCode;
    this.location.BuildSqFt = this.formGroup.value.BuildSqFt;
    this.location.RentableSqFt = this.formGroup.value.RentableSqFt;
    this.location.CommonSqFt = this.formGroup.value.CommonSqFt;
    this.location.CleanableSqFt = this.formGroup.value.CleanableSqFt;
    this.location.VacantSqFt = this.formGroup.value.VacantSqFt;
    this.location.VacancyCredit = this.formGroup.value.VacancyCredit;

  }

  compareRegionFn(RegionA: Region, RegionB: Region) {
    return RegionA && RegionB ? RegionA.Id === RegionB.Id : RegionA === RegionB;
  }

  comparePropertyTypeFn(PropertyTypeA: PropertyType, PropertyTypeB: PropertyType) {
    return PropertyTypeA && PropertyTypeB ? PropertyTypeA.Id === PropertyTypeB.Id : PropertyTypeA === PropertyTypeB;
  }
}
