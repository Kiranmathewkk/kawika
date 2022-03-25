import { Injectable,OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient,HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { User } from "../_model/users";
// import { HttpClient, HttpErrorResponse } from "@angular/common/http";
@Injectable({ providedIn: "root" })
export class AccountService implements OnInit{
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("user") || '{}')
    );
    this.user = this.userSubject.asObservable();
  }
  ngOnInit(){
     
  }
  public get userValue(): User {
    return this.userSubject.value;
  }

  login(data:any) {
//    const headers = new HttpHeaders().set('Content-Type','application/json');
  console.log(data)
   return this.http
      .post<User>(`${environment.apiUrl}/login`, 
       data
      )
      .pipe(
        map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          console.log("-----users",user)
          if(user.success == 200){
          localStorage.setItem("user", JSON.stringify(user));
          }else{  
            
          }
          
         // this.userSubject.next(user);
          return user;
        })
      );
  }
  getToken(){
    let user = JSON.parse(localStorage.getItem("user") || '{}')
    let token = user.token
    return token
  }
  loggedIn(){
    let user = JSON.parse(localStorage.getItem("user") || '{}')
    let token = user.token
    return !!token
  }
  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem("user");
    //this.userSubject.next(null);
    this.router.navigate(["/account/login"]);
  }
  expireToken(){
    
  }
  register(user) {
    return this.http.post(`${environment.apiUrl}/signup`, user);
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/users`);
  }

  getById(id: string) {
    return this.http.get(`${environment.apiUrl}/getuser/${id}`);
  }

  updateUser(data) {
    return this.http.post(`${environment.apiUrl}/updateuser`, data);
    // return this.http.put(`${environment.apiUrl}/users/${id}`, params).pipe(
    //   map(x => {
    //     // update stored user if the logged in user updated their own record
    //     if (id == this.userValue.id) {
    //       // update local storage
    //       const user = { ...this.userValue, ...params };
    //       localStorage.setItem("user", JSON.stringify(user));

    //       // publish updated user to subscribers
    //       this.userSubject.next(user);
    //     }
    //     return x;
    //   })
    // );
  }

  deleteUser(data) {
    console.log(data);
    return this.http.post(`${environment.apiUrl}/deletuser`,data);
    // return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
    //   map(x => {
    //     // auto logout if the logged in user deleted their own record
    //     if (id == this.userValue.id) {
    //       this.logout();
    //     }
    //     return x;
    //   })
    // );
  }
  forget(email:any){
   return this.http.post(`${environment.apiUrl}/forgetpassword`,email);    
  }
  attendance(data:any){
    return this.http.post(`${environment.apiUrl}/attendance`,data);
  }
  findAttendance(data:any){
    return this.http.post(`${environment.apiUrl}/findattendance`,data);
  }
  updateAttendance(data:any){
    return this.http.post(`${environment.apiUrl}/updateattendance`,data);
  }
  projectCreation(data:any){
    return this.http.post(`${environment.apiUrl}/projectcreation`,data);
  }
  allProjects(){
    
    return this.http.get(`${environment.apiUrl}/allproject`);
  }
  getProjectById(data){
    return this.http.post(`${environment.apiUrl}/projectbyid`,data);
  }
  createTask(data){
    return this.http.post(`${environment.apiUrl}/createtask`,data);
  }
  taskListByProject(data){
    return this.http.post(`${environment.apiUrl}/tasklistbyproject`,data);
  }
  getAllUsers(){
    return this.http.get(`${environment.apiUrl}/getUsers`);
  }
  assignTask(data){
    return this.http.post(`${environment.apiUrl}/assigntask`,data);
  }
  getAssignedTaskById(data){
    return this.http.post(`${environment.apiUrl}/assigntaskbyid`,data);
  }
}
