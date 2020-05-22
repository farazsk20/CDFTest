import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { CDF } from '../_models/cdf';
import { LevelCost } from '../_models/level-cost';


@Injectable({
  providedIn: 'root'
})
export class CdfService {
  userInfo: any;

  constructor(private http: HttpClient) {
  }

  GetList() {
    return this.http.get<CDF>(environment.apiEndpoint + '/CDFs');
  }

  GetCdf(id) {
    return this.http.get<CDF>(environment.apiEndpoint + `/CDFs/${id}`);
  }

  Post(cdf) {
    return this.http.post(environment.apiEndpoint + '/CDFs', cdf);
  }

  GetLevelCosts(id){
    return this.http.get<LevelCost[]>(environment.apiEndpoint + `/CDFs/LevelCosts/${id}`)
  }

  Create(cdf) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

    let reqHeader = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.post(environment.apiEndpoint + '/CDFs', cdf, {
      headers: reqHeader
    });
  }

  Delete(id) {
    return this.http.delete(environment.apiEndpoint + `/CDFs/${id}`);
  }
}
