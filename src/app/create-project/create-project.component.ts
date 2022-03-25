import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AccountService } from "../shared_api/account.service"

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder,
               private accountService: AccountService ) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      title: ["", Validators.required],
      descrition: ["", [Validators.required]],
      startDate: ["",Validators.required],
      endDate:  ["",Validators.required],
      deadLine:  ["",Validators.required],
      cost     :[""],
      client_name : [""],
      client_email: [""],
      client_phone: [""],
      client_address: [""]



    });
  }
  get f() {
    return this.form.controls;
  }
  onSubmit(){
    this.submitted = true;
   console.log (this.form.value)
   this.accountService.projectCreation(this.form.value).subscribe(result=>{
     console.log(result)
     if(result['success']==200){
      this.form.reset();
     }
   })

  }
}
