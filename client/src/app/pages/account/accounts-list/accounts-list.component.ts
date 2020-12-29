import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { SelectCombo } from 'src/app/models/select-combo.interface';
import { UserAccount } from 'src/app/models/user-account.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccountModalComponent } from '../account-modal/account-modal.component';
import { AdminService } from 'src/app/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.css']
})
export class AccountsListComponent implements OnInit {

  roles: SelectCombo[] = [];
  usersFilter: UserAccount[] = [];
  formSearch: FormGroup;
  private users: UserAccount[] = [];
  private bsModalRef: BsModalRef;

  constructor(private fb: FormBuilder, private accountService: AccountService,
              private modalService: BsModalService, private adminService: AdminService,
              private toast: ToastrService) {
    this.getRoles();
    this.createForm();
    this.getUsers();
  }

  private openModal = (user: UserAccount) => {
    const initialState = {
      user,
      roles: this.roles.filter(role => role.value !== '0')
    };
    this.bsModalRef = this.modalService.show(AccountModalComponent, {initialState});    
    this.subscribeModalEvent(user);
  }

  private subscribeModalEvent(user: UserAccount){
    this.bsModalRef.content.updateSelectedRoles.subscribe((values: SelectCombo[]) => {
      const rolesToUpdate = [...values.filter(role => role.value === true).map(role => role.text)];
      this.updateUserRoles(user, rolesToUpdate);      
    })
  }

  private updateUserRoles(user: UserAccount, roles: string[]){
    this.adminService.updateUserRoles(user.userName, roles)
      .subscribe(() => {
        this.toast.success('Roles modificados');
        user.roles = [...roles];
      });
  }

  viewUser = (user: UserAccount) => this.openModal(user);

  ngOnInit(): void {
  }

  getRoles = () => {
    this.accountService.getRoles()
      .subscribe(roles => {
        roles.unshift({value: '0', text: '[ROL]'});
        this.roles = [... roles];
      });
  }

  getUsers = () => {
    this.accountService.getUsers()
      .subscribe(users => {
        this.users = users;
        this.usersFilter = [...users];
      });
  }

  createForm = () => {
    this.formSearch = this.fb.group({
      firstName: '',
      lastName: '',
      userName: '',
      roleId: '0'
    });

    this.formSearch.valueChanges.subscribe(
      (values) => this.filter(values)
    );
  }

  filter = ({userName, firstName, lastName, roleId}) => {
    this.usersFilter = this.users.filter(user => {
      const isInRole = roleId === '0' ? true : user.roles.includes(roleId);
      return user.userName.toLowerCase().includes(userName.toLowerCase()) &&
      user.firstName.toLowerCase().includes(firstName.toLowerCase()) &&
      user.lastName.toLowerCase().includes(lastName.toLowerCase()) &&
      isInRole;
    });

  }

}
