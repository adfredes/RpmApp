import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {
  constructor(private accountService: AccountService, private toastr: ToastrService){}

  canActivate(): Observable<boolean>{

      return this.accountService.currentUser$.pipe(
        take(1),
        map((user: User) => {
          if (user?.roles?.includes('Admin') || user?.roles?.includes('School') || user?.roles?.includes('Teacher')){
            return true;
          }
          this.toastr.error('No tienes permiso para entrar a esta sección');
          return false;
        })
      );
  }
}
