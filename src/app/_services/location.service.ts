import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Location } from '../_models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  GetAll() {
    return this.http.get(`${environment.apiEndpoint}/Locations`);
  }

  Get(id: number) {
    return this.http.get(`${environment.apiEndpoint}/Locations/${id}`);
  }

  Post(location: Location) {
    return this.http.post(`${environment.apiEndpoint}/Locations`, location);
  }

  Put(id: number, location: Location) {
    return this.http.put(`${environment.apiEndpoint}/Locations/${id}`, location);
  }
}
