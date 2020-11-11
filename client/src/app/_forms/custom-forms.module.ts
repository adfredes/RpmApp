import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbBootStrapModule, } from '../mdbootstrap/mdb-boot-strap.module';
import { TextInputComponent } from './text-input/text-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DateInputComponent } from './date-input/date-input.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonRoundedComponent } from './button-rounded/button-rounded.component';



@NgModule({
  declarations: [TextInputComponent, DateInputComponent, ButtonRoundedComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    MdbBootStrapModule,
    ReactiveFormsModule
  ],
  exports: [
    ReactiveFormsModule,
    TextInputComponent,
    DateInputComponent,
    ButtonRoundedComponent
  ]
})
export class CustomFormsModule { }
