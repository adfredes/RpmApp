import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbBootStrapModule, } from '../mdbootstrap/mdb-boot-strap.module';
import { TextInputComponent } from './text-input/text-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DateInputComponent } from './date-input/date-input.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ButtonRoundedComponent } from './button-rounded/button-rounded.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { TimeInputComponent } from './time-input/time-input.component';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [TextInputComponent, DateInputComponent, ButtonRoundedComponent, SelectInputComponent, TimeInputComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    MdbBootStrapModule,
    ReactiveFormsModule,
    TimepickerModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [
    ReactiveFormsModule,
    TextInputComponent,
    DateInputComponent,
    ButtonRoundedComponent,
    SelectInputComponent,
    TimeInputComponent,
    ModalModule
  ]
})
export class CustomFormsModule { }
