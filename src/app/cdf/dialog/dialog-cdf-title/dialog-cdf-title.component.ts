import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { CdfService } from "src/app/_services/cdf.service";
import { Router } from "@angular/router";
import { CDF } from "src/app/_models/cdf";
import { CdfComponent } from "../../cdf.component";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { IndustryService } from 'src/app/_services/industry.service';
import { CompanyService } from 'src/app/_services/company.service';
import { ContractTypeService } from 'src/app/_services/contract-type.service';
import { Industry } from "src/app/_models/industry";
import { Company } from "src/app/_models/company";
import { ContractType } from "src/app/_models/contract-type";

@Component({
  selector: "app-dialog-cdf-title",
  templateUrl: "./dialog-cdf-title.component.html",
  styleUrls: ["./dialog-cdf-title.component.css"]
})
export class DialogCdfTitleComponent implements OnInit {
  cdf: CDF
  userInfo: any;
  CdfForm: FormGroup;
  Industries: Industry[];
  Companies: Company[];
  ContractTypes: ContractType[];

  constructor(
    public dialogRef: MatDialogRef<DialogCdfTitleComponent>,
    private CdfService: CdfService,
    private router: Router,

    private IndustryService: IndustryService,
    private CompanyService: CompanyService,
    private ContractTypeService: ContractTypeService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.cdf = new CDF();
    var Industries = localStorage.getItem('Industries');
    var Companies = localStorage.getItem('Companies');
    var ContractTypes = localStorage.getItem('ContractTypes');
    var PaymentTerms = localStorage.getItem('PaymentTerms');

    if (Industries) this.Industries = JSON.parse(Industries);
    else {
      this.IndustryService.Get().subscribe(
        (result: Industry[]) => {
          this.Industries = result;
          localStorage.setItem('Industries', JSON.stringify(result));
        }
      )
    }

    if (Companies) this.Companies = JSON.parse(Companies);
    else {
      this.CompanyService.Get().subscribe(
        (result: Company[]) => {
          this.Companies = result;
          localStorage.setItem('Companies', JSON.stringify(result));
        }
      )
    }

    if (ContractTypes) this.ContractTypes = JSON.parse(ContractTypes);
    else {
      this.ContractTypeService.Get().subscribe(
        (result: ContractType[]) => {
          this.ContractTypes = result;
          localStorage.setItem('ContractTypes', JSON.stringify(result));
        }
      )
    }

    // this.CdfForm = new FormGroup({
    //   Title: new FormControl('', [Validators.required]),
    //   Company: new FormControl(''),
    //   CustomerName: new FormControl(''),
    //   JobNumber: new FormControl(''),
    //   PricingLead: new FormControl(''),
    //   SalesLead: new FormControl(''),
    //   ContractType: new FormControl(''),
    //   Industry: new FormControl(''),
    //   ContractStartDate: new FormControl('', [Validators.required]),
    //   ContractEndDate: new FormControl('', [Validators.required]),
    //   ContractExecutionDate: new FormControl(''),
    //   SubmissionDate: new FormControl(''),
    // });

    this.CdfForm = this.fb.group({
      Title: ['', Validators.required],
      Company: ['', Validators.required],
      CustomerName: [''],
      JobNumber: [''],
      PricingLead: [''],
      SalesLead: [''],
      ContractType: [''],
      Industry: [''],
      ContractStartDate: ['', Validators.required],
      ContractEndDate: ['', Validators.required],
      ContractExecutionDate: [''],
      SubmissionDate: [''],
    })

    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.cdf.UserId = this.userInfo.Id;
  }

  close() {
    // Create the CDF
    this.CdfService.Create(this.CdfForm.value).subscribe(
      (result: any) => {
        localStorage.setItem("current_CDF", JSON.stringify(result));

        this.dialogRef.close(result);
      },
      err => {
        console.log(err);
      }
    );
  }
}
