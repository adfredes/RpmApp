import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Class } from 'src/app/models/class.interface';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.css']
})
export class ModalEditComponent implements OnInit {

  @Input() clase: Class;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

}
