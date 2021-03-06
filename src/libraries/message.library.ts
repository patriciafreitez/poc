import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class MessageLibrary {
   // validamos que el elemento sea creado a tiempo, para que la respuesta no sea mas rapida que
   // la creacion, entonces al momento de cerrarse exista, sino error
  loading: any;
  isLoading: boolean = false;

  constructor(public loadingCtrl: LoadingController) {}

  public showMessage(params: any= {}): void {
    let config = {
      content:''
    };

    if (params.spinner === undefined || params.spinner === null || params.spinner === true)
      config['spinner'] = 'crescent';
    else
      config['spinner'] = 'hide';

    if (params.content !== undefined)
      config['content'] = params.content;

    if (params.duration !== undefined)
      config['duration'] = params.duration;

    this.closeMessage();
    this.loading = this.loadingCtrl.create(config);

    if (params.onDisMiss !== undefined && typeof params.onDisMiss == 'function')
      this.loading.onDidDismiss = params.onDismiss;

    this.loading.present();
    this.isLoading = true;
  }

  public closeMessage(): void {
    if (this.isLoading) {
      this.loading.dismiss();
      this.isLoading = false;
    }
  }


}
