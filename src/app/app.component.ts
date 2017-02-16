import { Utils } from './services/utils';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, IonicApp, Config, Keyboard } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  template: `<ion-nav #rootNav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  @ViewChild('rootNav') nav: Nav;

  rootPage = TabsPage;
  backButtonPressedOnceToExit: boolean = false;

  constructor(
    platform: Platform,
    config: Config,
    private utils: Utils,
    private IonicApp: IonicApp,
    private Keyboard: Keyboard
  ) {
    platform.ready().then(() => {
      // 关闭splash
      Splashscreen.hide();
      StatusBar.show();
      // 监听安卓物理返回按键
      let ready = true;
      platform.registerBackButtonAction(() => {
        if (!ready) return;
        // loading不准关闭
        if (this.IonicApp._loadingPortal.getActive()) return;
        let activePortal = 
          // this.IonicApp._loadingPortal.getActive() ||
          this.IonicApp._modalPortal.getActive() ||
          this.IonicApp._toastPortal.getActive() ||
          this.IonicApp._overlayPortal.getActive();
        if (activePortal) {
          ready = false;
          activePortal.dismiss();
          return activePortal.onDidDismiss(() => { ready = true; });
        }
        // 关菜单
        // if (this.MenuController.isOpen()) {
        //   this.MenuController.close();
        //   return;
        // }
        //关键盘
        if (this.Keyboard.isOpen()) {
          return this.Keyboard.close();
        }
        let view = this.nav.getActive();
        let page = view ? view.instance : null;
        if (page && page.isRootPage) {
          this.backButtonPressedOnceToExit ? platform.exitApp() : this.pressTwiceToExit();
        } else if (this.nav.canGoBack() || view && view.isOverlay) {
          ready = false;
          this.nav.pop().then(() => { ready = true; });
        } else {
          this.utils.toast({
            message: '物理返回按键导航发生了错误'
          });
        }
      }, 101);
    });
  }

  pressTwiceToExit() {
    this.backButtonPressedOnceToExit = true;
    this.utils.toast({
      message: '再按一次退出',
      position: 'bottom',
      duration: 2000
    });
    setTimeout(() => {
      this.backButtonPressedOnceToExit = false;
    }, 2000);
  }

}
