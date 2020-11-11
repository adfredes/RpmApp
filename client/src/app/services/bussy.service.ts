import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BussyService {
  bussyRequestCount = 0;
  constructor() { }

  busy = () => {
    this.bussyRequestCount++;
    Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Aguarde'});
    Swal.showLoading();

  }

  iddle = () => {
    this.bussyRequestCount--;
    if (this.bussyRequestCount <= 0) {
      this.bussyRequestCount = 0;
      Swal.close();
    }
  }
}
