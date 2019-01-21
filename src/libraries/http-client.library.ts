import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { App, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http/src/static_response';
import { MessageLibrary } from './message.library';

@Injectable()
export class HttpClientLibrary {
  private url: string;
  private context: any = this;
  private success: any;
  private error: any;
  private finally: any;
  private options: any;
  private headers: any;
  private search: any;
  private app: App;
  private timeout:number = 1000000;
  public METHOD:any = {
    GET:    "GET",
    POST:   "POST",
    PUT:    "PUT",
    DELETE: "DELETE"
  };

  constructor(private http: HttpClient, private storage: Storage, private platform:Platform,
    public messages: MessageLibrary) {

  }

  public setParams(params: any): void {
    console.log("setParams")
    this.headers = new HttpHeaders();
    this.search = new HttpParams();

    this.success = params.success;
    this.url = params.url;
    this.error = function() { };
    this.finally = function() { };
    if(params.error !== undefined && typeof params.error == 'function')
      this.error = params.error;
    if(params.app !== undefined)
      this.app = params.app;
    if(params.finally !== undefined && typeof params.finally == 'function')
      this.finally = params.finally;
    if(params.context !== undefined)
      this.context = params.context;
    if(params.bearToken !== undefined && params.bearToken !== null && params.bearToken !== '')
      this.headers = this.headers.set('Authorization', ' Bearer ' + params.bearToken);
    if(params.secretkey !== undefined && params.secretkey !== null && params.secretkey !== '')
      this.headers = this.headers.set('secret-key', params.secretkey); // For test with JSON's Dummies
    if (params.application_json !== undefined && params.application_json !== null && (params.application_json === false || params.application_json === true)) {
      this.headers = this.headers.set('Content-Type', 'application/json');
    }
    this.headers = this.headers.set("Access-Control-Allow-Credentials", "true")
                               .set('Access-Control-Allow-Origin' , '*')
                               .set("Access-Control-Allow-Headers", "content-type, authorization");
    this.options = { headers: this.headers, observe: 'response' };

   if(params.urlSearchParams !== undefined && typeof params.urlSearchParams == 'object') {
     params.urlSearchParams.forEach(
       (search, index) => {
         for(let key in search) {
           this.search = this.search.set(key, search[key]);
         }
     });
     this.options.params = this.search;
   }
  }

  public _initRequest(params:any, method:string):any {
    params = this.paramsConfig(params);
    if(typeof params == 'object'
        && params.url !== undefined && typeof params.url === 'string' && params.url !== ''
        && params.success !== undefined && typeof params.success === 'function') {
      if(method === this.METHOD.POST
          || method === this.METHOD.PUT) {
        if(params.body !== undefined && typeof params.body === 'object') {
          params.application_json = true;
          this._onRequest(params, method);
        }
      }
      else {
        this._onRequest(params, method);
      }
    }
  }

  private _onRequest(params:any, method:string):any {
    this.setParams(params);
    this._request( this._method(method, params.body) );
  }

  private paramsConfig(params):any {
    if (params.params !== undefined && typeof params.params === 'object') {
      for (let key in params.params)
        params[key] = params.params[key]
      delete params.params;
    }
    return params;
  }

  private _method(method:string, body:any = null) {
    if(method === this.METHOD.GET) {
      return this.http.get(this.url, this.options);
    }
    else if(method === this.METHOD.DELETE) {
      return this.http.delete(this.url, this.options);
    }
    else {
      body = JSON.stringify(body);
      if(method === this.METHOD.POST) {
        return this.http.post(this.url, body, this.options);
      }
      else if(method === this.METHOD.PUT) {
        return this.http.put(this.url, body, this.options);
      }
    }
  }

  private _request(requestPrepared: Observable<Object>):void {
    console.log("_request", this.url, this.options)
    requestPrepared

     // .timeout(this.timeout)
      .subscribe(
        this.successCallBack.bind({
          success: this.success.bind(this.context)
        }),
        this.errorCallBack.bind({
          error: this.error.bind(this.context),
          app: this.app,
          storage: this.storage,
          messages: this.messages
        }),
        this.finallyCallBack.bind({
          finally: this.finally
        })
      );
  }

  public response(response):any {
    let res:any = {};
    const body = this._canMapBody(response);
    if(body.bool) {
      res = body.json;
    }
    res.status = response.status;
    return res;
  }

  private _canMapBody(response) {
    if(response.body !== undefined || response.error !== undefined) {
      if(response.body !== undefined) {
        return { bool: true, json: response.body };
      }
      else if(response.error !== undefined) {
        return { bool: true, json: response.error };
      }
    }
    else {
      return { bool: false, json: null };
    }
  }

  private successCallBack(response:any): void {
    this.success(response);
  }

  private errorCallBack(error:any): void {
    this.error(error);
  }

  private finallyCallBack(): void {
    this.finally();
  }
}
