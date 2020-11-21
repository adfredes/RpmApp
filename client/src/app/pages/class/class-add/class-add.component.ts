import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { SelectCombo } from 'src/app/models/select-combo.interface';
import { ClassService } from 'src/app/services/class.service';
import { OptionsService } from 'src/app/services/options.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-class-add',
  templateUrl: './class-add.component.html',
  styleUrls: ['./class-add.component.css']
})
export class ClassAddComponent implements OnInit {
  formRegisterClass: FormGroup;
  teachers: SelectCombo[] = [];
  levels: SelectCombo[] = [];
  constructor(private classService: ClassService, private fb: FormBuilder,
              private optionsService: OptionsService, private toastr: ToastrService) {
      this.createForm();
      this.loadLevels();
      this.loadTeachers();
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
    this.createForm();
  }

  createForm = () =>
    this.formRegisterClass = this.fb.group({
      dateOfClass: ['', [Validators.required]],
      beginTime: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(1)]],
      levelId: [0, [Validators.required, Validators.min(1)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      teacherId: [0, [Validators.required, Validators.min(1)]]
    })

  submit = () => {
    this.formRegisterClass.markAllAsTouched();
    if (this.formRegisterClass.invalid) {
      return;
    }
    console.dir(this.formRegisterClass.value);
    this.classService.addClass(this.formRegisterClass.value)
      .subscribe(() => {
        this.toastr.success('Clase agregada');
        this.formRegisterClass.reset(
          {
            levelId: 0,
            teacherId: 0
          }
        );
      });
  }

  cancel = () => true;

}
