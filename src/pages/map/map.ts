import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, App, ModalController, AlertController} from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProductListPage } from '../product-list/product-list';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { ChangeLocationPage } from '../change-location/change-location';
import { Storage } from '@ionic/storage';
import { ProductPage } from '../product/product';
import { LatLng, GoogleMapsEvent, Marker, MarkerOptions } from '@ionic-native/google-maps';
declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})


export class MapPage {
  //@ViewChild('map') element:ElementRef;

  base:any = 'https://kharron.com/api/location/by_distance/';
  lat:any;
  lng:any;
  map: any;
  myLat:any;
  myLng:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public plt: Platform,
    private http: Http,
    public popoverCtrl: PopoverController,
    private app: App,
    private readonly ngZone: NgZone,
    private geolocation: Geolocation,
    public modalCtrl: ModalController,
    private storage: Storage,
    public alertCtrl: AlertController,
  ) {
  }

  ionViewDidLoad(){
    this.geolocation.getCurrentPosition().then((resp) =>{
              this.lat = resp.coords.latitude;
              this.lng = resp.coords.longitude;
              this.getLocations(resp);
                }).catch((error) => {
                  console.log('Error getting location Aqui', error);
                  this.presentModal();
                });
  }

  // getPosition(locations):any{
  //   this.geolocation.getCurrentPosition()
  //   .then(response => {
  //     this.loadMap(response, locations);
  //   })
  //   .catch(error =>{
  //     console.log(error);
  //   })
  // }

  

  loadMap(position: Geoposition, locations){
    console.log("Locations", locations);
    var locations = locations;

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude, longitude);
    
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');

    // create LatLng object
    let myLatLng = {lat: latitude, lng: longitude};

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP

    });

    

    var infowindow = new google.maps.InfoWindow();

    var marker, i;
    var markers = new Array();
    var that = this;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i]['lat'], locations[i]['lot']),
        map: this.map,
        icon: 'https://findlocalrentals.net/reservations/shop_image/gmap/' + locations[i]['products_types_name_image'],
      });

      markers.push(marker);

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i]['operator_name'] + ' <button (click)="this.presentPopover(locations[i].products, locations[i].operator_name, locations[i].avg_stars, locations[i].count_stars">Go!</button>');
          infowindow.open(this.map, marker);
        }
      })(marker, i));
    }

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        title: 'My Position'
      });
      mapEle.classList.add('show-map');
    });

    google.maps.event.addListener(this.map, 'center_changed', (e) => {
        
              console.log("E", this.map.getCenter().lat());
              this.lat = this.map.getCenter().lat();
              this.lng = this.map.getCenter().lng();
              this.updateMarkers();
      
          });
  }


//   ngAfterViewInit() {
//     this.plt.ready().then(() => {

//         this.geolocation.getCurrentPosition().then((resp) =>{
//         this.lat = resp.coords.latitude;
//         this.lng = resp.coords.longitude;
//         this.getLocations();
//           }).catch((error) => {
//             console.log('Error getting location', error);
//           });
//           // this.lat = '28.471346';
//           // this.lng = '-81.54047';
//           // this.getLocations();
      
//     //   this.storage.get('customLat').then((val) => {
//     //     console.log(val);
//     //     if(val != null){
//     //       this.lat = val;
//     //       this.storage.get('customLng').then((lng) => {
//     //         console.log(lng);
//     //         if(val != null){
//     //           this.lng = lng;
//     //           this.getLocations();
//     //         }
//     //       });
//     //     }else{
//     //     // this.geolocation.getCurrentPosition().then((resp) =>{
//     //     // this.lat = resp.coords.latitude;
//     //     // this.lng = resp.coords.longitude;
//     //     // this.getLocations();
//     //     //   }).catch((error) => {
//     //     //     console.log('Error getting location', error);
//     //     //   });
//     //       this.lat = '28.471346';
//     //       this.lng = '-81.54047';
//     //       this.getLocations();
//     //     }   
//     //   });
//     //   //this.getLocations();
       
//     });
//   }

  

  getLocations(response){
    
    this.http.get(this.base + this.lat + '/' + this.lng + '/10000')
    .map(res => res.json())
    .subscribe(locations => this.loadMap(response, locations))
  }

  updateLocations(){
    this.http.get(this.base + this.lat + '/' + this.lng + '/10000')
    .map(res => res.json())
    .subscribe(locations => this.moveMap(locations))
  }

  updateMarkers(){
    this.http.get(this.base + this.lat + '/' + this.lng + '/10000')
    .map(res => res.json())
    .subscribe(locations => this.sortMarkers(locations))
  }
//   initMap (locations) {
//     console.log(locations);
//     let mapEle: HTMLElement = document.getElementById('map');

    
//     this.map= this.googleMaps.create(mapEle);

//     this.map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
//       this.moveMap(locations);
     
//     });
//     this.map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(() => {
        
//         console.log(this.map.getCameraTarget());
//         this.lat = this.map.getCameraTarget().lat;
//         this.lng = this.map.getCameraTarget().lng;
//         this.updateMarkers();

//     }); 
//   }


  moveMap(locations){
    if(locations.length < 1){
      this.showAlert();
    }else{
      console.log("To move map", locations);
      var center = new google.maps.LatLng(locations[0].lat, locations[0].lot);
      this.map.panTo(center);

    //   let cameraCoordinates: LatLng = new LatLng(locations[0].lat, locations[0].lot);

    // let cameraPosition = {
    //   target: cameraCoordinates,
    //   zoom: 14
    // }

    // this.map.animateCamera(cameraPosition);

    // this.sortMarkers(locations);
    // this.geolocation.getCurrentPosition().then((resp) =>{
    //   this.myLat = resp.coords.latitude;
    //   this.myLng = resp.coords.longitude;
    //   console.log("MY coords", resp.coords);
    //   this.myMarker();

    //     }).catch((error) => {
    //       console.log('Error getting location', error);
    //     });

    }
    
  }

  myMarker(){
    
    let coordinates: LatLng = new LatLng(this.myLat, this.myLng);

    let markerOptions: MarkerOptions = {
      position: coordinates,
      title: 'My Location',
    };

    const marker = this.map.addMarker(markerOptions)
      .then((marker: Marker) => {
        marker.showInfoWindow();
        });
  }

  sortMarkers(locations){
    console.log("Locaciones", locations);
    

      var infowindow = new google.maps.InfoWindow();

      var marker, i;
      var markers = new Array();
  
      for (i = 0; i < locations.length; i++) {  
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i]['lat'], locations[i]['lot']),
          map: this.map,
          icon: 'https://findlocalrentals.net/reservations/shop_image/gmap/' + locations[i]['products_types_name_image'],
        });
  
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(locations[i]['operator_name']);
            infowindow.open(this.map, marker);
          }
        })(marker, i));
      }

      // const marker = this.map.addMarker(markerOptions)
      //   .then((marker: Marker) => {
      //     marker.showInfoWindow();
      //     marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      //       console.log("Length", location.products);
      //       if(location.products.length == 1){
      //         this.ngZone.run(() => this.goToProductDetail(location.products[0], location.operator_name, location.avg_stars, location.count_stars));
      //       }else if(location.products.length > 1){
      //         this.ngZone.run(() => this.presentPopover(location.products, location.operator_name, location.avg_stars, location.count_stars));

      //       }
      //       });
      //     });

    
  }

  presentPopover(product, operator, avg_stars, count_stars) {
    // this.app.getRootNav().push(ProductListPage, {
    //   'product':product,
    //   'operator': operator});
    
    let popover = this.popoverCtrl.create(
      ProductListPage, {
        'product':product,
        'operator': operator,
        'stars': avg_stars,
        "count_stars": count_stars
      }, {cssClass: 'product-popover'} );
    popover.present();
  }

  getDistanceBetweenPoints(lat, lng){
        
    let earthRadius = {
        miles: 3958.8,
        km: 6371
    };

    let R = earthRadius['miles'];
    let lat1 = this.myLat;
    let lon1 = this.myLng;
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

    return d.toFixed(2) + ' miles';

}

  goToProductDetail(product, operator, avg_stars, count_stars){
    let miles = this.getDistanceBetweenPoints(product.lat, product.lot);
    console.log("Millas", miles);

    this.navCtrl.push(ProductPage, {
      'product': product,
      'operator': operator,
      'stars': avg_stars,
      "count_stars": count_stars,
      'miles': miles
  
    });
  }

  toRad(x){
    return x * Math.PI / 180;
}
  

  presentModal() {
    let modal = this.modalCtrl.create(ChangeLocationPage);
    modal.present();
    modal.onDidDismiss((val) =>{
      if(val !== 'none'){
        this.getLat();

      }
    });
  } 

  getLat(){
    this.storage.get('customLat').then((val) => {
      if(val != null){
        this.lat = val;
        this.getLng();
      }      
    });
  }

  getLng(){
    this.storage.get('customLng').then((val) => {
      if(val != null){
        this.lng = val;
        console.log(this.map);
        // this.map.remove().then(data =>{
        //   console.log(data);
        //   //this.getLocations();
        // });
        // let cameraCoordinates: LatLng = new LatLng(this.lat, this.lng);

        // let cameraPosition = {
        //   target: cameraCoordinates,
        //   zoom: 17
        // };
  
        // this.map.animateCamera(cameraPosition);
        this.updateLocations();
       
      }      
    });
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'No Locations founds',
      subTitle: 'Change location and try again',
      buttons: [{
        text: 'Search',
        handler: data =>{
          this.presentModal();
        }
      }]
    });
    alert.present();
  }

  

 


}
