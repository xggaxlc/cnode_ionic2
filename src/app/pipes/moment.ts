import {
  Pipe,
  PipeTransform
} from '@angular/core';

import * as Moment from 'moment';

Moment.locale('zh-cn');

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {
  transform(time: string, func: string): string {
    return Moment(new Date(time))[func]();
  }
}