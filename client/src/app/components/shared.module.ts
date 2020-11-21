import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MdbBootStrapModule } from '../mdbootstrap/mdb-boot-strap.module';
import { RegisterFormComponent } from './register/register-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from '../_forms/custom-forms.module';
import { PipesModule } from '../pipes/pipes.module';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [NavbarComponent, RegisterFormComponent],
  imports: [
    CommonModule,
    MdbBootStrapModule,
    ReactiveFormsModule,
    FormsModule,
    CustomFormsModule,
    PipesModule,
    RouterModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center'
    }),
    NgxSpinnerModule
  ],
  exports: [
    MdbBootStrapModule,
    NavbarComponent,
    RegisterFormComponent,
    PipesModule,
    CustomFormsModule,
    ToastrModule,
    NgxSpinnerModule
  ]
})
export class SharedModule { }
