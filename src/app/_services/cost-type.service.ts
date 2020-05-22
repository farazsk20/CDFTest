import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostTypeService {

  constructor(private http: HttpClient) { }

  Get(){
    return this.http.get(`${environment.apiEndpoint}/CostTypes`);
  }

}
