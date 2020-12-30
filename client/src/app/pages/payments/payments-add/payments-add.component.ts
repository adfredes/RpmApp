import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user.interface';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-payments-add',
  templateUrl: './payments-add.component.html',
  styleUrls: ['./payments-add.component.css']
})
export class PaymentsAddComponent implements OnInit, OnDestroy {
  
  public onAdd = new Subject<boolean>();

  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;  
  formTicket: FormGroup;
  formSubscription: Subscription;

  constructor(private accountService: AccountService,
              private memberService: MemberService,
              private toastr: ToastrService,
              private fb: FormBuilder,
              public bsModalRef: BsModalRef) {
    this.accountService.currentUser$.pipe(take(1))
      .subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.createForm();
    this.initializeUploader();
  }

  ngOnDestroy = () => this.formSubscription.unsubscribe();

  createForm = () => {
    const minYear = (new Date()).getFullYear();
    this.formTicket = this.fb.group({
      amount: ['', Validators.required],
      month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      year: ['', [Validators.required, Validators.min(minYear - 1), Validators.max(minYear + 1)]]
    });
    
    this.formSubscription = this.formTicket.valueChanges.
      subscribe(data => {
        if(this.formTicket.invalid){
          this.uploader.options.url = '';
          return;
        }
        this.uploader.options.url=`${this.baseUrl}member/add-payment?amount=${data.amount}&month=${data.month}&year=${data.year}`;
      });
  }

  fileOverBase = (e: any) => {
    this.hasBaseDropzoneOver = e;
  }
 
  initializeUploader = () => {    
    this.uploader = new FileUploader({      
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1020
    });        
    
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if (this.uploader.queue.length > 1){
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    };

    this.uploader.onSuccessItem = (item, response, status, header) => {
      if (response){
        this.toastr.success('Comprobante cargado.')
        this.onAdd.next(true);
        this.onAdd.unsubscribe();
        this.bsModalRef.hide();
        //const photo: Photo = JSON.parse(response);
                
      }
    };
  }

  submit = () => {
    this.formTicket.markAllAsTouched();
    if(this.formTicket.invalid){return;}
    this.uploader.uploadAll()
  }

}
