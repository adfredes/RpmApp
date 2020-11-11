import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  formChange: FormGroup;

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm = () => {
    this.formChange = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}')]],
      rePassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}')]]
    });
  }

  submit = () => {
    if (this.formChange.invalid) {
      return;
    }
    this.accountService.change(this.formChange.value)
      .subscribe(() => {
          this.toastr.success('Contraseña modificada');
          this.router.navigate(['/']);
      });
  }

  cancel = () => {
    this.formChange.reset();
    this.router.navigate(['/']);
  }

}
