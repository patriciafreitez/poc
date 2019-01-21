import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { HttpClientLibrary } from '../libraries/http-client.library';
import { ROUTES } from '../config/routes.data';
import { MessageLibrary } from '../libraries/message.library';

@Injectable()
export class RequestService {
  // borrar esta linea cuando no hallan mas JSON dummies
  private ROUTE_DUMMIES:string = "http://api.jsonbin.io/";
  private ROUTE_ROOT:string = "http://169.62.213.147/";
  public ROUTE = ROUTES;
  public SERVER_DOWN:number = 0;
  public OK:number = 200;
  public CREATED:number = 201;
  public BAD_REQUEST:number = 400;
  public NOT_FOUNT:number = 404;
  public INTERNAL_SERVER_ERROR:number = 500;

  constructor(private httpService:HttpClientLibrary, private app:App,
              public storage:Storage, private messages:MessageLibrary) {
  }

  public get(params:any, callback:any = null, message:any = null):any {
    this._initMethod(params, this.httpService.METHOD.GET, callback, message);
  }

  public post(params:any, callback:any = null, message:any = null):any {
    this._initMethod(params, this.httpService.METHOD.POST, callback, message);
  }

  public put(params:any, callback:any = null, message:any = null):any {
    this._initMethod(params, this.httpService.METHOD.PUT, callback, message);
  }

  public delete(params:any, callback:any = null, message:any = null):any {
    this._initMethod(params, this.httpService.METHOD.DELETE, callback, message);
  }

  private _initMethod(params:any, method:string, callback:any = null, message:any = null):void {
    if (message !== null)
    this.messages.showMessage(message);

    this._setParams(params).then((parameters) => {
      this.httpService._initRequest(
        this._httpParams(params, callback, message),
        method
      );
    });
  }

  private _httpParams(params:any, callback:any = null, message:any = null):any {
    return  {
      params,
      success:(result) => {
        if (callback !== undefined || callback !== null)
          callback( this.handleSuccess(this.httpService.response(result)) );
      },
      error:(error)=> {
        if(callback !== undefined || callback !== null) {
          var response:any = this.handleError( this.httpService.response(error) );
          if(error.status < this.INTERNAL_SERVER_ERROR && error.status !== this.SERVER_DOWN) {
            // Mensaje desde el Servidor
            if((response.status === this.NOT_FOUNT) ||
               (response.status === this.BAD_REQUEST && !response.have_fields)) {
            }

            callback(response);
          }

        }
        this.closeMessage(message);
      },
      finally:()=> {
        this.closeMessage(message);
      }
    }
  }

  private closeMessage(message):void {
    if (message !== null)
      this.messages.closeMessage();
  }

  private _setParams(params:any):Promise<any> {
    return new Promise((resolve, reject) => {
      this._getRoute(params).then((data) => {

            resolve(data);

      });
    });
  }

  private _getRoute(params:any):Promise<any> {
    return new Promise((resolve, reject) => {
      console.log("getRoute", params);
      if(params.url === "") {
        params.url = this.ROUTE_ROOT + params.url;
      } else {
        params.url = this.ROUTE_DUMMIES + params.url;
        params.secretkey =  '$2a$10$BNeywoWSDpgoR7qSxz.FhuEcYNxuQEx..C5/Y7fHP4CKO/DtCQzqS';
      }
      resolve(params);
    });
  }

  private handleSuccess(success):any {
    var response:any = {};
    response = success;
    response.status = success.status;

    if(response.access_token !== undefined) {
      this.storage.set('access_token', response.access_token);
      delete response.access_token;
    }
    return response;
  }

  private handleError(error):any {
    var response:any = {};
    if(error.status < this.INTERNAL_SERVER_ERROR && error.status !== this.SERVER_DOWN) {
      response = error;
      response.have_fields = response.fields !== undefined;
    }
    response.status = error.status;
    return response;
  }



  public validUndefined(value:any):any {
    return value === undefined ? '' : value;
  }

  public validArrayUndefined(value:any):any {
    return value === undefined ? [] : value;
  }

}
