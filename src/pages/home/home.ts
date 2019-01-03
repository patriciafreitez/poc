import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RequestService } from '../../services/request.service';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private toastCtrl: ToastController, public navCtrl: NavController, 
    private iab: InAppBrowser, private platform: Platform, private request: RequestService) {
  }

  public openCertification(){
    this.navCtrl.push("certificacion");
  }

  public openFacebook() {
    let option: any = {};
    if(this.platform.is('android')) {
      option = {
        zoom: "no"
      }
    }
    this.iab.create('https://www.facebook.com/InversionSURACL', "_blank", option );
  }
  public openMap(){
    this.navCtrl.push("mapa");
  }
  
  public openHelloWord() {
    this.request.get({
      url: this.request.ROUTE.HELLO_WORD
    },
      (response) => {
        if(response.status == 200 ){
          console.log(response);
          let toast = this.toastCtrl.create({
            message: response.message,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      }, 
      {}
    )
  }
  
}

