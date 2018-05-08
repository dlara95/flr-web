import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { ProductPage } from '../product/product';
import { BookingInquiryPage } from '../booking-inquiry/booking-inquiry';
import { Geolocation } from '@ionic-native/geolocation';


@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {
  operatorID:any;
  operator:any;
  stars:any;
  public products:any = [];
  count_stars:any;
  myLat:any;
  MyLng:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private httpProvider: UsersProvider,
    public viewCtrl: ViewController,
    public app: App,
    private geolocation: Geolocation) {
      this.products = navParams.get('product');
      this.operator = navParams.get('operator');
      this.stars = navParams.get('stars');
      this.count_stars = navParams.get('count_stars');

      console.log("Estrellas", this.stars);
      this.geolocation.getCurrentPosition().then((resp) =>{
        this.myLat = resp.coords.latitude;
        this.MyLng = resp.coords.longitude;
          }).catch((error) => {
            console.log('Error getting location', error);
          });
  }

          getDistanceBetweenPoints(lat, lng){
        
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

 

  goToDetail(product){

    let miles = this.getDistanceBetweenPoints(product.lat, product.lot);
    console.log("Miles to Go", miles);
    this.navCtrl.push(ProductPage, {
      'product': product,
      'operator': this.operator,
      'stars': this.stars,
      "count_stars": this.count_stars,
      'miles': miles

    });
  } 

  request(){
    this.navCtrl.push(BookingInquiryPage, {
      operatorName: this.operator,
      'stars': this.stars,
      "count_stars": this.count_stars
    });
  }


}
