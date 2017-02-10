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

  constructor(
    private navCtrl: NavController,
    private request: Request,
    private ngZone: NgZone,
    private navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log(this.navParams.get('topic'))
    // this.fetchTopic({
    //   refresh: true,
    //   loadingMessage: '加载中...'
    // });
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
    this.request.get(`/topic/${this.topic.id}`)
      .then(res => {
        console.log(res);
        this.ngZone.run(() => this.topic = res);
      })
  }

}