import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) { }

  download = (url: string) => {    
    return this.httpClient.get(url, {responseType: 'arraybuffer'})
                .pipe(
                  map(res => new Blob([res]))
                )
  }
}
