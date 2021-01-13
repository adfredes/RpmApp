import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ClassParams } from 'src/app/models/classParams';
import { getPaginatedResult } from 'src/app/services/paginationHelper';
import { Class } from 'src/app/models/class.interface';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { userInfo } from 'os';
import { User } from 'src/app/models/user.interface';
import { ClassEdit } from '../models/classEdit';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  public searchParams = new ClassParams();
  private apiUrl = environment.apiUrl;
  private hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineClass = new Subject<Class>();
  onlineClass$ = this.onlineClass.asObservable();

  constructor(private http: HttpClient) { }

  getClasses = () =>
    getPaginatedResult<Class[], ClassParams>(`${this.apiUrl}class`, this.searchParams, this.http)

  addClass = (newClass: any) => {
    newClass[`dateOfClass`].setHours(newClass[`beginTime`].getHours());
    newClass[`dateOfClass`].setMinutes(newClass[`beginTime`].getMinutes());
    return this.http.post(`${this.apiUrl}class`, newClass);
  }

  suspendClass = (id: number, suspended: boolean) => 
    this.http.put(`${this.apiUrl}class/${id}/suspend/${suspended}`, {});

  createHubConnection(classId: number, user: User): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + `class?classid=${classId}`, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(console.log);

    this.hubConnection.on('UpdatedClass', (leason: Class) => {
      this.onlineClass.next(leason);
    });
  }

  async subscribeClass(classid: number): Promise<any>{
    return this.hubConnection.invoke('SubscribeClass', classid);
  }

  async unsubscribeClass(classid: number): Promise<any>{
    return this.hubConnection.invoke('UnsubscribeClass', classid)
              .catch(console.log);
  }

  async setStudentAsist(classId: number, studentId: number, isAsist: boolean): Promise<any>{
    return this.hubConnection.invoke('StudentAsist', classId, studentId, isAsist);
  }

  async updateClass(classId: number, values){
    const leason: ClassEdit = ClassEdit.getNew(classId, values);            
    console.log(leason);
    return this.hubConnection.invoke('EditClass', leason);
  }

  stopHubConnection(): void {
    this.hubConnection.stop().catch(console.log);
  }
}
