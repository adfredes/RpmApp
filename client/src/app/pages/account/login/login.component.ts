import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router, private toastr: ToastrService) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm = () => {
    this.formLogin = this.fb.group(
      {
        username: [localStorage.getItem('username'), [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        remember: [localStorage.getItem('username') ? true : false]
      }
    );
  }

  login = () => {
    if (this.formLogin.invalid)
    {
      this.toastr.warning('Revise el formulario');
      return;
    }
    this.accountService.login(this.formLogin.value)
      .subscribe(user => {
        if (user){
          const isRemember = this.formLogin.get('remember').value as boolean;
          if (isRemember) {
            localStorage.setItem('username', user.username);
          }
          else{
            localStorage.removeItem('username');
          }
          this.toastr.success('Usuario logueado');
          this.formLogin.reset();
          this.router.navigate(['/']);
        }
      });
  }

}
