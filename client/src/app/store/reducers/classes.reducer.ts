import { createReducer, on } from '@ngrx/store';
import { Class } from 'src/app/models/class.interface';
import { ClassParams } from 'src/app/models/classParams';
import { addedClass, loadClasses, loadClassesSuccess } from '../actions/classes.actions';
import { Pagination } from 'src/app/models/pagination';

export interface ClassesState {    
    loading: boolean;
    classes: Class[]; 
    pagination: Pagination;
}

export const classesInitialState: ClassesState = {
    classes: [],
    loading: false,
    pagination: null
}

const _classesReducer = createReducer(classesInitialState,
    
    on (loadClasses, state => ({...state, loading: true})),

    on (loadClassesSuccess, (state, {classes, pagination}) => ({...state, loading: false, classes: pagination.currentPage === 1 ? classes : [...state.classes, ...classes] , pagination: {...pagination}})),

    on (addedClass, (state, {leason}) => ({...state, classes: [...state.classes, leason]}))

);

export function classesReducer(state, action) {
    return _classesReducer(state, action);
}