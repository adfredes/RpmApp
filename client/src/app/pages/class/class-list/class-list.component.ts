import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.interface';
import { ClassParams } from 'src/app/models/classParams';
import { ClassService } from 'src/app/services/class.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OptionsService } from 'src/app/services/options.service';
import { SelectCombo } from 'src/app/models/select-combo.interface';
import { take } from 'rxjs/operators';
import { Pagination } from 'src/app/models/pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalAddComponent } from '../modals/modal-add.component';
import { ModalEditComponent } from '../modals/modal-edit.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Subscription } from 'rxjs';
import * as actions from 'src/app/store/actions/classes.actions';


@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css']
})
export class ClassListComponent implements OnInit, OnDestroy {
  
  public classes: Class[] = [];
  public formSearch: FormGroup;
  public levels: SelectCombo[] = [];
  public teachers: SelectCombo[] = [];
  private loading = false;
  private pagination: Pagination;
  private classesSubscription: Subscription;

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + 1000;
    const max = (document.documentElement.scrollHeight || document.body.scrollHeight);

    if (pos > max && !this.loading && this.pagination.currentPage < this.pagination.totalPages) {
      this.classService.searchParams.pageNumber += 1;
      this.loadClasses();
    }
  }

  constructor(private classService: ClassService, private fb: FormBuilder,
              private optionsService: OptionsService, private modalService: BsModalService,
              private store: Store<AppState>) {
    this.initStore();
    this.loadLevels();
    this.loadTeachers();
    this.createForm();
    this.searchClasses();
  }

  initStore = () => {
    this.classesSubscription = this.store.select('classes').subscribe(
      (({loading, classes,pagination}) =>{
        if(!loading){
          this.classes = classes;
          this.pagination = pagination;          
        }
        this.loading = loading;
      })
    );
  }

  openAddModal = () => {
    this.modalService.show(ModalAddComponent);
  }

  private loadLevels = () =>
    this.optionsService.getLevelsSelectCombo()
      .pipe(take(1))
      .subscribe(levels => this.levels = levels)

  private loadTeachers = () =>
  this.optionsService.getTeachersSelectCombo()
    .pipe(take(1))
    .subscribe(teachers => this.teachers = teachers)

  ngOnInit(): void {
  }

  ngOnDestroy = () => this.classesSubscription.unsubscribe();

  searchClasses = () => {
    this.classService.searchParams = new ClassParams(this.formSearch.get('beginDate').value,
                                       this.formSearch.get('endDate').value,
                                       this.formSearch.get('levelId').value,
                                       this.formSearch.get('teacherId').value);
    this.classes = [];
    this.loadClasses();
  }

  // loadClasses = () => {
  //   this.loading = true;
  //   this.classService.getClasses()
  //       .subscribe(paged => {
  //         this.classes.push(...paged.result);
  //         this.pagination = paged.pagination;
  //         this.loading = false;
  //       });
  // }

  loadClasses = () => this.store.dispatch(actions.loadClasses());

  createForm = () => {
    this.formSearch = this.fb.group({
      beginDate: [this.classService.searchParams.beginDate, [Validators.required]],
      endDate: [this.classService.searchParams.endDate, [Validators.required]],
      levelId: [this.classService.searchParams.levelId ? this.classService.searchParams.levelId : 0],
      teacherId: [this.classService.searchParams.teacherId ? this.classService.searchParams.teacherId : 0]
    });
  }

}
