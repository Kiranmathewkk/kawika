import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountService } from '../shared_api/account.service'

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialoge-task-view',
  templateUrl: './dialoge-task-view.component.html',
  styleUrls: ['./dialoge-task-view.component.scss']
})
export class DialogeTaskViewComponent implements OnInit {
  taskTitle:any;
  taskData:any;
  taskId:any;
  assignedTo:any;
  constructor(public dialogRef: MatDialogRef<DialogeTaskViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private accountService:AccountService) { }

  ngOnInit(): void {
    console.log("-------------",this.data)
   this.taskTitle = this.data['task']['title'];
   this.taskData = this.data['task'];
   this.taskId = this.data['task']['id']
   if(this.taskId){
     let obj={
       task_id:this.taskId
     }
      this.accountService.getAssignedTaskById(obj).subscribe(res=>{
        console.log(res)
        if(res['success']==200){
          this.assignedTo = res['message']
        }
      })
   }
  }
}
