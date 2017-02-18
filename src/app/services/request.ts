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
    private utils: Utils,
    private auth: Auth
  ) {}

  private getAndDelete(method: RequestMethod, api: string, params: any, header: {}, cb?: Function): Q.Promise < any > {
    return Q.Promise((resolve, reject) => {
      let req = Superagent[method](`${this.baseUrl}/${api}`)
        .set(Object.assign(this.header, header))
        .query(Object.assign(params, { accesstoken: this.auth.userInfo.token }))
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
        .send(Object.assign(body, { accesstoken: this.auth.userInfo.token }))
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
      return res.data || res;
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
      this.utils.toast({
        message: '网络不给力，请求超时'
      });
    }
  
    if (error.status) {
      let alert = {
        message: response.error_msg,
        title: '错误',
        buttons: ['关闭']
      }
      switch(error.status) {
        case -1:
          alert.message = '请检查你的网络然后重试';
          break;
        case 401:
          alert.message = response.error_msg || '请登录';
          this.auth.requireLogin();
          break;
        case 403: 
          alert.message = response.error_msg || '你没有权限获取这条数据或者执行这个操作';
          break;
        case 404:
          alert.message = response.error_msg || '没有这条数据';
          break;
      }
      this.utils.alert(alert);
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
