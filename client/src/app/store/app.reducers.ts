import { ActionReducerMap } from '@ngrx/store';
import * as reducers  from './reducers';


export interface AppState {
   payments: reducers.PaymentsState,
   classes: reducers.ClassesState
}



export const appReducers: ActionReducerMap<AppState> = {
    payments: reducers.paymentsReducer,
    classes: reducers.classesReducer
}