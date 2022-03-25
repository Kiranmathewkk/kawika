import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule,FormGroupDirective } from "@angular/forms";
import { first } from "rxjs/operators";
import { AccountService } from "../shared_api/account.service"
import { AlertService }  from "../shared_api/alert.service"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  form: FormGroup;
  reset: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  email:any;
  password:any;
  isRegister = false;
  isReset=false;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService : AccountService,
    private alertService : AlertService) { 

    } 

  ngOnInit(): void {
    if(this.accountService.loggedIn()){
      this.router.navigate(['/dashboard'])    
  }else{
    const passwordValidators = [Validators.minLength(6)];

    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
    this.form = this.formBuilder.group({
      fullname: ["", Validators.required],
     
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required,Validators.minLength(6)]]
    });
    this.reset = this.formBuilder.group({
      
     
      email: ["", [Validators.required, Validators.email]],
      
    });
   } 
  }
  get f() {
    return this.loginForm.controls;
  }
  // onSubmit() {
  //   this.submitted = true;

  //   // reset alerts on submit
  //  // this.alertService.clear();
  //      console.log(this.loginForm)
  //   // stop here if form is invalid
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //  let data ={
  //    email: this.f.email.value,
  //    password: this.f.password.value
  //  }
  //   this.loading = true;
  //   this.accountService
  //     .login(data)
  //     .pipe(first())
  //     .subscribe(
  //       data => {
          
  //         if(data.success == 200){
  //           console.log("20000",data)
  //         this.router.navigate(['/dashboard']);
  //         }
  //         if(data.success == 401)
  //         alert("Invalid email or password")
  //         this.alertService.error("eroooorr");
  //         this.loading = false;
  //       },
  //       error => {
  //   //      this.alertService.error(error);
  //         this.loading = false;
  //       }
  //     );
  // }
  newUser(x){
    if(x==1){
    this.isRegister = true;
    this.isReset= false;
    }
    if(x==2){
      this.isRegister = false;
      this.isReset= false;
    }
    if(x==3){
      this.isReset = true;
  
    }
  }

  onSubmit( formData: FormGroup, loginDirective: FormGroupDirective){

    let data ={
         email: formData.value.email,
         password: formData.value.password
       }

       this.accountService
      .login(data).subscribe(loginData=>{
        console.log(loginData)
        if(loginData.success== 200){
          //localStorage.setItem("user", JSON.stringify(loginData.user));
          this.router.navigate(['/dashboard']);
        }else{
          alert("Invalid email or password")
        }
       
      })
    // const email = formData.value.email;
    // const password = formData.value.password;'
    console.log(data)
  }
  login(email,password){
   console.log(email,password)
  }

  submit() {
    this.submitted = true;


     console.log(this.form.value)
    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
   
      this.createUser();
   
  }

  private createUser() {
    let data = this.form.value
    this.accountService
      .register(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
            
          this.alertService.success("User added successfully", {
            keepAfterRouteChange: true
          });
          this.isRegister = false;
        },
        error => {
          this.alertService.error(error);
           this.loading = false;
        }
      );
  }
  onReset(){
    console.log(this.reset.value.email)
    let email = this.reset.value
    this.accountService.forget(email).subscribe(data=>{
      console.log("forget",data)
      if(data['success']== 200){
        alert("Reset Link is send to mail")
      }
    })
  }

}
