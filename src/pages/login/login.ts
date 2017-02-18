import { Component } from '@angular/core';
import { Auth } from '../../app/services/auth';
import { Utils } from '../../app/services/utils';
import { Request } from '../../app/services/request';
import { LoadingController, NavController } from 'ionic-angular';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  token: string;

  constructor(
    private auth: Auth,
    private utils: Utils,
    private request: Request,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) {}

  ionViewDidLoad() {
    this.utils.transition({ direction: 'left' });
  }

  ionViewWillLeave() {
    this.utils.transition({ direction: 'right' });
  }
  
  scan() {
    this.utils.scan()
      .then(token => this.login(token));
  }

  login(token) {
    if (!token) return;
    let loader = this.loadingCtrl.create({
      content: '登录中...'
    });
    loader.present();
    this.request.post('accesstoken', { accesstoken: token })
      .then(data => {
        Object.assign(data, { token: token })
        delete data.success;
        return this.auth.saveUserInfo(data);
      })
      .then(() => {
        this.utils.toast({
          message: '登陆成功'
        });
        this.navCtrl.canGoBack() && this.navCtrl.pop({ animate: false });
      })
      .catch(err => console.log(err))
      .finally(() => loader.dismiss());
  }
}