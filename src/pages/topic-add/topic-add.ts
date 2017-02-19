import { ComponentEditor } from './../reply/editor/editor';
import { Request } from './../../app/services/request';
import { Utils } from './../../app/services/utils';
import { NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { Component, ViewChild, NgZone } from '@angular/core';
@Component({
  selector: 'page-topic-add',
  templateUrl: 'topic-add.html'
})
export class AddTopicPage {
  @ViewChild(ComponentEditor) private editor;

  topic: any = this.navParams.get('topic') || {};
  title: string = this.topic.id ? '编辑主题' : '新建主题';

  constructor(
    private navCtrl: NavController,
    private utils: Utils,
    private request: Request,
    private navParams: NavParams,
    private events: Events,
    private loadingCtrl: LoadingController,
    private ngZone: NgZone
  ) {} 

  ionViewDidLoad() {
    this.utils.transition({ direction: 'up' });
    if (this.topic.id) {
      this.getTopicOrigin();
    }
  }

  ionViewWillLeave() {
    this.utils.transition({ direction: 'down' });
  }

  save() {
    let content = this.editor.getValue();
    let title = this.topic.title;
    let tab = this.topic.tab;
    let alert = {
      message: '',
      title: '错误',
      buttons: ['关闭']
    }
    if (!title) return this.utils.alert(Object.assign(alert, { message: '标题必填' }));
    if (!content) return this.utils.alert(Object.assign(alert, { message: '内容必填' }));
    if (!tab) return this.utils.alert(Object.assign(alert, { message: '分类必填' }));
    let body: any = {
      title: title,
      tab: tab,
      content: content
    }
    let promise;
    let loader = this.loadingCtrl.create({ content: '保存中...' });
    loader.present();
    if (this.topic.id) {
      // 更新
      body.topic_id = this.topic.id;
      promise = this.request.post('topics/update', body)
        .then(() => {
          this.events.publish('topic:updated');
          this.navCtrl.pop({ animate: false });
        });
    } else {
      // 添加
      promise = this.request.post('topics', body)
        .then(() => {
          this.events.publish('topic:created');
          this.navCtrl.pop({ animate: false });
        });
    }
    promise.finally(() => loader.dismiss()); 
  }

  getTopicOrigin() {
    let loader = this.loadingCtrl.create({ content: 'loading...' });
    loader.present();
    this.request.get(`topic/${this.topic.id}`, { mdrender: false })
      .then(res => {
        this.ngZone.run(() => this.topic = res);
        this.editor.setValue(this.topic.content);
      })
      .finally(() => loader.dismiss());  
  }

}