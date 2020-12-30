import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/services/member.service';
import { take } from 'rxjs/operators';
import { Payment } from 'src/app/models/payment.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaymentsAddComponent } from '../payments-add/payments-add.component';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.css']
})
export class PaymentsListComponent implements OnInit {

  payments: Payment[];
  paymentsFilter: Payment[];
  formSearch: FormGroup;
  bsModalRef: BsModalRef;

  constructor(private fb: FormBuilder,
              private memberService: MemberService,
              private modalService: BsModalService) { }

  ngOnInit(): void {
    this.createForm();
    this.getPayments();
  }

  createForm = () => {
    this.formSearch = this.fb.group({
      month: '',
      year: ''
    });
  }

  getPayments = () =>
    this.memberService.getPayments()
      .pipe(
        take(1)
      ).subscribe(payments => {
        this.payments = payments;
        this.paymentsFilter = [...payments];
      });

  openAddModal = () => {
    this.bsModalRef = this.modalService.show(PaymentsAddComponent);
    this.bsModalRef.content.onAdd.subscribe(() => this.getPayments());
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
      

}
