import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member.interface';
import { Photo } from 'src/app/models/photo.interface';
import { User } from 'src/app/models/user.interface';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-photo-add',
  templateUrl: './photo-add.component.html',
  styleUrls: ['./photo-add.component.css']
})
export class PhotoAddComponent implements OnInit {
  @Input() member: Member;
  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;

  constructor(private accountService: AccountService, private memberService: MemberService) {
    this.accountService.currentUser$.pipe(take(1))
      .subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase = (e: any) => {
    this.hasBaseDropzoneOver = e;
  }
 
  initializeUploader = () => {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'member/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1020
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, header) => {
      if (response){
        const photo: Photo = JSON.parse(response);
        this.member.photos.push(photo);
        if (photo.isMain){
          this.user.avatar = photo.url;
          // this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
        }
      }
    };
  }

}
