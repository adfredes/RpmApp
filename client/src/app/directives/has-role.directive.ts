import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user.interface';
import { AccountService } from 'src/app/services/account.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  user: User;

  constructor(private accountService: AccountService,
              private viewContainerRef: ViewContainerRef,
              private templateRef: TemplateRef<any>) {
    accountService.currentUser$.pipe(take(1))
      .subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    if (this.user?.roles.some(r => this.appHasRole.includes(r))){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }else{
      this.viewContainerRef.clear();
    }
  }

}
