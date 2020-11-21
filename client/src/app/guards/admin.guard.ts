import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { take, map } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
constructor(private accountService: AccountService, private toastr: ToastrService){}

canActivate(): Observable<boolean>{

      return this.accountService.currentUser$.pipe(
        take(1),
        map((user: User) => {
          if (user?.roles?.includes('Admin')){
            return true;
          }
          this.toastr.error('No tienes permiso para entrar a esta sección');
          return false;
        })
      );
  }

}
