import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-change-location',
  templateUrl: 'change-location.html',
})
export class ChangeLocationPage {

  searchTerm:any;

  constructor( 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private storage: Storage,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation) {
     
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
      this.nativeGeocoder.forwardGeocode(this.searchTerm)
  .then((coordinates: NativeGeocoderForwardResult) => {
    
    console.log(this.searchTerm);
    console.log(coordinates.latitude, coordinates.longitude);
    this.saveCoords(coordinates.latitude, coordinates.longitude);
  })
  .catch((error: any) => console.log(error));
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


  

}
