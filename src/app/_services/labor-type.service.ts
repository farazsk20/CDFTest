import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LaborTypeService {

  constructor(private http: HttpClient) { }

  Get() {
    return this.http.get<any>(`${environment.apiEndpoint}/LaborTypes`);
  }
}
