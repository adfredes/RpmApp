import { HttpParams, HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const getHttpParams = <R>(tParams: R): HttpParams => {
    let params = new HttpParams();
    for (const prop of Object.keys(tParams)) {
        if (tParams[prop])
        {
            if (tParams[prop] && tParams[prop] instanceof Date ){
            const value = `${tParams[prop].getMonth() + 1}-${tParams[prop].getDate()}-${tParams[prop].getFullYear()}`;
            console.log(value);
            params = params.append(prop, value);
            }
            else
            {
                params = params.append(prop, tParams[prop]?.toString());
            }
        }
    }

    return params;
};


export  const getPaginatedResult = <T, R>(url: string, rParam: R, http: HttpClient): Observable<PaginatedResult<T>> =>
{
    const params = getHttpParams<R>(rParam);
    return http.get<T>(url, { observe: 'response', params})
                .pipe(
                    map(response => {
                        const paginated: PaginatedResult<T> = new PaginatedResult<T>();
                        paginated.result = response.body;
                        paginated.pagination = response.headers.get('Pagination') ?
                        JSON.parse(response.headers.get('Pagination')) : null;
                        return paginated;
                    })
                );
};

