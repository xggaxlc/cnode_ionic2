import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'protocol'
})
export class ProtocolPipe implements PipeTransform {
  transform(src: string): string {
    // filter avatar link
    if (/^\/agent\?/gi.test(src)) {
      return 'https://cnodejs.org' + src;
    }
    // add https protocol
    if (/^\/\//gi.test(src)) {
      return 'https:' + src;
    } else {
      return src;
    }
  }
}