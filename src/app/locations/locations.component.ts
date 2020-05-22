import { Component, OnInit } from '@angular/core';
import { LocationService } from '../_services/location.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { NewLocationComponent } from './new-location/new-location.component';
import { Router } from '@angular/router';
import { Location } from '../_models/location';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  locations: Location[];
  displayedColumns: any[];
  dataSource = new MatTableDataSource();

  constructor(private locationService: LocationService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.displayedColumns = ['Name', 'Type', 'Address', 'Address2', 'Region', 'City', 'State', 'ZipCode', 'Edit'];

    this.locationService.GetAll().subscribe((res: Location[]) => {
      this.locations = res;
      this.dataSource = new MatTableDataSource(res);
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  EditLocation(loc: Location) {
    this.router.navigate(['/editLocation', loc.Id]);
  }

}
