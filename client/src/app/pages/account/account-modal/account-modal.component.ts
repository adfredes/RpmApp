import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserAccount } from 'src/app/models/user-account.interface';
import { SelectCombo } from 'src/app/models/select-combo.interface';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.css']
})
export class AccountModalComponent implements OnInit {
  user: Partial<UserAccount> = {};
  roles: SelectCombo[] = [];
  @Output() updateSelectedRoles = new EventEmitter();
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.getRolesArray();
  }

  private getRolesArray = () => {
    this.roles.forEach(role => {
      role.value = this.user.roles?.includes(role.text) ? true : false;
    });
  }

  updateRoles() {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }
}
