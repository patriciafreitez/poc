import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { RequestService } from '../../services/request.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the CertificadosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'certificacion'
})
@Component({
  selector: 'page-certificados',
  templateUrl: 'certificados.html',
})
export class CertificadosPage {

  constructor(public navCtrl: NavController, private iab: InAppBrowser,
    private request: RequestService, public navParams: NavParams, private platform: Platform) {

  }

  public openPdf() {
    this.request.get({
      url: ""
    },
      (response) => {
        if(response.status == 200){
          let option: any = { location:'no' };
          if(this.platform.is('android')){
            option = {
              zoom: "no"
            }
          }
          let url = 'https://docs.google.com/viewer?url=' + encodeURIComponent(response.uri);
          this.iab.create(url, '_blank', option);
        }
      }, {});
  }

}
