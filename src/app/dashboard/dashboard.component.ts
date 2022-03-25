import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { AccountService } from "../shared_api/account.service"
import {formatDate } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  time: number = 0;
  display ;
  interval;
  clock_title = "clock-in";
  loginDetails = JSON.parse(localStorage.getItem("user") || '{}')
  userDetails ;
  dateTime;
  showTime;
  fCheckin;
  fCheckout;
  sCheckin;
  sCheckout;
  tCheckin;
  tCheckout;
  form: FormGroup;
  constructor(private accountService :AccountService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService ) { }
  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {
    this.ngxService.start()
    this.userDetails = this.loginDetails.user
    let data ={
      date: new Date(),
      user_id:this.userDetails.id
    }
    this.accountService.findAttendance(data).subscribe(result=>{
      console.log(result)
      if(result['success'] == 200){
         this.dateTime =  result['data']['check_in'] 
         this.fCheckin =  result['data']['check_in']
         this.fCheckout = result['data']['check_out']
         this.sCheckin =  result['data']['second_check_in']
         this.sCheckout = result['data']['second_check_out']
         this.ngxService.stop();
      }
      if(this.fCheckin  || this.sCheckin){
        this.clock_title = "clock-out";
      }
      console.log("-----------checkout",this.fCheckin,this.sCheckin) 
      this.ngxService.stop(); 
    })
    
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
      console.log("-------",this.userDetails)
      const dataDailySalesChart: any = {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
              [12, 17, 7, 17, 23, 18, 38]
          ]
      };

     const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
      }

      var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

      this.startAnimationForLineChart(dailySalesChart);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

      const dataCompletedTasksChart: any = {
          labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
          series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
          ]
      };

     const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      }

      var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      var datawebsiteViewsChart = {
        labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

        ]
      };
      var optionswebsiteViewsChart = {
          axisX: {
              showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      };
      var responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
      this.startAnimationForBarChart(websiteViewsChart);

      
  }
  startTimer() {
    let caseValue
    let today = new Date()
    
    if(!this.dateTime){
      this.dateTime = today
    let data ={
      user_id:this.userDetails.id,
      check_in:this.dateTime,
      date:this.dateTime,
      caseValue:caseValue
    }
  
  
         this.accountService.attendance(data).subscribe(result =>{
        console.log(result)
        if(result['success']==200){       
         this.fCheckin = today
        }
     }) 
      this.showTime =formatDate(this.dateTime, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
       this.clock_title = "clock-out"
    
    //this.interval = setInterval(() => {
    //   if (this.time === 0) {
    //     this.time++; 
    //   } else {
    //     this.time++;
    //   }
    //   this.display=this.transform( this.time)
    // }, 1000);
    }else{
      this.pauseTimer()    
    }
  }
  transform(value: number): string {
      //  const minutes: number = Math.floor(value / 60);
      //  return minutes + ':' + (value - minutes * 60);

      var sec_num = value; 
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    // if (hours   < 10) {hours   = 0;}
    // if (minutes < 10) {minutes = 0;}
    // if (seconds < 10) {seconds = 0;}
    return hours+':'+minutes+':'+seconds;
  }
  pauseTimer() {
    let caseValue
    let today = new Date() 
    this.clock_title = "clock-in"
    if(this.fCheckin && !this.fCheckout && !this.sCheckin && !this.fCheckout){
      
         caseValue =2
    }
    if(this.fCheckin && this.fCheckout && !this.sCheckin && !this.sCheckout){
      caseValue =3
      
    }
    if(this.fCheckin && this.fCheckout && this.sCheckin && !this.sCheckout){
      
      caseValue =4
    }
    console.log("casevalue",caseValue)
    let obj ={
      check_out: new Date(),
        user_id: this.userDetails.id,
        statusValue:caseValue
    }

    console.log("timein timeout",obj)
    this.accountService.updateAttendance( obj).subscribe(result=>{
      console.log(result)
      if(result['success']==200){
        if(caseValue ==2){
          this.fCheckout = today
        }
        if(caseValue == 3){
          this.sCheckin = today
        }
        if(caseValue == 4){
          this.sCheckout = today
        }
      }
    })
   clearInterval(this.interval);
   this.time=0;
   this.display = '';
  }
}
