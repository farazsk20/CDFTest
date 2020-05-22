import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Staff } from 'src/app/_models/staff';
import { CDFLocation } from 'src/app/_models/cdflocation';

@Component({
  selector: 'app-confirm-staffing-actuals',
  templateUrl: './confirm-staffing-actuals.component.html',
  styleUrls: ['./confirm-staffing-actuals.component.css']
})
export class ConfirmStaffingActualsComponent implements OnInit {
  frmStaffActuals: FormGroup;
  myStaff: FormArray;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmStaffingActualsComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.data.location.Staff.forEach((s: Staff) => {
      let staff: FormGroup = this.fb.group({
        JobClassification: [s.Classification.Value !== 'Other' ? s.Classification.Value : `${s.Classification.Value} - ${s.JobDescription}`],
        NumEmployees: [s.NumEmployees],
        Actual_NumEmployees: [s.Actual_NumEmployees]
      });

      if (!this.myStaff)
        this.myStaff = new FormArray([]);

      this.myStaff.push(staff);
    });

    this.frmStaffActuals = this.fb.group({
      Staff: this.myStaff
    });

  }

  Cancel() {
    return null;
  }

  Close() {
    let loc: CDFLocation = this.data.location;

    this.myStaff.controls.forEach((element, index) => {
      console.log(element.get('Actual_NumEmployees').value);
      loc.Staff[index].Actual_NumEmployees = element.get('Actual_NumEmployees').value;
    });

    return loc.Staff;
  }

  // private add_NonUnion_Benefit(staffBenefit: StaffNonUnionBenefit) {
  //   let benefit: FormGroup = this.fb.group({
  //     Code: [staffBenefit.NonUnionBenefit.Code],
  //     Rate: [staffBenefit.Rate],
  //     RateType: [staffBenefit.NonUnionBenefit.RateType],
  //     Contribution: [staffBenefit.Contribution],
  //     Override: [{ value: staffBenefit.Override ? staffBenefit.Override : false, disabled: true }],
  //     NonUnionBenefit: [staffBenefit.NonUnionBenefit],
  //     Markup: [this.Markup]
  //   });

  //   this._NonUnion_Benefits.push(benefit);
  // }



}
