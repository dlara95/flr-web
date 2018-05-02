import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';
@IonicPage()
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModalPage {
  lat:any;
  lng:any;
  map: GoogleMap;


  constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps) {
    this.lat = navParams.get('lat');
    this.lng = navParams.get('lng');
    this.loadMap();
    console.log(this.lat);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapModalPage');

  }
  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.lat,
          lng: this.lng
        },
        zoom: 17,
        tilt: 30
      }
    };
    let mapEle: HTMLElement = document.getElementById('mapmodal');


    this.map = this.googleMaps.create(mapEle, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
            icon: "assets/imgs/marker.png",
            animation: 'DROP',
            position: {
              lat: this.lat,
              lng: this.lng
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                console.log('clicked');
              });
          });

      });
  }

}
