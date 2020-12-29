import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localEsAr from '@angular/common/locales/es-AR';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './components/shared.module';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from '@angular/router';
import { PagosComponent } from './pages/pagos/pagos.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { ErrorsInterceptor } from './_interceptors/errors.interceptor';
import { ChangePasswordComponent } from './pages/account/change-password/change-password.component';
import { ResetPasswordComponent } from './pages/account/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/account/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { LoginComponent } from './pages/account/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from './_forms/custom-forms.module';
import { MemberEditComponent } from './pages/members/member-edit/member-edit.component';
import { PhotoEditorComponent } from './pages/members/photo-editor/photo-editor.component';
import { ClassEditComponent } from './pages/class/class-edit/class-edit.component';
import { ClassCardComponent } from './pages/class/class-card/class-card.component';
import { ClassListComponent } from './pages/class/class-list/class-list.component';
import { ClassDetailComponent } from './pages/class/class-detail/class-detail.component';
import { ClassAddComponent } from './pages/class/class-add/class-add.component';
import { PhotoAddComponent } from './pages/members/photo-add/photo-add.component';
import { ModalAddComponent } from './pages/class/modals/modal-add.component';
import { AccountsListComponent } from './pages/account/accounts-list/accounts-list.component';
import { AccountModalComponent } from './pages/account/account-modal/account-modal.component';
import { MembersListComponent } from './pages/members/members-list/members-list.component';
import { MemberCardComponent } from './pages/members/member-card/member-card.component';
import { ClassFormComponent } from './pages/class/class-form/class-form.component';
import { ModalEditComponent } from './pages/class/modals/modal-edit.component';

registerLocaleData(localEsAr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PagosComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    LoginComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    PhotoAddComponent,
    ClassEditComponent,
    ClassCardComponent,
    ClassListComponent,
    ClassDetailComponent,
    ClassAddComponent,
    ModalAddComponent,
    AccountsListComponent,
    AccountModalComponent,
    MembersListComponent,
    MemberCardComponent,
    ClassFormComponent,
    ModalEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    CustomFormsModule,
    SharedModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'es-AR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
