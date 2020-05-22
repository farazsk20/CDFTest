import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { AES_UnionBenefit } from 'src/app/_models/AES_UnionBenefit';
import { StaffAESBenefit } from 'src/app/_models/staff-aes-benefit';

@Component({
  selector: 'app-aes-union-info',
  templateUrl: './aes-union-info.component.html',
  styleUrls: ['./aes-union-info.component.css']
})
export class AesUnionInfoComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<AesUnionInfoComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) private data: StaffAESBenefit[]) { }

  ngOnInit() {
    console.log(this.data);
  }

}
