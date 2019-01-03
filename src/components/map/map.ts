import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Platform, Searchbar } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CONFIG } from "../../config/config.data";

declare var google: any;

/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
// https://es.slideshare.net/MasashiKatsumata/ionic-nativegooglemaps-81563234
// https://developers.google.com/maps/documentation/javascript/reference/3/#InfoWindow
export class MapComponent {
  @ViewChild('map_div') map_div: any;
  @ViewChild('div_search_map') div_search_map: any;
  @Output() ready: EventEmitter<any> = new EventEmitter();
  @Output() map_click: EventEmitter<any> = new EventEmitter();
  @Output() camera_move_end: EventEmitter<any> = new EventEmitter();
  @Output() display_route: EventEmitter<any> = new EventEmitter();

  @Input() config:any={                                                 // DESCRIPCON                      // DEFAULT
    /** Datos no recomendables modificar entre view, se pueden modificar manualmente segun lo que se necesite **************/
    map:null,
    current_location:null,
    current_location_marker:null,
    current_location_marker_icon: CONFIG.MAP.CURRENT_ICON,
    search_hidden: CONFIG.MAP.SEARCH_HIDDEN,
    marker_option: {
      width:0,
      maxWidthMarkerInfo: 0
    },
    optionsCamera: {
      center: {                                                         // Posicion inicial del mapa
        lat:0,
        lng:0
      },
      minZoom: CONFIG.MAP.OPTION_CAMERA.MIN_ZOOM,                       // Zoom minimo del mapa                 13
      maxZoom: CONFIG.MAP.OPTION_CAMERA.MAX_ZOOM,                       // Zoom maximo del mapa                 18
      zoom: CONFIG.MAP.OPTION_CAMERA.ZOOM,                              // Zoom por defecto                     15
      streetViewControl: CONFIG.MAP.OPTION_CAMERA.STREET_VIEW_CONTROL,  // Modo streetView                      false
      zoomControl: CONFIG.MAP.OPTION_CAMERA.ZOOM_CONTROL,               // Control de zoom                      false
      mapTypeControl: CONFIG.MAP.OPTION_CAMERA.MAP_TYPE_CONTROL,        // Control cambio de tipo de mapa       false
      fullscreenControl: CONFIG.MAP.OPTION_CAMERA.FULL_SCREEN_CONTROL,  // Control pantalla completa            false
      clickableIcons: CONFIG.MAP.OPTION_CAMERA.CLICK_ICONS              // Iconos predefinidos clickeable       false
    },
    dicTranslate: {
      route: CONFIG.MAP.DIC_TRANSLATE.ROUTE,
      me: CONFIG.MAP.DIC_TRANSLATE.ME
    },
    /** Datos recomendables que se pueden modificar por las paginas que usen este componente ****************************************/
    width: null,                                                        // Map width                             fullscreen
    height: null,                                                       // Map height                            fullscreen
    search: CONFIG.MAP.SEARCH,                                          // SearchBar display                     false
    searchBar: CONFIG.MAP.SEARCH_BAR,                                   // SearchBar texto a buscar              ""
    searchBarPlaceholder: CONFIG.MAP.SEARCH_BAR_PLACEHOLDER,            // SearchBar placeholder                 ""
    button_locate: CONFIG.MAP.BUTTON_LOCATE,                            // Location_button display               false
    display_my_location: CONFIG.MAP.DISPLAY_MY_LOCATION,                // Location_user display my location     true
    info_windo: CONFIG.MAP.INFO_WINDO,                                  // InfoWindow display                    true
    display_weather:CONFIG.MAP.DISPLAY_WEATHER,                         // Weather display in InfoWindow         false
    display_route: CONFIG.MAP.DISPLAY_ROUTE,                            // Route display in InfoWindow           false
    map_clickable: CONFIG.MAP.MAP_CLICKABLE,                            // Event click                           true
    map_camera_move_end: CONFIG.MAP.CAMERA_MOVE_END,                    // Event cameraMoveEnd                   true
    selected_one_location: CONFIG.MAP.SELECTED_ONE_LOCATION,            // Pick only one location                false
    markers: CONFIG.MAP.MARKER,                                         // Marker in map                         []
    markersDefault: CONFIG.MAP.MARKER,                                  // Marker Server Request in map          []
    display_company_locate: CONFIG.MAP.DISPLAY_COMPANY_LOCATE,          // Location company display              true
    company_locate: {
      position: {
        lat: CONFIG.MAP.COMPANY_LOCATE.LAT,                             // Lotitude company                     10.50698089
        lng: CONFIG.MAP.COMPANY_LOCATE.LNG                              // Longitude company                    -66.85400392
      },
      title: CONFIG.MAP.COMPANY_LOCATE.TITLE,                           // Nombre de la empresa                 XCouty
      icon: CONFIG.MAP.COMPANY_LOCATE.ICON,                             // Icono por de la empresa              (~love~)
      infoOpen: CONFIG.MAP.COMPANY_LOCATE.INFO_OPEN,                    // Despliegue del infoWindow al crearse true
      displayWeater: CONFIG.MAP.COMPANY_LOCATE.DISPLAY_WEATHER          // Mostrar el clima                     false
    }
  };
  @Input() options:any ={};
  private map_ready:boolean=false;
  private geocoder = new google.maps.Geocoder();
  private directionsService = new google.maps.DirectionsService();
  private directionsDisplay = new google.maps.DirectionsRenderer();

  private clickMapModeEvents:any = {
    NONE: "none",
    MOVE_CAMERA: "move_camera"
  };
  private clickMapMode:string = this.clickMapModeEvents.NONE;

  constructor(   public platform: Platform,  private storage:Storage) {

  }

  ngOnInit() {
    this._setAllConfig();
    setTimeout( this._createMap.bind(this), 1000);
  }

  private _setAllConfig():void {
    console.log(this.options);
    if(this.options.width !== undefined  && this.options.width !== null && typeof this.options.width === 'number')
      this.config.width = this.options.width;
    if(this.options.height !== undefined  && this.options.height !== null && typeof this.options.height === 'number')
      this.config.height = this.options.height;
    if(this.options.search!==undefined  && (this.options.search===false || this.options.search===true))
      this.config.search = this.options.search;
    if(this.options.searchBar!==undefined  && this.options.searchBar!==null && typeof this.options.searchBar==='string')
      this.config.searchBar = this.options.searchBar;
    if(this.options.searchBarPlaceholder !== undefined  && this.options.searchBarPlaceholder !== null && typeof this.options.searchBarPlaceholder === 'string')
      this.config.searchBarPlaceholder = this.options.searchBarPlaceholder;
    if(this.options.button_locate!==undefined  && (this.options.button_locate===false || this.options.button_locate===true))
      this.config.button_locate = this.options.button_locate;
    if(this.options.display_my_location !== undefined  && (this.options.display_my_location === false || this.options.display_my_location === true))
      this.config.display_my_location = this.options.display_my_location;
    if(this.options.info_windo!==undefined  && (this.options.info_windo===false || this.options.info_windo===true))
      this.config.info_windo = this.options.info_windo;
    if(this.options.display_weather!==undefined  && (this.options.display_weather===false || this.options.display_weather===true))
      this.config.display_weather = this.options.display_weather;
    if(this.options.display_route!==undefined  && (this.options.display_route===false || this.options.display_route===true))
      this.config.display_route = this.options.display_route;
    if(this.options.map_clickable!==undefined  && (this.options.map_clickable===false || this.options.map_clickable===true))
      this.config.map_clickable = this.options.map_clickable;
    if(this.options.map_camera_move_end!==undefined  && (this.options.map_camera_move_end===false || this.options.map_camera_move_end===true))
      this.config.map_camera_move_end = this.options.map_camera_move_end;
    if(this.options.selected_one_location!==undefined  && (this.options.selected_one_location===false || this.options.selected_one_location===true))
      this.config.selected_one_location = this.options.selected_one_location;
    if(this.options.markers !== undefined && this.options.markers instanceof Array)
      this.config.markers = this.options.markers;
    if(this.options.markersDefault !== undefined && this.options.markersDefault instanceof Array)
      this.config.markersDefault = this.options.markersDefault;
    if(this.options.display_company_locate!==undefined  && (this.options.display_company_locate===false || this.options.display_company_locate===true))
      this.config.display_company_locate = this.options.display_company_locate;
    if(this.options.company_locate!==undefined && this.options.company_locate!==null) {
      if(this.options.company_locate.position!==undefined && this.options.company_locate.position!==null) {
        if(this.options.company_locate.position.lat!==undefined  && this.options.company_locate.position.lat!==null && typeof this.options.company_locate.position.lat==='number')
          this.config.company_locate.position.lat = this.options.company_locate.position.lat;
        if(this.options.company_locate.position.lng!==undefined  && this.options.company_locate.position.lng!==null && typeof this.options.company_locate.position.lng==='number')
          this.config.company_locate.position.lng = this.options.company_locate.position.lng;
      }
      if(this.options.company_locate.title!==undefined  && this.options.company_locate.title!==null && typeof this.options.company_locate.title==='string')
        this.config.company_locate.title = this.options.company_locate.title;
      if(this.options.company_locate.icon!==undefined  && this.options.company_locate.icon!==null && typeof this.options.company_locate.icon==='string')
        this.config.company_locate.icon = this.options.company_locate.icon;
      if(this.options.company_locate.infoOpen!==undefined  && (this.options.company_locate.infoOpen===false || this.options.company_locate.infoOpen===true))
        this.config.company_locate.infoOpen = this.options.company_locate.infoOpen;
    }
  }

  public setConfig(config:string, value:any):void {
    if(config !== undefined && config !== null && config!=='' && value !== undefined && value !== null)
      this.config[config] = value;
  }

  private _createMap():void {
    if (this.config.display_my_location) {
      this._getcurrentUserLocation().then((locate) => {
        this._buildMap(locate);
      });
    } else {
      this._buildMap();
    }
  }

  private _searchAutocomplete():void {
    if(this.config.search) {
      let input:any = this.div_search_map._searchbarInput.nativeElement;//<HTMLInputElement>document.getElementsByClassName('searchbar-input')[0];

      //console.log("_searchAutocomplete", input, "", this.div_search_map._searchbarInput.nativeElement);

      var autocomplete = new google.maps.places.Autocomplete(input);
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        var place = autocomplete.getPlace(),
            pointer:any = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
        this.clickMapMode = this.clickMapModeEvents.MOVE_CAMERA;
        this.mapClickEvent({ latLng: pointer });
      });
    }
  }

  private _getcurrentUserLocation() {
    return new Promise((resolve, reject) => {
        resolve(this.config.company_locate.position);
    });
  }

  private _buildMap(location:any=null): void {
    if (location === null) {
      this.config.optionsCamera.center = this.config.company_locate.position;
    } else {
      this.config.optionsCamera.center = location;
      this.config.current_location = location;
    }

    let map_canvas = this.map_div.nativeElement,
        width  = this.platform.width(),
        height = this.platform.height();

    if(this.config.width !== null) {
      width = this.config.width;
    }
    if(this.config.height !== null) {
      height = this.config.height;
    }

    map_canvas.style.width = `${width}px`;
    map_canvas.style.height = `${height}px`;
    this.config.marker_option.width = width;
    this.config.marker_option.maxWidthMarkerInfo = width / 2;

 
      this.config.map = new google.maps.Map(map_canvas, this.config.optionsCamera);
      google.maps.event.addListenerOnce(this.config.map, 'idle', this._mapReady.bind(this));
  
  }

  private _mapReady():void {
    this.map_ready = true;
    if (this.config.search) {
      this.config.search_hidden = false;
    }
    this.ready.emit();
    // Map Events
    this._searchAutocomplete();
    this._mapCLick();
    this._mapCameraMoveEnd();
    // Print markers
    this.setMarkers();
    // Print company Location
    if (this.config.display_company_locate) {
      this._addMarker(this.config.company_locate);
    }
    // Print user Location or init marker location
    if (this.config.display_my_location) {
      this.clickMapMode = this.clickMapModeEvents.NONE;
      this.mapClickEvent({ latLng: this.config.current_location });
    }
  }

  public setMarkers():void {
    if(this.config.markersDefault.length > 0) {
      this._clearMap();
      this.config.markersDefault.forEach((marker) => {
        this._markerDefault(marker);
      })
    }
  }

  public getBounds() {
    /*
    let bounds = this.config.map.getBounds();
    console.log(bounds);
    return {
      nortEast : { lat: bounds.j.j, lng: bounds.l.l },
      nortWest : { lat: bounds.j.j, lng: bounds.l.j },
      southEast: { lat: bounds.j.l, lng: bounds.l.l },
      southWest: { lat: bounds.j.l, lng: bounds.l.j }
    };
    */
  }

  private _markerDefault(marker):void {
    console.log('_markerDefault', marker);

    let optionMarker:any = {
      position: marker.latLng,
      title: marker.title,
      infoOpen: marker.infoOpen === undefined ? true : marker.infoOpen
    };
    // Weather
    if (this.config.display_weather !== undefined) {
      optionMarker.displayWeater = this.config.display_weather;
    }
    // Pick One Location
    if(this.config.selected_one_location) {
      if(this.config.markers.length > 0) {
        google.maps.event.clearListeners(this.config.markers[0], 'dragend');
      }
      this._clearMap();
      optionMarker.center = location;
      optionMarker.draggable = true;
    //  optionMarker.displayWeater = true;
    }
     else {
      // Display my location
      if (this.config.display_my_location) {
        optionMarker.title = this.config.dicTranslate.me;
        optionMarker.icon = this.config.current_location_marker_icon;
        optionMarker.infoOpen = false;
        //optionMarker.displayWeater = false;
      }
    }
    this._addMarker(optionMarker);
  }

  private _addMarker(markerConfig:any={}) {
    var markerOption:any={};

    markerOption.position = markerConfig.position;
    markerOption.map = this.config.map;
    if (markerConfig.title!==undefined)     markerOption.title      = markerConfig.title;
    if (markerConfig.draggable!==undefined) markerOption.draggable  = markerConfig.draggable;
    if (markerConfig.label!==undefined)     markerOption.label     = markerConfig.label
    if (markerConfig.icon!==undefined)      markerOption.icon      = markerConfig.icon;
    if (markerConfig.center!==undefined)    markerOption.center    = markerConfig.center;

    if (this.config.info_windo) {
      this._buildInfoWindow(markerConfig).then((infowindow) => {
        var info = infowindow;
        if (info!==null)
          markerOption.infowindow = info;

          this._createMarker(markerConfig, markerOption, info);
      });
    } else {
      this._createMarker(markerConfig, markerOption);
    }
  }

  private _createMarker(markerConfig:any, markerOption:any, info:any=null) {
    console.log(markerConfig, markerOption, info)
    let marker = new google.maps.Marker(markerOption);
    this.config.markers.push(marker);

    if (this.config.info_windo && markerConfig.title!==undefined) {
      google.maps.event.addListener(marker, 'click', this._clickOnMarker.bind(this, marker));
      if (markerConfig.infoOpen!==undefined && info!==null) {
        if (markerConfig.infoOpen)
          info.open(this.config.map, marker);
      }
    }

    // check if current location marker
    if (this.config.current_location!==null) {
      if (markerConfig.position===this.config.current_location)
        this.config.current_location_marker = marker;
    }
    if (markerConfig.draggable) {
      google.maps.event.addListener(marker, 'dragend', this._markerDragEnd.bind(this, marker));
    }
  }

  private _markerDragEnd(marker) {
    if (this._isInfoWindowOpen(marker.infowindow)) {
      marker.infowindow.close(this.config.map, marker);
    }
    this.clickMapMode = this.clickMapModeEvents.MOVE_CAMERA;
    this.mapClickEvent({ latLng: marker.getPosition() });
  }

  private _clickOnMarker(marker):void {
    this._hideAllInfoWindows(marker.infowindow);
    if (this._isInfoWindowOpen(marker.infowindow))
      marker.infowindow.close(this.config.map, marker);
    else
      marker.infowindow.open(this.config.map, marker);
  }

  private _buildInfoWindow(markerConfig:any) {
    return new Promise((resolve, reject) => {
      var infowindow = null;
      if(markerConfig.title !== undefined) {
        let routeDisplay:boolean   = (markerConfig.displayRoute !== undefined ? markerConfig.displayRoute : false);
        let weatherDisplay:boolean = (markerConfig.displayWeater !== undefined ? markerConfig.displayWeater : false);

        this._infoContent(routeDisplay, weatherDisplay, markerConfig).then((content)=> {
          infowindow = new google.maps.InfoWindow({
            content: content,
            maxWidth: this.config.marker_option.maxWidthMarkerInfo
          });
          if (routeDisplay) {
            google.maps.event.addListener(infowindow, 'domready', () => {
              this._hideAllInfoWindows(infowindow);
              if (this.config.display_route) {
                document.querySelector('#tap > button').addEventListener('click', () => {
                  this._calculateRoute( infowindow.getPosition() ).then((data:any) => {
                    this._displayRoute(data.result);
                  });
                });
              }
            });
          }
          resolve(infowindow);
        });
      }
      else {
        resolve(infowindow);
      }
    })
  }

  private _infoContent(routeDisplay:boolean, weatherDiaplay:boolean, markerConfig:any) {
    return new Promise((resolve, reject) => {
      if (routeDisplay) {
        resolve(this._infoRoute(markerConfig, weatherDiaplay));
      }
      else {
        this._infoDefault(markerConfig, weatherDiaplay).then((weather) => {
          resolve(weather);
        });
      }
    });
  }

  private _infoRoute(markerConfig:any, weatherDiaplay:boolean) {
    return new Promise((resolve, reject) => {
      let route = this.config.dicTranslate.route;
      let title:string = `<div id="tap"><p>${markerConfig.title}</p>`;
     
        title = title + '<button ion-button>'+ route +'</button></div>';
        resolve(title);
    
    });
  }

  private _infoDefault(markerConfig:any, weatherDiaplay:boolean) {
    return new Promise((resolve, reject) => {
      let title:string = `<p>${markerConfig.title}</p>`;
 
        resolve(title);
      
    });
  }

  

  private _googleLngToHumman(latitude):any {
    console.log('_googleLngToHumman', latitude);
    if(typeof latitude.lat === 'number') {
      return latitude; // Humman
    }
    else {
      let latStr   = `${latitude}`,
          latSplit = latStr.substring(1, latStr.length - 1).split(',');
      return { lat: latSplit[0], lng: latSplit[1].trim() }; // Humman
    }
  }

  private _hideAllInfoWindows(infowindow:any = null):void {
    this.config.markers.forEach((marker) => {
      if(infowindow !== null) {
        if(marker.infowindow !== infowindow)
          marker.infowindow.close();
      }
      else { marker.infowindow.close(); }
    });
  }

  private _isInfoWindowOpen(infoWindow):boolean {
    var map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
  }

  private _calculateRoute(destination) {
    return new Promise((resolve, reject) => {
      this.storage.get('route_travel').then((travel)=> {
        this.directionsDisplay.setMap(null);
        this.directionsDisplay.setMap(this.config.map);

        if (this.config.current_location_marker==null) {
          reject('Current Marker Not Fount');
        } else {
          var request = {
            origin: this.config.current_location_marker.getPosition(),
            destination: destination,
            travelMode: travel
          };
          this.directionsService.route(request, function(result, status) {
            resolve({result:result, Ok:status==google.maps.DirectionsStatus.OK});
          });
        }
      });
    });
  }

  // https://developers.google.com/maps/documentation/javascript/examples/directions-panel
  // https://developers.google.com/maps/documentation/javascript/examples/directions-travel-modes
  private _displayRoute(result):void {
    this.display_route.emit( result );
    this._hideAllInfoWindows();
    this.directionsDisplay.setDirections(result);
  }

  private _removeDirectionRoute():void {
    this.directionsDisplay.setMap(null);
  }

  private _clearMap(removeCurrentLocation:boolean = true):void {
    let marker_aux = this.config.markers;
    marker_aux.forEach((marker, index) => {
      if (!removeCurrentLocation) {
        if (this.config.current_location_marke!==null) {
          if (marker!=this.config.current_location_marke) {
            marker.setMap(null);
            this.config.markers.splice(index, 1);
          }
        }
      }
       else {
        marker.setMap(null);
        this.config.markers.splice(index, 1);
      }
    });
  }

  private _mapCLick() {
    if (this.config.map_clickable) {
      this.clickMapMode = this.clickMapModeEvents.MOVE_CAMERA;
      google.maps.event.addListener(this.config.map, 'click', this.mapClickEvent.bind(this));
    }
  }

  public mapClickEvent(event):void {
    this.map_click.emit(this._googleLngToHumman(event.latLng));
    this.geocoder.geocode({
      latLng: event.latLng
    }, this._mapClickIt.bind(this, event));
  }

  private _mapClickIt(event, results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      this._hideAllInfoWindows();
      let marker:any = {
        title: results[0].formatted_address,
        latLng: event.latLng
      };
      if(this.config.selected_one_location) {
        this._markerDefault(marker);
      }
      else {
        this.config.map.setCenter(event.latLng);
      }

      if(this.clickMapMode === this.clickMapModeEvents.MOVE_CAMERA) {
        if (this.config.map_camera_move_end)
          this._mapCameraMoveEndEvent();
      }
    }
  }

  private _mapCameraMoveEnd() {
    if (this.config.map_camera_move_end)
      google.maps.event.addListener(this.config.map, 'dragend', this._mapCameraMoveEndEvent.bind(this));
  }

  private _mapCameraMoveEndEvent():void {
    this.camera_move_end.emit( this.getBounds() );
  }
}
