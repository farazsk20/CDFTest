import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private http: HttpClient) {}

  Get(){
    return this.http.get<any>(`${environment.apiEndpoint}/Regions`);
  }
}
