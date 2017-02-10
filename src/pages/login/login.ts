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
  constructor(
    private auth: Auth,
    private utils: Utils,
    private request: Request,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) {}
  
  scan() {
    this.utils.scan()
      .then(token => this.login(token));
  }

  login(token) {
    let loader = this.loadingCtrl.create({
      content: '登录中...'
    });
    loader.present();
    this.request.post('accesstoken', { accesstoken: token })
      .then(data => {
        let userInfo = Object.assign(data, { token: token });
        this.auth.saveUserInfo(userInfo);
      })
      .finally(() => loader.dismiss());
  }
}