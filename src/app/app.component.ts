import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserService } from './_services/user.service';
import { Router } from '@angular/router';
import { SideNavService } from './_services/side-nav.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('snav') public sideNav: MatSidenav;

  title: string;
  userToken: string;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private userService: UserService, private router: Router, private sideNavService: SideNavService){
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  
  ngOnInit(): void {
    this.title = 'CDF'
    this.userService.userToken.subscribe( token => this.userToken = token);

    if(!this.userToken)
      this.userToken = localStorage.getItem('userToken');

    this.sideNavService.setSidenav(this.sideNav);
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  signout(){
    this.userService.logout();
    this.sideNavService.close();
    this.router.navigate(['/login']);
  }
}
