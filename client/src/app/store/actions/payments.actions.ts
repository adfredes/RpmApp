import { createAction, props } from '@ngrx/store';
import { Payment } from 'src/app/models/payment.interface';

export const addPayment = createAction(
    '[Payments] Add Payment',
    props<{payment: Payment}>()
);

export const loadPayments = createAction(
    '[Payments] Load Payments'    
)

export const loadPaymentsSuccess = createAction(
    '[Payments] Load Payments Success'    ,
    props<{payments: Payment[]}>()
)

export const deletePayment = createAction(
    '[Payment] Delete Payment',
    props<{payment: Payment}>()
)

export const deletePaymentSuccess = createAction(
    '[Payment] Delete Payment Success',
    props<{payment: Payment}>()
)

