import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member.interface';
import { Photo } from 'src/app/models/photo.interface';
import { User } from 'src/app/models/user.interface';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member;
  user: User;

  constructor(private accountService: AccountService, private memberService: MemberService) {
    this.accountService.currentUser$.pipe(take(1))
      .subscribe(user => this.user = user);
  }

  ngOnInit(): void {
  }

  setMainPhoto = (photo: Photo) => {
    this.memberService.setMainPhoto(photo.id)
      .subscribe(() => {
        this.user.avatar = photo.url;
        // this.accountService.setCurrentUser(this.user);
        this.member.photoUrl = photo.url;
        this.member.photos.forEach( p => p.isMain = p.id === photo.id ? true : false);
      });
  }

  deletePhoto = (photo: Photo) => {
    this.memberService.deletePhoto(photo.id)
      .subscribe(() => {
        this.member.photos = this.member.photos.filter(p => p.id !== photo.id);
      });
  }

}
