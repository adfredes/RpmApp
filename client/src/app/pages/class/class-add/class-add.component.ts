import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { SelectCombo } from 'src/app/models/select-combo.interface';
import { ClassService } from 'src/app/services/class.service';
import { OptionsService } from 'src/app/services/options.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { addedClass } from 'src/app/store/actions';
import { Class } from 'src/app/models/class.interface';

@Component({
  selector: 'app-class-add',
  templateUrl: './class-add.component.html',
  styleUrls: ['./class-add.component.css']
})
export class ClassAddComponent implements OnInit {
  @Input() onClose;  
  constructor(private classService: ClassService, private toastr: ToastrService, private store: Store<AppState>) {      
  }
  

  ngOnInit(): void {
    
  }
  

  onSubmit = (values) => {    
    this.classService.addClass(values)
      .subscribe((leason: Class) => {        
        this.store.dispatch(addedClass({leason}))
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
