import { Component, Input, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-class-card',
  templateUrl: './class-card.component.html',
  styleUrls: ['./class-card.component.css']
})
export class ClassCardComponent implements OnInit {
  @Input() class: Class;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  toDetail = () => {
    this.router.navigate(['./class/detail', this.class.id]);
  }

}
