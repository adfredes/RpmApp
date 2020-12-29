import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from 'src/app/models/member.interface';
import { MembersParams } from 'src/app/models/members-params';
import { getPaginatedResult } from 'src/app/services/paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  public membersParams: MembersParams;
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getMember = (username: string) => {
    return this.http.get<Member>(`${this.apiUrl}member/${username}`);
  }

  getMembers = () => 
    getPaginatedResult<Member[], MembersParams>(`${this.apiUrl}member`, this.membersParams, this.http);
  

  updateMember = (member: any) => {
    return this.http.patch<Member>(`${this.apiUrl}member`, member);
  }

  setMainPhoto = (photoId: number) => {
    return this.http.put(`${this.apiUrl}member/set-main-photo/${photoId}`, {});
  }

  deletePhoto = (photoId: number) => {
    return this.http.delete(`${this.apiUrl}member/delete-photo/${photoId}`);
  }
}
