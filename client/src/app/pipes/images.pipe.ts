import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.interface';

@Pipe({
  name: 'images'
})
export class ImagesPipe implements PipeTransform {

  transform(user: User, image: string): string {
    return !user[image] ? 'assets/images/user.png' : user[image];
  }

}
