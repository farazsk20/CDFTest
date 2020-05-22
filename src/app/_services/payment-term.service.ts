import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentTermService {

  constructor(private http: HttpClient) { }

  Get() {
    return this.http.get(`${environment.apiEndpoint}/PaymentTerms`);
  }
}
