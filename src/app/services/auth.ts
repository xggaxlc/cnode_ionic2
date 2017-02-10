import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Storage } from '@ionic/storage';

@Injectable()
export class Auth {
  userInfo: any;
  requireLoginSource = new Subject<void>();

  constructor(
    private storage: Storage
  ) {
    this.getUserInfo();
  }

  getUserInfo(): Promise<any> {
    return this.storage.get('userInfo')
      .then(userInfo => {
        this.userInfo = userInfo || {};
      });
  }
  
  isLogin(): boolean {
    if (!this.userInfo.accessToken || !this.userInfo.loginname || !this.userInfo.id) {
      return false;
    }
    return true;
  }

  requireLogin(): void {
    this.clearUserInfo();
    this.requireLoginSource.next();
  }
  
  saveUserInfo(userInfo): Promise<any> {
    Object.assign(this.userInfo, userInfo);
    return this.storage.set('userInfo', this.userInfo);
  }

  clearUserInfo(): Promise<any> {
    this.userInfo = {};
    return this.storage.remove('userInfo');
  }

}