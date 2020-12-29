import { Component, Input, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.interface';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalEditComponent } from '../modals/modal-edit.component';

@Component({
  selector: 'app-class-card',
  templateUrl: './class-card.component.html',
  styleUrls: ['./class-card.component.css']
})
export class ClassCardComponent implements OnInit {
  @Input() class: Class;
  isClose: boolean;
  today = new Date();  
  constructor(private router: Router, private modalService: BsModalService) {

  }

  ngOnInit(): void {
    this.isClose = new Date(this.class.dateOfClass) < new Date();
  }

  toDetail = () => {
    this.router.navigate(['./class/detail', this.class.id]);
  }

  openEditModal = () => {
    this.modalService.show(ModalEditComponent,{
      initialState:{clase: this.class}
    });        
  }

}
