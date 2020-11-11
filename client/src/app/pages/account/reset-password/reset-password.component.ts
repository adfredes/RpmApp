import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  formReset: FormGroup;
  private token = '';
  private username = '';

  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService) {
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm = () => {
    this.formReset = this.fb.group({
      username: this.username,
      token: this.token,
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}')]],
      rePassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}')]]
    });
  }

  submit = () => {
    if (this.formReset.invalid) {
      this.toastr.warning('Revise el formulario');
      return;
    }
    this.accountService.reset(this.formReset.value)
        .subscribe((user: User) => {
          if (user){
            this.toastr.success('Contraseña modificada');
            this.router.navigate(['/']);
          }
        });
  }

  cancel = () => this.router.navigate(['/']);

}
