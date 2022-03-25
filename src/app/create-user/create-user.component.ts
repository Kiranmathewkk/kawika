import { Component, OnInit } from '@angular/core';
import { AccountService } from "../shared_api/account.service";
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { analytics } from 'googleapis/build/src/apis/analytics';
import { title } from 'process';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  userData={
    
    email:'',
    fullname:'',
    password:'',
    address:'',
    position:'',
    bloodgroup:'',
    code:''
  };
  imagePath;
  url;
  profile_img;
  isUserEdit = false;
  userId;
  imageStatus= false;
  overideNot ={
    position:['bottom','right'],
    timeOut:2000,
    animate:'fade',
    showProgressBar:true

  }
  constructor(private accountService:AccountService,
              private route:ActivatedRoute,
              private notification: NotificationsService,
              private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    
    this.userId = this.route.snapshot.params['id'];
    console.log(this.userId)
    if(this.userId != ':id'){
      this.clearAll()
      this.ngxService.start()
      this.isUserEdit = true;
      this.accountService.getById(this.userId).subscribe(resp=>{
        console.log(resp)
        if(resp['success']==200){
          this.userData.address=resp['message']['address'];
          this.userData.bloodgroup= resp['message']['bloodgroup'];
         
          this.userData.email= resp['message']['email'];
          this.userData.code=resp['message']['employecode'];
          this.userData.fullname=resp['message']['fullname'];
            
          this.userData.position=resp['message']['position'];
          this.url = resp['message']['profile_image'];
          this.ngxService.stop()
        }
      })
    }
    console.log(this.isUserEdit)
  }
  onFileChanged(event){
    const files = event.target.files;
    this.profile_img = files[0]
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
     //   this.message = "Only images are supported.";
        return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => {
         
        this.url = reader.result;
        this.imageStatus = true; 
      
    }
  }
  onSubmit(){
   
    // console.log(this.userData)
    // console.log("filesss",this.profile_img)
    if(this.userData.email == '' || this.userData.fullname =='' || this.userData.password==''){
      this.notification.error("Error","Please Fill the data",this.overideNot)
      return false
    }
    if(this.userData.email){
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if(!emailRegexp.test(this.userData.email)){
        this.notification.error("Error","Please enter valid email",this.overideNot)
         return false
      }
       
    }
    
    let formData = new FormData()
    formData.append('file',this.profile_img)
    formData.append('data',JSON.stringify(this.userData))
    // let data = this.form.value
    this.accountService
      .register(formData)
      .subscribe(
        data => {
          if(data['success']==200){
            this.notification.success("Success","New User is added",this.overideNot)
             this.clearAll()         
           }
          if(data['success']==401){
            this.notification.error("Error","Email exists",this.overideNot)
          }
          
            //console.log("response",data)
        });
  }
  editSubmit(){
    console.log("edit",this.userData)
    this.userData['id'] = this.userId
    if(this.userData.email == '' || this.userData.fullname =='' || this.userData.password==''){
      this.notification.error("Error","Please Fill the data",this.overideNot)
      return false
    }
    if(this.userData.email){
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if(!emailRegexp.test(this.userData.email)){
        this.notification.error("Error","Enter valid email",this.overideNot)
         return false
      }
       
    }
    let formData = new FormData()
    formData.append('file',this.profile_img)
    formData.append('data',JSON.stringify(this.userData))
    this.accountService.updateUser(formData).subscribe(res=>{
      console.log(res)
      if(res['success']==200){
        this.notification.success("Success","User Updated",this.overideNot)
       // this.clearAll()
      }else{
        this.notification.error("Error")
      }
    })
  }
  clearAll(){
    this.userData={
      email:'',
    fullname:'',
    password:'',
    address:'',
    position:'',
    bloodgroup:'',
    code:''
    }
    this.url = "",
    this.profile_img=""
  
  }
}
