import { Component, OnDestroy, OnInit } from '@angular/core';
import { MemberService } from 'src/app/services/member.service';
import { take } from 'rxjs/operators';
import { Payment } from 'src/app/models/payment.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaymentsAddComponent } from '../payments-add/payments-add.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Subscription } from 'rxjs';
import * as actions from 'src/app/store/actions/payments.actions';
import Swal from 'sweetalert2';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.css']
})
export class PaymentsListComponent implements OnInit, OnDestroy {

  payments: Payment[];
  paymentsFilter: Payment[];
  formSearch: FormGroup;
  bsModalRef: BsModalRef;
  paymentsSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private memberService: MemberService,
              private modalService: BsModalService,
              private store: Store<AppState>,
              private fileService: FileService) { }

  ngOnInit(): void {
    this.getPayments();
    this.subscribeStore();
    this.createForm();        
  }

  subscribeStore = () => {    
    this.paymentsSubscription = this.store.select('payments').subscribe(({payments}) => {      
      this.payments = payments;
      this.paymentsFilter = [...payments];
    });
  }

  ngOnDestroy = () => {
    this.paymentsSubscription.unsubscribe();
  }

  createForm = () => {
    this.formSearch = this.fb.group({
      month: '',
      year: ''
    });
  }

  getPayments = () =>
    this.store.dispatch(actions.loadPayments());

  openAddModal = () => {
    this.bsModalRef = this.modalService.show(PaymentsAddComponent);
    // this.bsModalRef.content.onAdd.subscribe(() => this.getPayments());
  }

  search = () => {
    this.paymentsFilter = [...this.payments];
    const year = this.formSearch.controls['year'].value;
    const month = this.formSearch.controls['month'].value;

    this.paymentsFilter = this.paymentsFilter.filter(p => {
      const paymentDate = new Date(p.paymentDate);
      return (year == '' ? true : paymentDate.getFullYear() == year)
             && (month == '' ? true : (paymentDate.getMonth() + 1) == month);
    });      
    
  }

  eliminarPayment = (payment: Payment) => {
    Swal.fire({
      title: 'Deseas eliminar el pago?',
      showDenyButton: true,      
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {      
      if (result.isConfirmed) {
        this.store.dispatch(actions.deletePayment({payment}))           
      }
    })
  }

  descargarPayment = ({ticketUrl}:{ticketUrl: string}) => {
    this.fileService.download(ticketUrl)
        .subscribe(data => {
          const fileName = ticketUrl.split('/').pop();
          // window.open(window.URL.createObjectURL(data))
          var a = document.createElement("a");
          a.href = URL.createObjectURL(data);
          a.download = fileName;
          // start download
          a.click();
        });
  }
      

}
