import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { NavController, Content, NavParams } from 'ionic-angular';
import { Request } from '../../app/services/request';
@Component({
  selector: 'page-topic-detail',
  templateUrl: 'topic-detail.html'
})
export class TopicDetailPage {
  
  @ViewChild('content') content: Content;
  @ViewChild('reply') reply: ElementRef;
  
  topic: any = this.navParams.get('topic');
  spinner: boolean = false;

  constructor(
    private navCtrl: NavController,
    private request: Request,
    private ngZone: NgZone,
    private navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log(this.topic)
    this.fetchTopic();
  }

  scrollToTop(): Promise<any> {
    return this.content.scrollToTop();
  }

  scrollToReply(): Promise<any>  {
    let yOffSet = this.reply.nativeElement.offsetTop;
    return this.content.scrollTo(0, yOffSet, 300);
  }

  fetchTopic() {
    this.spinner = true;
    this.request.get(`/topic/${this.topic.id}`)
      .then(res => {
        this.ngZone.run(() => Object.assign(this.topic, res));
      })
      .finally(() => {
        this.ngZone.run(() => this.spinner = false);
      });
  }

}