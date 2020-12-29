import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  updateUserRoles(username: string, roles: string[]){
    return this.http.put(`${this.apiUrl}admin/edit-roles/${username}?roles=${roles}`, {});
  }
}
