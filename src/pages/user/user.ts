import { TopicDetailPage } from './../topic-detail/topic-detail';
import { Request } from './../../app/services/request';
import { Utils } from './../../app/services/utils';
import { Auth } from './../../app/services/auth';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as Q from 'q';
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  user: any = {};
  onOff: any = {
    user: false,
    collect: false
  };
  topicCollect: any;
  message: any;
  self: boolean;
  tab: string = 'reply';

  constructor(
    private navParams: NavParams,
    private auth: Auth,
    private utils: Utils,
    private request: Request,
    private navCtrl: NavController,
    private ngZone: NgZone,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    this.utils.transition({ direction: 'left' });
    let user = this.navParams.get('user');
    let currentUser = this.auth.userInfo;
    this.user = user || currentUser;
    this.self = this.user.id === currentUser.id ? true : false;
    this.init();
  }

  ionViewWillLeave() {
    this.utils.transition({ direction: 'right' });
  }

  init() {
    let loader = this.loadingCtrl.create({ content: 'loading...' });
    loader.present();
    this.getUserInfo()
    .then(() => this.onOff.user = true)
    .finally(() => {
      loader.dismiss();
    });
  }

  getUserInfo(): Q.Promise<any> {
    return this.request.get(`user/${this.user.loginname}`)
      .then(res => this.ngZone.run(() => this.user = res));
  }

  getCollect(): Q.Promise<any> {
    if (this.topicCollect) {
      return Q.when(this.topicCollect);
    }
    return this.request.get(`topic_collect/${this.user.loginname}`)
      .then(res => this.ngZone.run(() => this.topicCollect = res))
      .finally(() => this.ngZone.run(() => this.onOff.collect = true));
  }

  navToDetailPage(topic) {
    this.navCtrl.push(TopicDetailPage, {
      topic: Object.assign({}, topic, { content: '' })
    }, { animate: false });
  }

  logout() {
    let alert = this.alertCtrl.create({
      title: '退出登陆',
      message: '你确定退出登录?',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确定',
          handler: () => {
            this.auth.clearUserInfo()
              .then(() => {
                this.navCtrl.canGoBack() && this.navCtrl.pop({ animate: false });
              });
          }
        }
      ]
    });
    alert.present();
  }
}