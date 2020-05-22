import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-tax',
  templateUrl: './add-tax.component.html',
  styleUrls: ['./add-tax.component.css']
})
export class AddTaxComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddTaxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) { }

  frmBidTax: FormGroup;


  ngOnInit() {
    this.frmBidTax = this.fb.group({
      Type: ['', Validators.required],
      Rate: ['', Validators.required],
      EffectiveDate: ['', Validators.required],
      Amount: [''],
      Override: [false],
      Added: [false]
    });

    if (this.data.tax) {
      this.frmBidTax.patchValue(this.data.tax);
    }
  }

}
