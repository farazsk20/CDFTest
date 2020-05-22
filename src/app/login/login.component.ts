import { Component, OnInit, Output } from '@angular/core';
import { UserService } from '../_services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  OnSubmit(userName,password){
    this.userService.authenticate(userName,password).subscribe(
      (data : any) => {
        this.router.navigate(['/dashboard']);
        this.userService.setTokenValue(data.access_token);

        this.userService.getUserClaims().subscribe(
          (userInfo : any) => {
            localStorage.setItem('userInfo',JSON.stringify(userInfo));
          },
          (err : HttpErrorResponse) => {

          }
        )

      },
      (err : HttpErrorResponse) => {
        
      }  
    )
  }

}
