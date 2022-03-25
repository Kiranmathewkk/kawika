import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AccountService } from "../../shared_api/account.service"
import {Router} from '@angular/router';


declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
declare interface ChildInfo {
  
  title: string;
  icon: string;
  child:[
    {
      title:string;
      path:string;
      icon:string;
      class:string;
    }
  ]
  
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    {  path: '/project-creation', title: 'Create Project',  icon: 'work', class: '' },
    {  path: '/create-user/:id', title: 'Create User',  icon: 'account_box', class: ''},
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    //{ path: '/poject-list', title: 'Project List',  icon:'content_paste', class: '' },
    { path:'/user-list', title:'User List', icon:'content_paste',class:''}
  //   { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
  //   { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
  //   { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
  //   { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
  //  { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

export const CHILD:ChildInfo[] =[
  {
   
    title: 'group',
    icon: 'work',
    child: [
        {
          title: 'Búsqueda Perfil',
          path: 'search',
          icon:'person',
          class: ''
        }
      ]
    }
]

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  childItems: any[]; 
  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  projectData;

  constructor(private accountService:AccountService,
              private router: Router) {
                this.router.routeReuseStrategy.shouldReuseRoute = function () {
                  return false;
                };
               }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.childItems = CHILD.filter(childItem => childItem)
    this.accountService.allProjects().subscribe(result=>{
      console.log(result)
      if(result['success']==200){
        this.projectData = result['message']
      }
    })
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  // mouseenter() {
  //   if (!this.isExpanded) {
  //     this.isShowing = true;
  //   }
  // }

  // mouseleave() {
  //   if (!this.isExpanded) {
  //     this.isShowing = false;
  //   }
  // }
  allProjects(){
   console.log(this.projectData)
   if(this.isShowing){
    this.isShowing = false
   }else{
    this.isShowing = true
   }
  }
  viewProject(data){
   
    this.router.navigate(["/project/"+data.id]);
  }
  
}
