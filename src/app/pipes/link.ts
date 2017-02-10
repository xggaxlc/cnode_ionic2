import {
  Pipe,
  PipeTransform
} from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'link'
})
export class LinkPipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer
  ) {}
  transform(content: string): SafeHtml {
    if (!content) return '';
    let userLinkRegex = /href="\/user\/([\S]+)"/gi;
    let noProtocolSrcRegex = /src="\/\/([\S]+)"/gi;
    let externalLinkRegex = /href="((?!#\/user\/)[\S]+)"/gi;
    
    return this.sanitizer.bypassSecurityTrustHtml(
      content
      .replace(userLinkRegex, 'data-username="$1" class="markdown-inner-user-link"')
      .replace(noProtocolSrcRegex, 'src="https://$1"')
      .replace(externalLinkRegex, 'data-link="$1" class="markdown-inner-link"')
    );
    
  }
}