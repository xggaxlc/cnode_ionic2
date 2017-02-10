import { Auth } from './auth';
import { Utils } from './utils';
import { Injectable } from '@angular/core';
import Q from 'q';
import Superagent from 'superagent';

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

@Injectable()
export class Request {
  baseUrl: string = 'https://cnodejs.org/api/v1';
  header: {} = {
    'Content-Type': 'application/json; charset=utf-8'
  }
  private timeout: number = 10000;
  constructor(
    private Utils: Utils,
    private Auth: Auth
  ) {}

  private getAndDelete(method: RequestMethod, api: string, params: any, header: {}, cb?: Function): Q.Promise < any > {
    return Q.Promise((resolve, reject) => {
      let req = Superagent[method](`${this.baseUrl}/${api}`)
        .set(Object.assign(this.header, header))
        .query(params)
        .timeout(this.timeout)
        .end((err, res) => {
          if (err) {
            return reject({
              error: err,
              response: res ? res.body : {}
            });
          }
          resolve(res.body);
        });
      cb && cb(req);
    });
  }

  private postAndPut(method: RequestMethod, api: string, body: {}, header: {}, cb?: Function): Q.Promise<any> {
    return Q.Promise((resolve, reject) => {
      let req = Superagent[method](`${this.baseUrl}/${api}`)
        .set(Object.assign(this.header, header))
        .send(body)
        .timeout(this.timeout)
        .end((err, res) => {
          if (err) {
            return reject({
              error: err,
              response: res ? res.body : {}
            });
          }
          resolve(res.body);
        });
      cb && cb(req);
    });
  }

  handleResponse(res): Q.Promise<any> {
    if (res.success) {
      return res.data;
    } else {
      Q.reject({
        error: { status: -200 },
        responese: res
      });
    }
  }

  handleError(err): Q.Promise<any> {
    let error = err.error;
    let response = err.response;
  
    if (error.timeout) {
      //请求超时
      this.Utils.toast({
        message: '网络不给力，请求超时'
      });
    }
  
    if (err.status) {
      switch(error.status) {
        //自定义错误
        case -200:
          this.Utils.alert({
            title: '通知',
            message: response.error_msg,
            buttons: ['知道了']
          });
          break;
        case -1:
          this.Utils.alert({
            title: '通知',
            message: '请检查你的网络然后重试',
            buttons: ['好的']
          });
          break;
        case 400:
          this.Utils.alert({
            title: '400',
            message: response.error_msg,
            buttons: ['知道了']
          });
          break;
        case 401:
          this.Utils.toast({
            message: response.error_msg || '请登录'
          });
          this.Auth.requireLogin();
          break;
        case 403: 
          this.Utils.alert({
            title: '403',
            message: response.error_msg || '你没有权限获取这条数据或者执行这个操作',
            buttons: ['知道了']
          });
          break;
        case 404:
          this.Utils.alert({
            title: '404',
            message: response.error_msg || '没有这条数据',
            buttons: ['知道了']
          });
          break;
        default:
          this.Utils.alert({
            title: error.stauts,
            message: response.error_msg || error,
            buttons: ['知道了']
          });
      }
    }
    return Q.reject(err);
  }

  get(api, params = {}, header = {}, cb?: Function) {
    return this.getAndDelete('get', api, params, header, cb)
      .then(res => this.handleResponse(res))
      .catch(err => this.handleError(err));
  }

  delete(api, params = {}, header = {}, cb?: Function) {
    return this.getAndDelete('delete', api, params, header, cb)
      .then(res => this.handleResponse(res))
      .catch(err => this.handleError(err));
  }

  post(api, body = {}, header = {}, cb?: Function) {
    return this.postAndPut('post', api, body, header)
      .then(res => this.handleResponse(res))
      .catch(err => this.handleError(err));
  }

  put(api, body = {}, header = {}, cb?: Function) {
    return this.postAndPut('put', api, body, header)
      .then(res => this.handleResponse(res))
      .catch(err => this.handleError(err));
  }

}
