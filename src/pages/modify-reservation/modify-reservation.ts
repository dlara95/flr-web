import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FeedPage } from '../feed/feed';
import { MapPage } from '../map/map';
import { HomePage } from '../home/home';
import { UsersProvider } from '../../providers/users/users';
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
  selector: 'page-modify-reservation',
  templateUrl: 'modify-reservation.html',
})
export class ModifyReservationPage {

  enableOverlay:boolean = true;
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
  root:any;
  people:any;
  gap:number = 3.50;
  type:any;
  map: GoogleMap;
  stars:any;
  avg:any;
  operatorName:any;
  operatorAddress:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl: ViewController,
    private httpProvider: UsersProvider,
    public googleMaps: GoogleMaps) {
    this.bookingID = navParams.get('reservation').ID;
    this.bookingDate= navParams.get('reservation').transaction_date;
    this.productName = navParams.get('reservation').misc_trip_name;
    this.qty = navParams.get('reservation').number_activity_reserved;
    this.startDate = navParams.get('reservation').transaction_start_date;
    this.endDate = navParams.get('reservation').transaction_end_date;
    this.startHour = navParams.get('reservation').transaction_start_time;
    this.endHour = navParams.get('reservation').transaction_end_time;
    this.price = navParams.get('reservation').price;
    this.people = navParams.get('reservation').nbr_in_party;
    this.type = navParams.get('type');
    this.stars = navParams.get('reservation').stars;
    this.avg = navParams.get('reservation').countReviews;
    this.operatorName = navParams.get('reservation').operatorName;
    this.operatorAddress = navParams.get('reservation').operatorAddress;

    this.getStatus();
  }

  

  getStatus(){
    this.httpProvider.hasLoggedIn().then(hasLoggedIn => {
      console.log(hasLoggedIn);
        if(hasLoggedIn){
          this.httpProvider.getAzureID().then(azure =>{
            console.log(azure);
            this.root = FeedPage;
          });
        }else{
          this.root = HomePage;
        }
        
    });
  }


  ionViewDidLoad() {
    this.loadMap();
  }
  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
}

loadMap() {

  let mapOptions: GoogleMapOptions = {
    camera: {
      target: {
        lat: 43.0741904,
        lng: -89.3809802
      },
      zoom: 18,
      tilt: 30
    }
  };
  let mapEle: HTMLElement = document.getElementById('map_canvas2');

    
  this.map= this.googleMaps.create(mapEle);

  //  this.map = GoogleMaps.create('map_canvas', mapOptions);

  // Wait the MAP_READY before using any methods.
  this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      console.log('Map is ready!');

      // Now you can use all methods safely.
      this.map.addMarker({
          title: 'Ionic',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: 43.0741904,
            lng: -89.3809802
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


  viewReservation(){
    this.enableOverlay = false;
  }

  getAmount(){
    return ((this.price * this.qty * this.people) + ((this.price * this.qty * this.people) * 0.07) + this.gap).toFixed(2);

  }

  goToFeed(){
    this.navCtrl.popToRoot();
  }
  setFeed(){
    this.navCtrl.popToRoot();
  }

  goToMap(){
    this.navCtrl.push(MapPage);
  }

  tConvert (time) {
    if(time != null){
       // Check correct time format and split into components
      time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time[0] + time[1] + time[2] + time[5]; // return adjusted time or original string
    }
   
  }

}
