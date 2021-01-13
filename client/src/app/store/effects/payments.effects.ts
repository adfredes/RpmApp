import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType} from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as actions from 'src/app/store/actions/payments.actions'

import { of } from "rxjs";
import { MemberService } from '../../services/member.service';
import { Payment } from 'src/app/models/payment.interface';


@Injectable()
export class PaymentsEffects {
    constructor( private actions$: Actions, private memberService: MemberService){}

    loadPayments$ = createEffect(
        () => this.actions$.pipe(
            ofType( actions.loadPayments),
            // tap (data => console.log('effect tap', data)),
            mergeMap(
                () => this.memberService.getPayments()
                        .pipe(
                            // tap(data => console.log('getUsers effect', data))
                            map( payments => actions.loadPaymentsSuccess({payments})),
                            // catchError(error => of (usuariosActions.cargarUsuariosError({payload: error})))
                        )
            )
        )
    );

    deletePayment$ = createEffect(
        () => this.actions$.pipe(
            ofType(actions.deletePayment),
            mergeMap(
                (action) => this.memberService.deletePayment(action.payment.id)
                                        .pipe(
                                            map (() => actions.deletePaymentSuccess({payment: action.payment}))
                                        )                  
            )
        )

    );
}