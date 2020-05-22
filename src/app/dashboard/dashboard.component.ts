import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogCdfTitleComponent } from '../cdf/dialog/dialog-cdf-title/dialog-cdf-title.component';
import { CdfService } from '../_services/cdf.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    public dialog: MatDialog, 
    private CdfService: CdfService,
    private router: Router) { }

  ngOnInit() {
  }

}
