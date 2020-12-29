import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Class } from 'src/app/models/class.interface';
import { ClassService } from 'src/app/services/class.service';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { BussyService } from 'src/app/services/bussy.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit, OnDestroy {
  class: Class;
  isSubscript: boolean;
  private classSubcription: Subscription;
  userId: number;
  isClose: boolean;
  viewStudents = false;

  constructor(private classService: ClassService, private accountService: AccountService,
              private toastr: ToastrService, private bussyService: BussyService,
              private activatedRoute: ActivatedRoute, private location: Location) {
    this.bussyService.busy();
    this.classSubcription = this.classService.onlineClass$
      .subscribe(leason => {
        this.class = leason;
        this.isSubscript =  leason.studentsSubscription.some(s => s.studentId === this.userId);
        this.viewStudents = leason.studentsSubscription?.length > 0 ? true : false;
        this.isClose = new Date(this.class.dateOfClass) < new Date();
        this.bussyService.iddle();
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

  goBack = () => {
    this.location.back();
  }

  ngOnInit(): void {
  }

}
