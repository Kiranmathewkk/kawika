import { Component, OnInit } from '@angular/core';
import { AccountService } from "../shared_api/account.service"
@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  tableData;
  constructor(private accountService:AccountService) { }

  ngOnInit() {
    this.accountService.allProjects().subscribe(result=>{
      console.log(result)
      if(result['success']==200){
        this.tableData = result['message']
      }
    })
  }

}
