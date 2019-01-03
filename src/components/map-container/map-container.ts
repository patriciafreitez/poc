import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MapComponent } from "../map/map";

/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map-container',
  templateUrl: 'map-container.html'
})
export class MapContainerComponent  {
  @ViewChild('map') map: MapComponent;
  @Input ('options') options: any;
  @Output() ready: EventEmitter<any> = new EventEmitter();
  @Output() map_click: EventEmitter<any> = new EventEmitter();
  @Output() camera_move_end: EventEmitter<any> = new EventEmitter();
  @Output() display_route: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

  ngOnInit() {
    console.log('MapContainerComponent ngOnInit', this.options);
  }

  public mapReady():void {
    console.log('mapReady');
    this.ready.emit();
  }

  public mapClick(coordenates):void {
    console.log('mapCLick', coordenates);
    this.map_click.emit(coordenates);
  }

  public CameraMoveEnd(bounds):void {
    console.log('CameraMoveEnd', bounds);
    this.camera_move_end.emit(bounds);
  }

  public displayRoute(directionRoute):void {
    console.log('displayRoute', directionRoute);
    this.display_route.emit(directionRoute);
  }

  public getBounds():any {
    return this.map.getBounds();
  }

  public setMarker(lat, lng):void {
    this.map.mapClickEvent({ latLng: {lat: lat, lng: lng } });
  }

  public setMarkers(markers):void {
    this.map.setConfig('markersDefault', markers);
    this.map.setMarkers();
  }

}
