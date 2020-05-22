import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tax } from '../_models/tax';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  constructor(private http: HttpClient) { }

  public Get(ZipCode?: string, State?: string) : Promise<any> {

    let params = new HttpParams();
    params = params.append('ZipCode', ZipCode);
    params = params.append('State', State);

    return this.http.get(`${environment.apiEndpoint}/GetAllTaxes`, { params: params }).toPromise();
  }
}
