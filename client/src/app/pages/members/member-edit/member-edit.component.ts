import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'src/app/services/member.service';
import { AccountService } from 'src/app/services/account.service';
import { take } from 'rxjs/operators';
import { Member } from '../../../models/member.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  tabSelected = 0;
  editForm: FormGroup;
  member: Member;
  genders: {text: string, value: number}[] = [
    {text: 'Hombre', value: 1},
    {text: 'Mujer', value: 2},
    {text: 'Otro', value: 3}
  ];

  documentTypes: {text: string, value: number}[] = [
    {text: 'DNI', value: 1},
    {text: 'Pasaporte', value: 2}
  ];
  constructor(private fb: FormBuilder,
              private memberService: MemberService,
              private accountService: AccountService,
              private toastr: ToastrService)
  {
    this.getUser();
  }

  ngOnInit(): void {
  }

  getUser = () => {
    this.accountService.currentUser$
    .pipe(take(1))
    .subscribe(user => this.getMember(user.username));
  }

  getMember = (username) => {
    this.memberService.getMember(username)
      .subscribe(member => this.createForm(member));
  }

  createForm = (member: Member) => {
    member.dateOfBirth = new Date(member.dateOfBirth);
    this.member = member;
    this.editForm = this.fb.group({
      firstName : [member.firstName, Validators.required],
      lastName : [member.lastName, Validators.required],
      dateOfBirth : [member.dateOfBirth, Validators.required],
      genderId : member.genderId,
      documentTypeId : member.documentTypeId,
      documentNumber : [member.documentNumber, Validators.required],
      levelId : member.levelId,
      city : [member.city, Validators.required],
      knownAs : member.knownAs,
      phoneNumber: [member.phoneNumber, Validators.required]
    });
  }

  resetForm = (member: Member) => {
    member.dateOfBirth = new Date(member.dateOfBirth);
    this.editForm.reset(
      {
        firstName : member.firstName,
        lastName : member.lastName,
        dateOfBirth : member.dateOfBirth,
        genderId : member.genderId,
        documentTypeId : member.documentTypeId,
        documentNumber : member.documentNumber,
        levelId : member.levelId,
        city : member.city,
        knownAs : member.knownAs,
        phoneNumber: member.phoneNumber
      }
    );
  }

  submit(): void {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid){ return; }
    this.memberService.updateMember(this.editForm.value)
      .subscribe((member) => {
        this.toastr.success('Perfil Modificado');
        this.member = member;
        this.resetForm(this.member);
      });
  }

}
