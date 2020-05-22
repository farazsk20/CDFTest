import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class ContractTypeService {
  constructor(private http: HttpClient) {}

  Get() {
    return this.http.get(`${environment.apiEndpoint}/ContractTypes`);
  }
}
