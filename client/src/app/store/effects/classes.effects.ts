import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType} from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as actions from 'src/app/store/actions/classes.actions'

import { of } from "rxjs";
import { ClassService } from "src/app/services/class.service";



@Injectable()
export class ClassesEffects {
    constructor( private actions$: Actions, private classService: ClassService){}

    loadClasses$ = createEffect(
        () => this.actions$.pipe(
            ofType( actions.loadClasses),
            // tap (data => console.log('effect tap', data)),
            mergeMap(
                (action) => this.classService.getClasses()
                        .pipe(
                            // tap(data => console.log('getUsers effect', data))
                            map( classes => actions.loadClassesSuccess({classes: classes.result, pagination: classes.pagination})),
                            // catchError(error => of (usuariosActions.cargarUsuariosError({payload: error})))
                        )
            )
        )
    );    
}