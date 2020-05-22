import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-cbm-union-info',
  templateUrl: './cbm-union-info.component.html',
  styleUrls: ['./cbm-union-info.component.css']
})
export class CbmUnionInfoComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<CbmUnionInfoComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) private data: any[]) { }

  ngOnInit() {
    console.log(this.data);
  }

}
