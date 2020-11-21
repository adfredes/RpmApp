import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() type = 'date';
  @Input() controlId: string;
  bsConfig: any = {};

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY',
      isAnimated:  true,
      containerClass: 'theme-blue'
    };
  }

  writeValue(obj: any): void {

  }
  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {

  }
  isInvalidControl(): boolean {
    return this.ngControl.touched && this.ngControl.invalid;
  }

}

