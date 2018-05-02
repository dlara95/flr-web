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
  selector: 'page-reservation-detail',
  templateUrl: 'reservation-detail.html',
})
export class ReservationDetailPage {

  bookingID:any;
  bookingDate:any;
  productName:any;
  qty:any;
  startDate:any;
  endDate:any;
  startHour:any;
  endHour:any;
  price:any;
  totalAmount:number;
  people:any;
  gap:number = 3.50;
  map: GoogleMap;
  lat:any;
  lng:any;

  


  constructor(public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps) {
    this.bookingID = navParams.get('reservation').id;
    this.bookingDate= navParams.get('reservation').transaction_date;
    this.productName = navParams.get('reservation').misc_trip_name;
    this.qty = navParams.get('reservation').number_activity_reserved;
    this.startDate = navParams.get('reservation').transaction_start_date;
    this.endDate = navParams.get('reservation').transaction_end_date;
    this.startHour = navParams.get('reservation').transaction_start_time;
    this.endHour = navParams.get('reservation').transaction_end_time;
    this.price = navParams.get('reservation').price;
    this.people = navParams.get('reservation').nbr_in_party;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservationDetailPage');
    this.lat = this.navParams.get('lat');
    this.lng = this.navParams.get('lng');
    this.loadMap();

  }

  getAmount(){
    return ((this.price * this.qty * this.people) + ((this.price * this.qty * this.people) * 0.07) + this.gap).toFixed(2);

  }

  tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time[0] + time[1] + time[2] + time[5]; // return adjusted time or original string
  }

  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.lat,
          lng: this.lng
        },
        zoom: 12,
        tilt: 30
      }
    };
    let mapEle: HTMLElement = document.getElementById('map_canvas3');
  
      
    this.map= this.googleMaps.create(mapEle);
  
    //  this.map = GoogleMaps.create('map_canvas', mapOptions);
  
    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map Reservation is ready!');
  
        // Now you can use all methods safely.
        this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: this.lat,
              lng: this.lng
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });
  
      });
  }
  

}
