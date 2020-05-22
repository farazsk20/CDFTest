import { CdfLocactionTaxService } from "./../../../_services/cdf-locaction-tax.service";
import { Location } from "./../../../_models/location";
import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter
} from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material";
import { Tax } from "src/app/_models/tax";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { CDFLocationTax } from "src/app/_models/cdflocation-tax";
import { CdfLocationService } from "src/app/_services/cdf-location.service";
import { TaxType } from "src/app/_models/tax-type";
import { TaxTypeService } from "src/app/_services/tax-type.service";
import { CurrencyPipe, DecimalPipe } from "@angular/common";
@Component({
  selector: "app-tax-info",
  templateUrl: "./tax-info.component.html",
  styleUrls: ["./tax-info.component.css"]
})
export class TaxInfoComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormArray>();

  taxTypes: TaxType[];

  formGroup = this.fb.group({
    months: [],
    taxes: this.fb.array([])
  });
  stopFlag: boolean;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<TaxInfoComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private data: any,
    private fb: FormBuilder,
    private cdfLocationService: CdfLocationService,
    private taxTypeService: TaxTypeService,
    private CdfLocationTaxService: CdfLocactionTaxService,
    private cp: CurrencyPipe,
    private dp: DecimalPipe
  ) {}

  ngOnInit() {
    var taxTypes = localStorage.getItem("TaxTypes");

    if (taxTypes) this.taxTypes = JSON.parse(taxTypes);
    else {
      this.taxTypeService.Get().subscribe((result: TaxType[]) => {
        this.taxTypes = result;
        localStorage.setItem("TaxTypes", JSON.stringify(result));
      });
    }

    this.data["taxes"].forEach((item: CDFLocationTax) => {
      let tax: FormGroup = this.fb.group({
        Type: [item.Type ? item.Type : item.Tax.Type],
        Rate: [item.Rate],
        Limit: [item.Limit],
        EffectiveDate: [item.EffectiveDate],
        Amount: [
          item.Amount
            ? item.Amount
            : this.CdfLocationTaxService.calculateTax(
                item,
                this.data.location,
                this.data.weeks
              )
        ],
        Override: [item.Override],
        Added: [item.Added]
      });

      this.taxes.push(tax);
    });

    this.formGroup.valueChanges.subscribe(next => {});
    this.stopFlag =
      this.data.location.StopFlag.Value == "Average" ? false : true;
  }

  public get taxes() {
    return this.formGroup.get("taxes") as FormArray;
  }

  calculateTaxAmount(tax: FormGroup, indx: number) {
    let payroll = this.cdfLocationService.getMonthlyStaffingCost(
      this.data.location,
      this.data.weeks
    );

    var myTax: CDFLocationTax = this.taxes.controls[indx].value;

    let amount = this.CdfLocationTaxService.calculateTax(
      myTax,
      this.data.location,
      this.data.weeks
    );

    tax.controls["Amount"].setValue(amount);

    // switch (myTax.Tax.Type.Value) {
    //   case 'Medicare':
    //   case 'Social Security':
    //   case 'State Unemployment Insurance':
    //     if (tax.controls.Limit) {
    //       if (limit > payroll) {
    //         tax.controls['Amount'].setValue(payroll * rate);
    //       } else {
    //         tax.controls['Amount'].setValue(limit * rate);
    //       }
    //     } else {
    //       tax.controls['Amount'].setValue(payroll * rate);
    //     }
    //     break;
    //   case 'Stops Plus':
    //     tax.controls['Amount'].setValue((numEmployees * limit * rate) + (payroll * tax.controls['additional'].value));
    //     break;
    //   default:
    //     tax.controls['Amount'].setValue(totalCosts * rate);
    //     break;
    // }
  }

  toggleTax_Override(event: any, tax: FormGroup, indx: number) {
    let currTax = this.data["taxes"][indx];

    if (event.checked == false) {
      tax.controls["Type"].setValue(currTax.Tax.Type);
      tax.controls["Rate"].setValue(currTax.Tax.Rate);
      tax.controls["Limit"].setValue(currTax.Tax.Limit);
      this.calculateTaxAmount(tax, indx);
    }

    // this.AES_Benefits[indx] = benefit;
  }

  AddNewTax() {
    let tax: FormGroup = this.fb.group({
      Type: [],
      Rate: [],
      ZipCode: [this.data.location.ZipCode],
      State: [this.data.location.State],
      Months: [12],
      Limit: [],
      EffectiveDate: [],
      Amount: [0],
      Override: [true],
      Added: [true]
    });

    this.taxes.push(tax);
  }

  cancel() {
    this.bottomSheetRef.dismiss(this.data["taxes"]);
  }

  submit() {
    this.bottomSheetRef.dismiss(this.taxes.getRawValue());
  }

  compareTaxTypeFn(TaxTypeA: TaxType, TaxTypeB: TaxType) {
    return TaxTypeA && TaxTypeB
      ? TaxTypeA.Id === TaxTypeB.Id
      : TaxTypeA === TaxTypeB;
  }
}
