import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error){
          switch (error.status){
            case 400:
              if (error.error.errors){
                const modalStateErrors = [];
                for (const key in error.error.errors){
                  if (error.error.errors[key]){
                    if (Array.isArray(error.error.errors[key]))
                    {
                      error.error.errors[key].forEach( e => modalStateErrors.push(e));
                    }
                    else {
                      modalStateErrors.push(error.error.errors[key]);
                    }
                  }
                }

                const mensaje = modalStateErrors.reduce((a, m) =>  a + '<br />' + m);
                this.toastr.error('Bad Request', mensaje, {enableHtml: true});
                throw modalStateErrors.flat();
              }else if (typeof(error.error) === 'object') {
                this.toastr.error('Bad Request', error.status);
              }else {
                this.toastr.error(error.error);
              }
              break;

            case 401:
              this.toastr.error('Unauthorized', error.status);
              break;

            case 404:
              this.router.navigate(['/not-found']);
              break;

            case 500:
              const navigationExtras: NavigationExtras = { state: {error: error.error}};
              this.router.navigate(['/server-error'], navigationExtras);
              break;

            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;


          }
        }
        return throwError(error);
      })
    );
  }
}
