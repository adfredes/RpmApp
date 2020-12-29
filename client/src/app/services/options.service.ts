import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Level } from 'src/app/models/level.interface';
import { SelectCombo } from 'src/app/models/select-combo.interface';
import { Teacher } from 'src/app/models/teacher.interface';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  private apiUrl = environment.apiUrl;
  private levels: Level[];
  private teachers: Teacher[];
  constructor(private http: HttpClient) { }

  getLevels = () =>
    this.levels ? of(this.levels) :
      this.http.get<Level[]>(`${this.apiUrl}class/level`)
        .pipe(tap(levels => this.levels = levels))


  getLevelsSelectCombo = (): Observable<SelectCombo[]> =>
    this.getLevels().pipe(
      map((levels: Level[]) =>
        levels.map((level: Level) => {
          return {value : level.id.toString(), text : level.levelDescription};
        })
      ),
      map((levels: SelectCombo[]) => {
        levels.unshift({value: '0', text: '[Nivel]'});
        return levels;
      })
    )

  getTeachers = () =>
    this.teachers ? of(this.teachers) :
      this.http.get<Teacher[]>(`${this.apiUrl}member/teacher`)
        .pipe(tap(teachers => this.teachers = teachers))


  getTeachersSelectCombo = (): Observable<SelectCombo[]> =>
    this.getTeachers().pipe(
      map((teachers: Teacher[]) =>
      teachers.map((teacher: Teacher) => {          
          return {value : teacher.id.toString(), text : `${teacher.lastName} ${teacher.firstName}`};
        })
      ),
      map((teachers: SelectCombo[]) => {
        teachers.unshift({value: '0', text: '[Instructor]'});
        return teachers;
      })
    )



}
