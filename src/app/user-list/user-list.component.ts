import { Component, OnInit } from '@angular/core';
import { AccountService } from '../shared_api/account.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userDetails:any;

  constructor(private accountService:AccountService,
              private router:Router,
              private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start()
      this.accountService.getAllUsers().subscribe(response=>{
        console.log(response)
        if(response['success']==200) {
          this.userDetails=response['message']
          this.ngxService.stop()
        }
      })
  }
  userDelete(id,i){
    let obj ={
      id:id
    }
    this.accountService.deleteUser(obj).subscribe(res=>{
      console.log(res)
      if(res['success']==200){
        this.userDetails.splice(i, 1);
      }
    })
  }
  userView(data){
    console.log(data)
    this.router.navigate(["/create-user/"+data.id])
  }
}
