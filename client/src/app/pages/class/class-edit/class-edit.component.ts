import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Class } from 'src/app/models/class.interface';
import { ClassService } from '../../../services/class.service';
import { BussyService } from '../../../services/bussy.service';
import { AccountService } from 'src/app/services/account.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-class-edit',
  templateUrl: './class-edit.component.html',
  styleUrls: ['./class-edit.component.css']
})
export class ClassEditComponent implements OnInit {
  @Input() clase: Class;
  @Output() onClose = new EventEmitter();


  constructor(private classService: ClassService, private bussyService: BussyService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1))
      .subscribe(user => {              
        this.classService.createHubConnection(this.clase.id, user);
      });
  }

  onSubmit = async(values) => {    
    this.bussyService.busy();
    
    try{
      await this.classService.updateClass(this.clase.id, values);
      this.classService.stopHubConnection();
    }catch(error){
      console.log(error);
    }finally{
      this.bussyService.iddle()
    }
    
    // this.classService. (values)
    //   .subscribe((leason: Class) => {        
    //     this.store.dispatch(addedClass({leason}))
    //     this.toastr.success('Clase agregada');
    //     this.close();
    //   });

    this.onClose.emit();
  }

}
