import { Component, OnInit, Inject } from '@angular/core';
import { PricingMethodService } from 'src/app/_services/pricing-method.service';
import { CostTypeService } from 'src/app/_services/cost-type.service';
import { Cost } from 'src/app/_models/cost';
import { CDFLocationCost } from 'src/app/_models/cdflocation-cost';
import { CDFLocationCostService } from 'src/app/_services/cdflocation-cost.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PricingMethod } from 'src/app/_models/pricing-method';
import { CostType } from 'src/app/_models/cost-type';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { CdfLocationService } from 'src/app/_services/cdf-location.service';

@Component({
  selector: 'app-add-cost',
  templateUrl: './add-cost.component.html',
  styleUrls: ['./add-cost.component.css']
})
export class AddCostComponent implements OnInit {
  pricingMethods: any;
  costTypes: any;
  selectedCost: Cost;
  newCost: CDFLocationCost;
  createForm: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pricingMethodService: PricingMethodService,
    private costTypeService: CostTypeService,

    private locService: CdfLocationService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    var pricingMethods = localStorage.getItem('pricingMethods');
    var costTypes = localStorage.getItem('costTypes');

    // this.createForm = new FormGroup({
    //   Cost: new FormControl('', [Validators.required]),
    //   PricingMethod: new FormControl('', [Validators.required]),
    //   FromDate: new FormControl(this.data.ContractStartDate, []),
    //   ToDate: new FormControl(this.data.ContractEndDate, []),
    //   Value: new FormControl('', [Validators.required]),
    // });

    let fromDate = new Date(this.data.ContractStartDate);
    let toDate = new Date(this.data.ContractEndDate);

    this.createForm = this.fb.group({
      CostType: ['', [Validators.required]],
      Cost: ['', [Validators.required]],
      PricingMethod: ['', Validators.required],
      FromDate: [fromDate, Validators.required],
      ToDate: [toDate, Validators.required],
      Value: ['', Validators.required]
    });

    this.newCost = new CDFLocationCost();

    if (pricingMethods) this.pricingMethods = JSON.parse(pricingMethods);
    else {
      this.pricingMethodService.Get().subscribe(
        (result: PricingMethod[]) => {
          this.pricingMethods = result.filter((method: PricingMethod) => {
            return method.Type == 'Costs';
          });
          localStorage.setItem('pricingMethods', JSON.stringify(this.pricingMethods));
        }
      )
    }

    if (costTypes) this.costTypes = JSON.parse(costTypes);
    else {
      this.costTypeService.Get().subscribe(
        (result: CostType[]) => {
          this.costTypes = result;
          localStorage.setItem('costTypes', JSON.stringify(result));
        }
      )
    }
  }

  onClose() {
    this.newCost = Object.assign({}, this.createForm.value);
    this.newCost.Total = this.locService.calculateCost(this.data.location, this.newCost.PricingMethod.Value, this.newCost.Value, this.data.WeeksPerMonth);
    return this.newCost;
  }

}
