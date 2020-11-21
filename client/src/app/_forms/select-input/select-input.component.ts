import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SelectCombo } from 'src/app/models/select-combo.interface';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.css']
})
export class SelectInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() controlId: string;
  @Input() items: SelectCombo[];

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  isInvalidControl(): boolean {
    return this.ngControl.touched && this.ngControl.invalid;
  }

}
