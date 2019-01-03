import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapContainerComponent } from '../../components/map-container/map-container';
import { RequestService } from '../../services/request.service';

/**
 * Generated class for the MapaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'mapa'
})
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {
  @ViewChild('map_container') map: MapContainerComponent;

  private mapOption:any={
    search: false,
    button_locate: false,
    display_company_locate: false,
    display_my_location: false,
    selected_one_location: false
  }

  constructor(public navCtrl: NavController, private request: RequestService, public navParams: NavParams) {
  }

  public mapReady() {
    this.request.get({
      url: this.request.ROUTE.UBICANOS  
    }, (response:any) => {
        if(response.status == 200 ) {
          let ubicaciones:any=[];
          response.map.forEach(ubicacion => {
            ubicaciones.push({
              title: ubicacion.title,
              latLng: { lat: ubicacion.lat, lng:ubicacion.lng },
              infoOpen:false
            });
          });
          this.map.setMarkers(ubicaciones);
        }
      },
      {}
    )
  }

}
