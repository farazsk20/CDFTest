import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userToken : string;


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.userToken.subscribe( token => this.userToken = token);

    if(!this.userToken)
      this.userToken = localStorage.getItem('userToken');
  }

  signout(){
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
