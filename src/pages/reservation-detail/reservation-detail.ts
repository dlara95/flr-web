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
 import { Geolocation } from '@ionic-native/geolocation';


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
  address:any;
  operatorName:any;
  stars:any;
  avg:any;
  myLat:any;
  MyLng:any;

  


  constructor(public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps, private geolocation: Geolocation) {
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
    this.address = navParams.get('reservation').address;
    this.operatorName = navParams.get('reservation').operatorName;
    this.stars = navParams.get('res').stars;
    this.avg = navParams.get('res').countReviews;
    this.geolocation.getCurrentPosition().then((resp) =>{
      this.myLat = resp.coords.latitude;
      this.MyLng = resp.coords.longitude;
        }).catch((error) => {
          console.log('Error getting location', error);
        });
    
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

  getDistanceBetweenPoints(lat, lng){
    console.log(lat, lng);
        
    let earthRadius = {
        miles: 3958.8,
        km: 6371
    };

    let R = earthRadius['miles'];
    let lat1 = this.myLat;
    let lon1 = this.MyLng;
    let lat2 = lat;
    let lon2 = lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    if(isNaN(d)){
      return '0 miles'
    }else{
      return d.toFixed(2) + ' miles';

    }

}

toRad(x){
  return x * Math.PI / 180;
}
  

}
