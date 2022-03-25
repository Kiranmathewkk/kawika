import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { environment } from  "../../environments/environment";
import { debounceTime } from "rxjs/operators";
@Injectable()
export class SharedService {
  public headers = new HttpHeaders()
    .set("content-type", "application/json")
    .set("Access-Control-Allow-Origin", "*");

  constructor(private http: HttpClient) {}

//   public login(data:any) {
//     return this.http.get(`${environment.apiUrl}/login`,data);
//   }

  public createTodos(data:any) {
    return this.http.post(`${environment.apiUrl}/todo/create`, data);
  }

  public deleteSingleTodos(id:any) {
    return this.http.delete(`${environment.apiUrl}/` + id);
  }

  public updateSingleTodos(data:any) {
    return this.http.put(`${environment.apiUrl}/todo/update`, data);
  }
}