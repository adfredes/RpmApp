import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule
  ],
  exports: [
    MDBBootstrapModule,
    BrowserAnimationsModule
  ]
})
export class MdbBootStrapModule { }
