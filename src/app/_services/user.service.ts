import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User } from "../_models/user";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private userTokenSource = new BehaviorSubject("");
  userToken = this.userTokenSource.asObservable();

  constructor(private http: HttpClient) { }

  getUserClaims() {
    return this.http.get<any>(`${environment.apiEndpoint}/GetUserClaims`);
  }

  authenticate(userName, password) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let data = `grant_type=password&username=${userName}&password=${password}`;

    return this.http.post(environment.authEndpoint, data, { headers });
  }

  setTokenValue(token) {
    if (token) {
      localStorage.setItem('userToken', token);
      this.userTokenSource.next(token);
    } else {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      this.userTokenSource.next('');
    }
  }

  logout() {
    // remove user from local storage to log user out
    this.setTokenValue(null);
  }
}
