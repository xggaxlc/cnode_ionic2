import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-topic-item',
  templateUrl: 'item.html'
})
export class TopicItem {
  @Input() mini: boolean = false;
  @Input() topic: any;
  @Output() onClick = new EventEmitter<any>();
  constructor() {}

  emit() {
    this.onClick.emit(this.topic);
  }
}