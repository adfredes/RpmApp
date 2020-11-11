import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './components/shared.module';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from '@angular/router';
import { ClasesComponent } from './pages/clases/clases.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClasesComponent,
    PagosComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    LoginComponent
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
    {provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
