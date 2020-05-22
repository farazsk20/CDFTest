import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class SSETypeService {
  constructor(private http: HttpClient) {}

  Get() {
    return this.http.get(`${environment.apiEndpoint}/SSE_Type`);
  }
}
