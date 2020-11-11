import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  isSendToken = false;
  formForgot: FormGroup;
  constructor(private fb: FormBuilder, private accountService: AccountService, private toastr: ToastrService, private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm = () => {
    this.formForgot = this.fb.group({
      username: ['', Validators.required]
    });
  }

  forgot = () => {
    if (this.formForgot.invalid) {
      this.toastr.warning('Revise el formulario');
      return;
    }
    this.accountService.forgot(this.formForgot.value)
      .subscribe(() => {
        this.toastr.success('Contraseña enviada');
        this.formForgot.reset();
        this.isSendToken = true;
      });
  }

  cancel = () => {
    this.router.navigate(['/account/login']);
  }

}
