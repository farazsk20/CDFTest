import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PricingMethod } from '../_models/pricing-method';

@Injectable({
  providedIn: 'root'
})
export class PricingMethodService {

  constructor(private http: HttpClient) { }

  Get(){
    return this.http.get(`${environment.apiEndpoint}/PricingMethods`);
  }
}
