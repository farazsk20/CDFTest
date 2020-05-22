import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { CDFLocationSSE } from "../_models/cdflocation-sse";

@Injectable({
  providedIn: "root"
})
export class CdfLocationSseService {
  constructor(private http: HttpClient) {}

  GetLocationSSEs(id: number) {
    return this.http.get(`${environment.apiEndpoint}/GetLocationSSEs/${id}`);
  }

  Post(sse: CDFLocationSSE) {
    return this.http.post(`${environment.apiEndpoint}/CDFLocationSSEs`, sse);
  }
}
