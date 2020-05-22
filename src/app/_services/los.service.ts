import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LOSService {

  constructor(private http: HttpClient) { }

  Get() {
    return this.http.get(`${environment.apiEndpoint}/LOS`);
  }
}
