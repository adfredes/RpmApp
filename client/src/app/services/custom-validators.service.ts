import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from './account.service';

interface ErrorValidate {
  [s: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor(private accountService: AccountService) { }

  isUserExists = (control: FormControl): Promise<ErrorValidate> | Observable<ErrorValidate> =>
  {
    if ( !control.value) {
      return of(null);
    }
    return this.accountService.isUserExists(control.value)
      .pipe(
        map((userExists: boolean) => userExists ? { userExists } : null)
      );
  }

  isEmailExists = (control: FormControl): Observable<ErrorValidate | null> =>
  {
    if ( !control.value) {
      return of(null);
    }
    const obs = this.accountService.isEmailExists(control.value)
                .pipe(
                  map((emailExists: boolean) => emailExists ? { emailExists } : null)
                );
    return obs;
  }

  passwordsEquals = ( pass1Name: string, pass2Name: string ) => {

    return ( formGroup: FormGroup) => {

      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];

      if (pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      }
      else{
        pass2Control.setErrors({ isNotMatching: true});
      }

    };
  }
}
