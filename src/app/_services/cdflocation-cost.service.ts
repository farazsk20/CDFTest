import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CDFLocationCost } from '../_models/cdflocation-cost';

@Injectable({
  providedIn: 'root'
})
export class CDFLocationCostService {

  constructor(private http: HttpClient) { }

  GetLocationCosts(id:number){
    return this.http.get(`${environment.apiEndpoint}/GetLocationCosts/${id}`);
  }
  
  Post(cost: CDFLocationCost){
    return this.http.post(`${environment.apiEndpoint}/CDFLocationCosts`, cost);
  }
}
