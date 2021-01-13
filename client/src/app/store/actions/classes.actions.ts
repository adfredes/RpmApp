import { createAction, props } from '@ngrx/store';
import { Class } from 'src/app/models/class.interface';
import { ClassParams } from 'src/app/models/classParams';
import { Pagination } from 'src/app/models/pagination';

export const loadClasses = createAction(
    '[Classes] Load Classes'
);

export const loadClassesSuccess = createAction(
    '[Classes] Load Classes Success',
    props<{classes: Class[]; pagination: Pagination}>()
)

export const addedClass = createAction(
    '[Classes] Added Class', 
    props<{leason: Class}>()
)

export const updatedClass = createAction(
    '[Classes] Updated Class',
    props<{leason: Class}>()
)