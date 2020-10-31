import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskDate'
})
export class TaskDatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
