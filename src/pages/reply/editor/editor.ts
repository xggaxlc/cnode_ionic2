import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import * as SimpleMDE from 'simplemde';
@Component({
  selector: 'app-editor',
  template: `<textarea #editor></textarea>`
})
export class ComponentEditor implements OnInit {
  @ViewChild('editor') editor: ElementRef;
  @Input('value') value: string = '';
  mdEditor: any;
  constructor() {}

  ngOnInit() {
    this.mdEditor = new SimpleMDE({ 
      element: this.editor.nativeElement,
      spellChecker: false,
      autofocus: false
    });
    this.setValue(this.value);
  }

  setValue(value) {
    this.mdEditor.value(value);
  }

  getValue() {
    return this.mdEditor.value();
  }

}