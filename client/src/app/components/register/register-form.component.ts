import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { User } from '../../models/user.interface';
import { CustomValidatorsService } from '../../services/custom-validators.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCancel = new EventEmitter();

  formRegister: FormGroup;
  genders: {text: string, value: number}[] = [
    {text: 'Hombre', value: 1},
    {text: 'Mujer', value: 2},
    {text: 'Otro', value: 3}
  ];

  documentTypes: {text: string, value: number}[] = [
    {text: 'DNI', value: 1},
    {text: 'Pasaporte', value: 2}
  ];

  constructor(private fb: FormBuilder, public accountService: AccountService, private customValidators: CustomValidatorsService,
              private toastr: ToastrService) {
    this.crearFormulario();
   }

  ngOnInit(): void {
  }

  crearFormulario = () =>
  {
    this.formRegister = this.fb.group({
      city: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      documentTypeId: [1, Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      genderId: [1, Validators.required],
      username: ['', {validators: [Validators.required, Validators.minLength(4)],
                      asyncValidators: [this.customValidators.isUserExists], updateOn: 'blur'}],
      email: ['', {validators: [Validators.required], asyncValidators: [this.customValidators.isEmailExists], updateOn: 'blur'}],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}')]],
      rePassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}')]]
    },
    {
      validators: [this.customValidators.passwordsEquals('password', 'rePassword')]
    });

  }

  submit = () => {
    this.formRegister.markAllAsTouched();
    if (this.formRegister.invalid) {
      this.toastr.warning('Revise el formulario');
      return;
    }
    this.accountService.register(this.formRegister.value)
      .subscribe((user: User) => {
        if (user){
          this.formRegister.reset({});
          this.toastr.success('Usuario creado');
          this.cancel();
        }
      });
  }

  cancel = () => this.onCancel.emit();


}
