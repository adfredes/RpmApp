import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member.interface';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Partial<Member> = {};

  constructor() { }

  ngOnInit(): void {
  }

}
