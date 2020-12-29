import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Class } from 'src/app/models/class.interface';

@Component({
  selector: 'app-class-edit',
  templateUrl: './class-edit.component.html',
  styleUrls: ['./class-edit.component.css']
})
export class ClassEditComponent implements OnInit {
  @Input() clase: Class;
  @Output() onClose = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }

}
