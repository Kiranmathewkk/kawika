import { Component, OnInit } from '@angular/core';
import { AccountService } from "../shared_api/account.service"
import { ActivatedRoute } from '@angular/router';
import {  MatDialog  , MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent }  from '../dialog/dialog.component'
import { MatDialogModule } from "@angular/material/dialog";
import { sasportal } from 'googleapis/build/src/apis/sasportal';
import { DialogeTaskViewComponent } from '../dialoge-task-view/dialoge-task-view.component';
import { NotificationsService } from 'angular2-notifications';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent  {
 id:string;
 title;
 loginDetails = JSON.parse(localStorage.getItem("user") || '{}')
 name = 'Brun';
  animal = 'Lour';
  taskList;
  allUsers;
  userDetails;
  hours;
  overideNot ={
    position:['bottom','right'],
    timeOut:2000,
    animate:'fade',
    showProgressBar:true

  }
  constructor(private accountService:AccountService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private notification: NotificationsService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    console.log("--------------------")
    
    this.id ='';
    this.userDetails = this.loginDetails.user
    this.id = this.route.snapshot.paramMap.get('id');
    console.log("id---",this.id)
    if(this.id){
      let obj ={
        id:this.id
      }
      this.accountService.getProjectById(obj).subscribe(result=>{
        console.log("result======",result)
        if(result['success']==200){
         this.title = result['message']['title']
         
        }
      })
    }
    this.getTaskList()
  }

  openDialog(task,value): void {

    if(task && value =='edit'){
      this.editTask(task)
    }else{
      this.createTask()
    }
      


    
  }
  editTask(task){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        project_id:this.id,
        task : task,
        isEdit:true
      }
    }).afterClosed().subscribe(res=>{
      console.log("---dialoge",res)
      if(res['data']){
       this.taskList = res['data'];
      }
      this.notification.success("Success","Task Edited",this.overideNot)
    })
    
  }
  createTask(){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        project_id:this.id,
        isEdit:false
      }
    }).afterClosed().subscribe(res=>{
      console.log("---dialoge",res)
      if(res['data']){
       this.taskList = res['data'];
      }
      this.notification.success("Success","Task Created",this.overideNot)
    })
    
  }
  getTaskList(){
    this.ngxService.start()
    let projectId=this.id
    let obj ={
      project_id:projectId
    }
    this.accountService.taskListByProject(obj).subscribe(result=>{
      //console.log(result)
      if(result['success']==200){
         this.taskList = result['message'];
         this.ngxService.stop()
       }
    })
    //get all users
    this.accountService.getAllUsers().subscribe(res=>{
     // console.log("+++++",res)
      if(res['success']==200){
        this.allUsers = res['message'];
      }
    })
  }
  assignTask(user,task,index){
    console.log("======",user)
    console.log("======",task)
    let obj={
      task_id:task.id,
      user_id:user.id,
      project_id : this.id,
      fullname: user.fullname,
      email : user.email,
      assignbyId:this.userDetails.id,
      assignbyFullname:this.userDetails.fullname
    }
    this.accountService.assignTask(obj).subscribe(result=>{
      console.log("task-----",result)
      if(result['success']==200){
         task.status='assigned'
         //this.taskList[index].push(task);
      }
    })
    this.notification.success("Success","Assigned",this.overideNot)

  }
  viewTask(list){
    const dialogRef = this.dialog.open(DialogeTaskViewComponent, {
      width: '800px',
      height:'700px',
      data: {
        project_id:this.id,
        task:list
      }
    })
    // .afterClosed().subscribe(res=>{
    //   console.log("---dialoge",res)
    //   if(res['data']){
    //    this.taskList = res['data'];
    //   }
    // })       
  }
}
