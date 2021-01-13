import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  take } from 'rxjs/operators';
import { SelectCombo } from 'src/app/models/select-combo.interface';
import { ClassService } from 'src/app/services/class.service';
import { OptionsService } from 'src/app/services/options.service';
import { ToastrService } from 'ngx-toastr';
import { Class } from 'src/app/models/class.interface';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css']
})
export class ClassFormComponent implements OnInit {
  @Input() title: string;
  @Input() clase: Class;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onClose = new EventEmitter();
  
  formClass: FormGroup;
  teachers: SelectCombo[] = [];
  levels: SelectCombo[] = [];
  
  constructor(private fb: FormBuilder,
              private optionsService: OptionsService) {                  
  }

  private loadSelects = () => {
    combineLatest([this.loadLevels(), this.loadTeachers()])
      .subscribe(([levels, teachers]) => {
        this.levels = levels;
        this.teachers = teachers;
        this.setForm();
      })
  }

  private loadLevels = () =>
    this.optionsService.getLevelsSelectCombo()
    .pipe(take(1));
    

  private loadTeachers = () =>
    this.optionsService.getTeachersSelectCombo()
    .pipe(take(1));
    

  ngOnInit(): void {
    this.createForm();
    this.loadSelects();
  }

  createForm = () =>
    this.formClass = this.fb.group({   
      id: [''],
      dateOfClass: ['', [Validators.required]],
      beginTime: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(1)]],
      levelId: [0, [Validators.required, Validators.min(1)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      teacherId: [0, [Validators.required, Validators.min(1)]]
    });

  setForm = () => {
    if(this.clase) {           
      const teacherId =  this.teachers.find(t => t.text === this.clase.teacher).value;
      const levelId = this.levels.find(l => l.text === this.clase.level).value;            
      this.formClass.patchValue({... this.clase, teacherId, levelId, beginTime : this.clase.dateOfClass, dateOfClass: new Date(this.clase.dateOfClass)});
    }
  }

  submit = () => {
    this.formClass.markAllAsTouched();
    if (this.formClass.invalid) {
      console.log(this.formClass.errors);
      return;
    }
    this.onSubmit.emit(this.formClass.value);    
  }

  cancel = () => {
    this.onClose.emit();
  }

}
