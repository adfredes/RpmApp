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
import { FileUploadModule } from 'ng2-file-upload';
import { HasRoleDirective } from 'src/app/directives/has-role.directive';



@NgModule({
  declarations: [NavbarComponent, RegisterFormComponent, HasRoleDirective],
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
    NgxSpinnerModule,
    FileUploadModule
  ],
  exports: [
    MdbBootStrapModule,
    NavbarComponent,
    RegisterFormComponent,
    PipesModule,
    CustomFormsModule,
    ToastrModule,
    NgxSpinnerModule,
    FileUploadModule,
    HasRoleDirective
  ]
})
export class SharedModule { }
