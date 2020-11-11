import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  formLogin: FormGroup;

  constructor(public accountService: AccountService, private fb: FormBuilder) {
    this.createFormLogin();
   }

  ngOnInit(): void {
  }

  createFormLogin = () => {
    this.formLogin = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  logout = ()  => this.accountService.logout();

  login = () => {
    if (this.formLogin.invalid)
    {
      return;
    }
    const values = this.formLogin.value;
    this.accountService.login(values)
      .subscribe(user => {
        if (user){
          this.formLogin.reset();
        }
      });
  }



}
