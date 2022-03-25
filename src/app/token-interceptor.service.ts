import { Injectable , Injector } from '@angular/core';
import { HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse} from '@angular/common/http';
import { AccountService } from './shared_api/account.service';
import {Observable} from 'rxjs/Observable';
import { Router } from '@angular/router';
// import { catchError } from 'rxjs/operators'
import { throwError,  BehaviorSubject, of, } from "rxjs";
import { catchError, filter, take, switchMap } from "rxjs/operators";

 
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector : Injector, private router:Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let service = this.injector.get(AccountService)
    let tokenizedReq = req.clone({
      setHeaders : {
        Authorization : `Bearer ${service.getToken()}`
      }
    })
   return next.handle(tokenizedReq).pipe(
    catchError(
      (err, caught) => {
        if (err.status === 401){
          this.handleAuthError();
          return of(err);
        }
        throw err;
      }
    )
  );
    }
  // intercept(req,next) {
  //   let service = this.injector.get(AccountService)
  //   let tokenizedReq = req.clone({
  //     setHeaders : {
  //       Authorization : `Bearer ${service.getToken()}`
  //     }
  //   })
  //  return next.handle(tokenizedReq)
  // }
  private handleAuthError() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
