import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Class } from 'src/app/models/class.interface';
import { ClassService } from 'src/app/services/class.service';
import { AccountService } from '../../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.interface';
import { BussyService } from '../../../services/bussy.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit, OnDestroy {
  class: Class;
  isSubscript: boolean;
  private classSubcription: Subscription;
  private userId: number;

  constructor(private classService: ClassService, private accountService: AccountService,
              private toastr: ToastrService, private bussyService: BussyService,
              private activatedRoute: ActivatedRoute) {
    this.classSubcription = this.classService.onlineClass$
      .subscribe(leason => {
        this.class = leason;
        this.isSubscript =  leason.studentsSubscription.some(s => s.studentId === this.userId);        
      });

    this.accountService.currentUser$.pipe(take(1))
      .subscribe(user => {
        const classId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        this.userId = this.accountService.getUserId(user);
        classService.createHubConnection(classId, user);
      });
  }

  ngOnDestroy(): void {
    this.classSubcription.unsubscribe();
  }

  subscribe(): void {
    this.bussyService.busy();
    this.classService.subscribeClass(this.class.id)
      .then(() => this.toastr.success('Inscripto'))
      .catch((error) => {
        this.toastr.error(error.message.split(':')[1]);
      })
      .finally(() => this.bussyService.iddle());
  }

  unsubscribe(): void {
    this.bussyService.busy();
    this.classService.unsubscribeClass(this.class.id)
      .then(() => this.toastr.success('Ya no estas incscripto'))
      .catch((error) => {
        this.toastr.error(error.message.split(':')[1]);
      })
      .finally(() => this.bussyService.iddle());
  }

  setAsist(isAsist: boolean, studentId: number): void {
    this.bussyService.busy();
    this.classService.setStudentAsist(this.class.id, studentId, isAsist)
    .then()
    .finally(() => this.bussyService.iddle());
  }

  ngOnInit(): void {
  }

}
