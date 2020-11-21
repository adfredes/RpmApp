import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BussyService {
  bussyRequestCount = 0;
  constructor(private spinnerService: NgxSpinnerService) { }

  busy = () => {
    this.bussyRequestCount++;
    // Swal.fire({
    //     allowOutsideClick: false,
    //     icon: 'info',
    //     text: 'Aguarde'});
    // Swal.showLoading();
    // this.spinnerService.show(undefined, {
    //   type: 'ball-clip-rotate-multiple',
    //   bdColor: 'rgba(0,0,0,0.2)',
    //   color: '#333333',
    //   fullScreen: true
    // });
    this.spinnerService.show();
  }

  iddle = () => {
    this.bussyRequestCount--;
    if (this.bussyRequestCount <= 0) {
      this.bussyRequestCount = 0;
      // Swal.close();
      this.spinnerService.hide();
    }
  }
}
