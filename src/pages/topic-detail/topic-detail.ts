import { AddTopicPage } from './../topic-add/topic-add';
import { ReplyPage } from './../reply/reply';
import { UserPage } from './../user/user';
import { LoginPage } from './../login/login';
import { Auth } from './../../app/services/auth';
import { Utils } from './../../app/services/utils';
import { Component, ViewChild, NgZone, ElementRef, HostListener } from '@angular/core';
import { NavController, Content, NavParams, Events } from 'ionic-angular';
import { Request } from '../../app/services/request';

@Component({
  selector: 'page-topic-detail',
  templateUrl: 'topic-detail.html'
})
export class TopicDetailPage {
  
  @ViewChild('content') content: Content;
  @ViewChild('reply') reply: ElementRef;

  @HostListener('click', ['$event.target']) onclick(btn) {
    if (btn.nodeName.toLowerCase() === 'a') {
      if (btn.className.indexOf('markdown-inner-user-link') != -1) {
        let username = btn.getAttribute('data-username');
        username && this.navToUserPage(btn.getAttribute('data-username'));
      } else if(btn.className.indexOf('markdown-inner-link') != -1){
        let link = btn.getAttribute('data-link');
        link && window.open(link, '_system');
      }
    }
  }
  
  topic: any = this.navParams.get('topic');
  userInfo: any = this.auth.userInfo;
  spinner: boolean = false;
  transition: boolean = true;
  loading: any = {
    collect: false,
    up: false
  };

  constructor(
    private navCtrl: NavController,
    private request: Request,
    private ngZone: NgZone,
    private navParams: NavParams,
    private utils: Utils,
    private auth: Auth,
    private events: Events
  ) {}

  ionViewDidLoad() {
    this.fetchTopic();
    this.utils.transition({ direction: 'left' })
    this.events.subscribe('reply:created', () => this.fetchTopic());
    this.events.subscribe('topic:updated', () => this.fetchTopic());
  }

  ionViewWillLeave() {
    this.transition && this.utils.transition({ direction: 'right' });
  }

  scrollToTop(): Promise<any> {
    return this.content.scrollToTop();
  }

  scrollToReply(): Promise<any>  {
    let yOffSet = this.reply.nativeElement.offsetTop;
    return this.content.scrollTo(0, yOffSet, 300);
  }

  navToUserPage(loginname, e?) {
    e && e.stopPropagation();
    this.transition = false;
    this.navCtrl.push(UserPage, { user: { loginname: loginname } }, { animate: false }, () => this.transition = true);
  }

  navToUpdateTopicPage() {
    this.transition = false;
    this.navCtrl.push(AddTopicPage, { topic: this.topic }, { animate: false }, () => this.transition = true);
  }

  navToReplyPage(params?) {
    this.transition = false;
    if (!this.auth.isLogin()) {
      return this.navCtrl.push(LoginPage, {}, { animate: false }, () => this.transition = true);
    }
    this.navCtrl.push(ReplyPage, {
      reply: params,
      id: this.topic.id
    }, { animate: false }, () => this.transition = true);
  }

  replyToUser(reply, $event) {
    let target = $event.target;
    if (target.nodeName.toLowerCase() === 'a') {
      return;
    }
    let replyCopy: any = {};
    Object.assign(replyCopy, reply);
    delete replyCopy.content;
    this.navToReplyPage(replyCopy);
  }

  // 收藏
  collect() {
    if (!this.auth.isLogin()) {
      this.transition = false;
      return this.navCtrl.push(LoginPage, {}, { animate: false }, () => this.transition = true);
    }
    if (!this.loading.collect) {
      this.loading.collect = true;
      let api = this.topic.is_collect ? 'topic_collect/de_collect' : 'topic_collect/collect';
      this.request.post(api, { topic_id: this.topic.id })
        .then(res => {
          this.ngZone.run(() => {
            this.topic.is_collect = !this.topic.is_collect;
            this.utils.toast({
              message: this.topic.is_collect ? '已收藏' : '取消了收藏' 
            });
          })
        })
        .finally(() => this.loading.collect = false);
    }
  }

  //点赞
  up(reply, e) {
    e.stopPropagation();
    if (!this.auth.isLogin()) {
      this.transition = false;
      return this.navCtrl.push(LoginPage, {}, { animate: false }, () => this.transition = true);
    }
    if (!this.loading.up) {
      this.loading.up = true;
      this.request.post(`reply/${reply.id}/ups`)
        .then(res => {
          this.ngZone.run(() => {
            let action = res.action.toLowerCase();
            let message: string;
            if (action === 'up') {
              reply.ups.push(this.userInfo.id);
              message = '点赞成功';
            } else {
              reply.ups.pop();
              message = '取消了赞';
            }
            this.utils.toast({ message: message });
          });
        })
        .finally(() => this.loading.up = false);
    }
  }

  fetchTopic() {
    this.spinner = true;
    this.request.get(`/topic/${this.topic.id}`)
      .then(res => {
        this.ngZone.run(() => {
          Object.assign(this.topic, res);
          // 显示底部后重新计算content高度
          setTimeout(() => this.content.resize());
        });
      })
      .finally(() => {
        this.ngZone.run(() => this.spinner = false);
      });
  }

}