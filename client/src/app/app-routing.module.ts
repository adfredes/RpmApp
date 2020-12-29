import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { RegisterComponent } from './pages/account/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ChangePasswordComponent } from './pages/account/change-password/change-password.component';
import { ResetPasswordComponent } from './pages/account/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/account/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/account/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ClassListComponent } from './pages/class/class-list/class-list.component';
import { ClassAddComponent } from './pages/class/class-add/class-add.component';
import { ClassDetailComponent } from './pages/class/class-detail/class-detail.component';
import { MemberEditComponent } from './pages/members/member-edit/member-edit.component';
import { AdminGuard } from './guards/admin.guard';
import { AccountsListComponent } from './pages/account/accounts-list/accounts-list.component';
import { MembersListComponent } from './pages/members/members-list/members-list.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'account',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'change', component: ChangePasswordComponent, canActivate: [AuthGuard] },
      { path: 'reset/:username', component: ResetPasswordComponent},
      { path: 'forgot', component: ForgotPasswordComponent},
      { path: 'list', component: AccountsListComponent, canActivate: [AdminGuard]}
    ]
  },
  {
    path: 'class',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: ClassListComponent},
      { path: 'add', component: ClassAddComponent},
      { path: 'detail/:id', component: ClassDetailComponent}
    ]
  },
  {
    path: 'members',
    canActivate: [AuthGuard],
    children: [
      {path: 'edit', component: MemberEditComponent},
      {path: 'list', component: MembersListComponent}
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
