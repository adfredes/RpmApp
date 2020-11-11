import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-button-rounded',
  templateUrl: './button-rounded.component.html',
  styleUrls: ['./button-rounded.component.css']
})
export class ButtonRoundedComponent {

  @Input() label: string;
  @Input() type = 'submit';
  @Input() disabled = false;
  @Input() color = 'primary';
  @Input() outline = true;
  @Input() block = true;

  constructor() {}

}

