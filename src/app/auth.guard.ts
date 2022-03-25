import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import { AccountService } from './shared_api/account.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router :Router,
              private accountService : AccountService){}
  canActivate(): boolean {
    if(this.accountService.loggedIn()){
      return true
    }else{
      this.router.navigate(['/'])
      return false
    }
  }
  
}
