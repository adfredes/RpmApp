import { createReducer, on } from '@ngrx/store';
import { Payment } from 'src/app/models/payment.interface';
import { addPayment, loadPayments, loadPaymentsSuccess, deletePayment, deletePaymentSuccess } from '../actions';


export interface PaymentsState {
    payments: Payment[]; 
    loading: boolean
}

export const paymentsInitialState: PaymentsState = {
   payments: [],
   loading: false
}

const _paymentsReducer = createReducer(paymentsInitialState,

    on(addPayment, (state, {payment}) => ({ ...state, payments: [payment, ...state.payments]})),

    on(loadPayments, state => ({...state, loading: true})),

    on(loadPaymentsSuccess, (state, {payments}) => ({...state, payments, loading: false})),

    on(deletePayment, (state, {payment}) => ({...state, loading: true})),
    
    on(deletePaymentSuccess, (state, {payment}) => ({...state,payments: [...state.payments.filter(p=> p.id !== payment.id)], loading: false})),

);

export function paymentsReducer(state, action) {
    return _paymentsReducer(state, action);
}