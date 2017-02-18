import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController, ToastOptions, AlertOptions } from 'ionic-angular';
import { Toast, BarcodeScanner } from 'ionic-native';
import Q from 'q';
import { NativePageTransitions, NativeTransitionOptions } from 'ionic-native';

type TransitionAction = 'slide' | 'flip' | 'fade' | 'drawer' | 'curl';

@Injectable()
export class Utils {
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  transition (opts: NativeTransitionOptions = {}, action: TransitionAction = 'slide'): Q.Promise<any> {
    let defferd = Q.defer();
    let options = {
      direction         : 'left', // 'left|right|up|down', default 'left' (which is like 'next')
      duration          :    300, // in milliseconds (ms), default 400
      slowdownfactor    :      4, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
      slidePixels       :     -1, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
      iosdelay          :    70, // ms to wait for the iOS webview to update before animation kicks in, default 60
      androiddelay      :    80, // same as above but for Android, default 70
      winphonedelay     :    250, // same as above but for Windows Phone, default 200,
      fixedPixelsTop    :      0, // the number of pixels of your fixed header, default 0 (iOS and Android)
      fixedPixelsBottom :      0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    }
    Object.assign(options, opts);
    NativePageTransitions[action](options)
      .then(msg => defferd.resolve(msg))
      .catch(err => defferd.reject(err));
    return defferd.promise;
  }

  scan(): Q.Promise<any> {
    let defferd = Q.defer();
    BarcodeScanner.scan()
      .then((barcodeData) => {
        if (barcodeData && barcodeData.text) {
          defferd.resolve(barcodeData.text);
        }
      }, err => {
        this.alert({
          title: '错误',
          message: '扫码出现错误',
          buttons: ['关闭']
        });
        defferd.reject(new Error('扫码出现错误'));
      });
    return defferd.promise;
  }

  toast(opts: ToastOptions): void {
    opts.duration = opts.duration || 3000;
    opts.position = opts.position || 'center';
    try{
      Toast.showWithOptions(opts).subscribe(toast => {
        console.log('toast', toast)
      });
    } catch(e) {
      let toast = this.toastCtrl.create(opts);
      toast.present();
    }
  }

  alert(opts: AlertOptions): void {
    let alert = this.alertCtrl.create(opts);
    alert.present();
  }

  showLoading(content: string): any {
    let loader = this.loadingCtrl.create({
      content: content
    });
    loader.present();
    return loader;
  }

  showToast(opts): void {
    let options = {
      message: '通知',
      duration: 3000,
      position: 'center'
    }
    Object.assign(options, opts);
    try{
      Toast.showWithOptions(options).subscribe(toast => {
        console.log('toast', toast)
      });
    } catch(e) {
      let toast = this.toastCtrl.create(options);
      toast.present();
    }
  }

  showAlert(opts): void {
    let options = {
      title: '错误',
      subTitle: '有错误',
      buttons: ['知道了']
    }
    Object.assign(options, opts);
    let alert = this.alertCtrl.create(options);
    alert.present();
  }

}
