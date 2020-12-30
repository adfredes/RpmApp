import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AccountService } from '../services/account.service';
import { User } from '../models/user.interface';
import { catchError, delay, finalize, take } from 'rxjs/operators';
import { BussyService } from '../services/bussy.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService, private bussyService: BussyService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser: User;
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe(user => currentUser = user);

    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    this.bussyService.busy();

    return next.handle(request)
      .pipe(        
        finalize(() => this.bussyService.iddle())
      );
  }
}
