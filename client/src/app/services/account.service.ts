import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.interface';
import { SelectCombo } from 'src/app/models/select-combo.interface';
import { UserAccount } from 'src/app/models/user-account.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.getUserSaved();
  }

  register = (usuario: any) => {
    return this.http.post<User>(`${this.apiUrl}account/register`, usuario)
      .pipe(
        map(user => {
          if (user){
            this.setCurrentUser(user);
          }
          return user;
        })
      );
  }

  login = (userLogin: any) => {
    return this.http.post<User>(`${this.apiUrl}account/login`, userLogin)
      .pipe(
        map(user => {
          if (user){
            this.setCurrentUser(user);
          }
          return user;
        })
      );
  }

  forgot = ({username}) => {
    return this.http.get(`${this.apiUrl}account/forgotpassword/${username}`);
  }

  reset = ({username, ...params}) => {
    return this.http.put<User>(`${this.apiUrl}account/forgotpassword?username=${username}`, params)
      .pipe(
        map(user => {
          if (user){
            this.setCurrentUser(user);
          }
          return user;
        })
      );
  }

  change = (params) => {
    return this.http.put<boolean>(`${this.apiUrl}account/password/change`, params);
  }

  logout = () => {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.router.navigate(['/']);
  }

  isEmailExists = (email: string) => {
    return this.http.get(`${this.apiUrl}account/isemailexists/${email}`);
  }

  isUserExists = (username: string) => {
    return this.http.get(`${this.apiUrl}account/isuserexists/${username}`);
  }

  getUserId = (user: User): number => {
    // tslint:disable-next-line: radix
    return user?.token ? parseInt(this.getDecodedToken(user.token).nameid) : null;
  }

  getRoles = () => {
    return this.http.get<SelectCombo[]>(`${this.apiUrl}admin/roles`);
  }

  getUsers = () => {
    return this.http.get<UserAccount[]>(`${this.apiUrl}admin/users`);
  }

  private setCurrentUser = (user: User) => {
    if (user) {
      const roles = this.getDecodedToken(user.token).role;
      user.roles = [];
      Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    }
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  private getUserSaved = () => {
    if (localStorage.getItem('user'))
    {
      const user = JSON.parse(localStorage.getItem('user'));
      this.setCurrentUser(user);
    }
  }


  private getDecodedToken = (token: string) => JSON.parse(atob(token.split('.')[1]));
}
