import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import {MatDialog, } from '@angular/material/dialog';

import {MatDialogModule} from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

import {  AccountService }  from '../shared_api/account.service'


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  form: FormGroup;
   submitted = true;
   isEdit :boolean;
   taskDetails;
   loginDetails = JSON.parse(localStorage.getItem("user") || '{}')
   userDetails;
   img;
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private accountService:  AccountService) { }

  ngOnInit(): void {
    this.userDetails = this.loginDetails.user   
    this.isEdit = this.data['isEdit'];
    this.taskDetails = this.data['task']
    console.log(this.taskDetails)
    if(this.isEdit){
      this.editTask()
    }else{
  
    this.form = this.formBuilder.group({
      title: ["", Validators.required],
      descrition: ["", ],
      startDate: ["",],
      endDate:  ["",],
      hrs:["",],
      user_id:[this.userDetails.id],
      fullname:[this.userDetails.fullname],
      project_id:[this.data['project_id'],]
    });
   }
  }
  get f() {
    return this.form.controls;
  }
  editTask(){
    console.log("edittaskkk")
    this.form = this.formBuilder.group({
      title: this.taskDetails['title'],
      descrition: this.taskDetails['description'],
      startDate:this.taskDetails['start_date'],
      endDate:this.taskDetails['end_date'],
      hrs:this.taskDetails['hours'],
      user_id:[this.userDetails.id],
      fullname:[this.userDetails.fullname],
      project_id:[this.data['project_id'],]
   });
  }
  onSubmit(){
  //   this.submitted = true;
  console.log("image",this.img)
  this.form.value.status=this.isEdit
  this.form.value.task_id = this.taskDetails?.id
   console.log ('----forms',this.form.value)
   let formData = new FormData();
      formData.append('file',this.img)
      formData.append('obj', JSON.stringify(this.form.value));

   this.accountService.createTask(formData).subscribe(result=>{
     console.log(result)
     if(result['success']==200){
      this.form.reset();
      this.dialogRef.close({data:result['message']})
     }
   })

  }
  
  onFileChanged(event) {
      this.img = event.target.files[0];
      
     
  }
  

}
