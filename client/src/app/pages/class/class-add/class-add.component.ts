import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { SelectCombo } from 'src/app/models/select-combo.interface';
import { ClassService } from 'src/app/services/class.service';
import { OptionsService } from 'src/app/services/options.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-class-add',
  templateUrl: './class-add.component.html',
  styleUrls: ['./class-add.component.css']
})
export class ClassAddComponent implements OnInit {
  @Input() onClose;  
  constructor(private classService: ClassService, private toastr: ToastrService) {      
  }
  

  ngOnInit(): void {
    
  }
  

  onSubmit = (values) => {    
    this.classService.addClass(values)
      .subscribe(() => {
        this.toastr.success('Clase agregada');
        this.close();
      });
  }

  onCancel = () => {
    this.close();
  }

  close = () => {
    if (this.onClose){
      this.onClose();
    }
  }

}
