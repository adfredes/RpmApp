import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { map, take } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastr: ToastrService){

  }

  canActivate(): Observable<boolean>{
    return this.accountService.currentUser$
    .pipe(
      take(1),
      map (user => {
        if (user) {
          return true;
        }
        this.toastr.error('No estas autorizado');
      })
    );
  }
}
