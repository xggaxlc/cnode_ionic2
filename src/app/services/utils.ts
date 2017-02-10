import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController, ToastOptions, AlertOptions } from 'ionic-angular';
import { Toast, BarcodeScanner } from 'ionic-native';
import Q from 'q';
@Injectable()
export class Utils {
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

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

  finally(promise: Promise<any>, cb: Function) {
    return promise.then(
      value  => Promise.resolve(cb()).then(() => value),
      reason => Promise.resolve(cb()).then(() => { throw reason })
    );
  }

}
