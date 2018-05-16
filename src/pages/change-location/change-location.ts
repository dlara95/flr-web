import { Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { MapsAPILoader } from '@agm/core';

declare var google;

@IonicPage()
@Component({
  selector: 'page-change-location',
  templateUrl: 'change-location.html',
})
export class ChangeLocationPage implements OnInit {

  searchTerm:any;
  searchLat:any;
  searchLng:any;
  
  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor( 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private storage: Storage,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
    private http: Http,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeLocationPage');
  }



  dismiss() {
    this.viewCtrl.dismiss();
  }
  close() {
    this.viewCtrl.dismiss('none');
  }


  public getLocation(){
    if(this.searchTerm != null){
      console.log("Diferente");
      this.saveCoords(this.searchLat, this.searchLng);

//       this.getCoords(this.searchTerm).subscribe(localtions => {
//           console.log("Location", localtions);
//           console.log(localtions.results[0]['geometry'].location);
//           this.saveCoords(localtions.results[0]['geometry'].location.lat, localtions.results[0]['geometry'].location.lng);
//       });
    }else{
      this.dismiss();
    }
    
  }

  saveCoords(lat, lng){
    this.storage.set('customLat', lat);
    this.storage.set('customLng', lng);
    this.dismiss();
  }

  public getCurrentLocation(){
    this.geolocation.getCurrentPosition().then((resp) =>{
      this.saveCoords(resp.coords.latitude, resp.coords.longitude);
        }).catch((error) => {
          console.log('Error getting location', error);
        });
  }

  detail(item){
    console.log(item);
    this.searchTerm = item.description;
  }

//   getCoords(term){
//     return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + term + '&key=AIzaSyBmXK9M2OQCfZuPJdgxLzWkFcdPd_Zo7ZY').map(res => res.json());

//   }
  
  onSearchInput(){
    console.log("Termino", this.searchTerm);
    var autocomplete = new google.maps.places.Autocomplete(this.searchTerm);
    console.log(autocomplete);

  }
  
  ngOnInit() {


   

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["(cities)"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }else{
            console.log("place", place.geometry.location.lat());
            this.searchTerm = place.formatted_address;
            this.searchLat = place.geometry.location.lat();
            this.searchLng = place.geometry.location.lng();
          }

        });
      });
    });
  }

  

}
