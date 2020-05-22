import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaxTypeService {

  constructor(private http: HttpClient) { }

  Get() {
    return this.http.get<any>(`${environment.apiEndpoint}/TaxTypes`);
  }
}
