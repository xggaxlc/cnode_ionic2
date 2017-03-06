import { NavParams, Events, NavController, LoadingController } from 'ionic-angular';
import { Request } from './../../app/services/request';
import { Utils } from './../../app/services/utils';
import { ComponentEditor } from './editor/editor';
import { Component, ViewChild, OnInit } from '@angular/core';
@Component({
  selector: 'page-reply',
  templateUrl: 'reply.html'
})
export class ReplyPage implements OnInit {

  @ViewChild(ComponentEditor) private editor;

  topicId: string = this.navParams.get('id');
  initValue: string;
  replyObj: any;

  constructor(
    private navCtrl: NavController,
    private utils: Utils,
    private request: Request,
    private navParams: NavParams,
    private events: Events,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.replyObj = this.navParams.get('reply');
    if (this.replyObj) {
      this.initValue = `@${this.replyObj.author.loginname}`;
    }
  }

  ionViewDidLoad() {
    this.utils.transition({ direction: 'up' });
  }

  ionViewWillLeave() {
    this.utils.transition({ direction: 'down' });
  }

  reply() {
    let content = this.editor.getValue();
    if (!content) return this.utils.alert({ message: '回复内容必填' });
    let loader = this.loadingCtrl.create({ content: '回复中...' });
    loader.present();
    let body: any = { content: content };
    // 添加小尾巴
    body.content += '\n 来自 [CNodeJS ionic2](https://github.com/xggaxlc/cnode_ionic2)';
    if (this.replyObj) {
      body.reply_id = this.replyObj.author.id
    }
    this.request.post(`topic/${this.topicId}/replies`, body)
      .then(() => {
        this.events.publish('reply:created');
        this.navCtrl.pop({ animate: false });
      })
      .finally(() => loader.dismiss());
  }

}