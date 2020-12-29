import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/services/member.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OptionsService } from 'src/app/services/options.service';
import { Member } from 'src/app/models/member.interface';
import { Pagination } from 'src/app/models/pagination';
import { MembersParams } from 'src/app/models/members-params';
import { SelectCombo } from 'src/app/models/select-combo.interface';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
  public members: Member[] = [];
  public formSearch: FormGroup;
  public levels: SelectCombo[] = [];
  public genders: SelectCombo[] = [{value:'', text:'[Género]'},{value: 'Hombre', text: 'Hombre'},{value: 'Mujer', text: 'Mujer'},{value: 'Otro', text: 'Otro'}];
  public roles: SelectCombo[] = [{value:'', text:'[Tipo]'},{value: 'Student', text: 'Alumno'},{value: 'Teacher', text: 'Instructor'}];
  private pagination: Pagination;

  constructor(private memberService: MemberService, private fb: FormBuilder,
              private optionsService: OptionsService) { }

  ngOnInit(): void {
    this.loadLevels();
    this.createForm();
    this.searchMembers();    
  }

  private loadLevels = () =>
  this.optionsService.getLevelsSelectCombo()
    .pipe(take(1),
      map(levels => {
        levels.forEach(l => l.value = l.text == '[Nivel]' ? '' : l.text);
        return levels;
      })
    )
    .subscribe(levels => this.levels = levels)

  createForm(): void {
    this.formSearch = this.fb.group({
      level: [''],
      role: [''],
      gender: ['']
    });
  }

  searchMembers = () => {    
    this.memberService.membersParams = new MembersParams(this.formSearch.value);    
    this.members = [];
    this.loadMembers();
  }

  private loadMembers = () => {
    this.memberService.getMembers()
      .subscribe(paged => {        
        this.members.push(...paged.result);
        this.pagination = paged.pagination;
      });
  }

}
