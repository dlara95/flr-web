import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { PaymentPage } from '../payment/payment';
import { MapModalPage } from '../map-modal/map-modal';
import { FeedPage } from '../feed/feed';
import { HomePage } from '../home/home';
import { Keyboard } from '@ionic-native/keyboard';


@IonicPage()
@Component({
  selector: 'page-reservation',
  templateUrl: 'reservation.html',
})
export class ReservationPage {

  //price:number = 65;
  qty:number;
  gap:number = 3.50;
  coupon:any;
  enable:boolean = false;
  newPrice:number;
  azure_id:any;
  endpoint:any = 'user/azure_id/';
  public name:any;
  public email:any;
  user_id:any;
  mobile:any;
  productID:any;
  operatorName:any;
  productName:any;
  price:any;
  startDate:any;
  startHour:any;
  endDate:any;
  endHour:any;
  reservationCount:any;
  couponEndpoint:any = 'coupon/';
  lat:any;
  lng:any;
  root:any;
  pricePlan:any;
  stars:any;
  count_stars:any;
  miles:any;
  daysQty:any;
  type:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private httpProvider: UsersProvider,
    public popoverCtrl: PopoverController,
    private keyboard: Keyboard) {
      this.keyboard.hideKeyboardAccessoryBar(false);
      this.productID = navParams.get('productID');
      this.operatorName = navParams.get('operatorName');
      this.productName = navParams.get('productName');
      this.price = navParams.get('price');
      this.startDate = navParams.get('startDate');
      this.startHour = navParams.get('startHour');
      this.endDate = navParams.get('endDate');
      this.endHour = navParams.get('endHour');
      this.qty = navParams.get('reservationCount');
      this.lat = navParams.get('lat');
      this.lng = navParams.get('lng');
      this.pricePlan = navParams.get('pricePlan');
      this.stars = navParams.get('stars');
      this.count_stars = navParams.get('count_stars');

      this.miles = navParams.get('miles');
      this.daysQty = navParams.get('daysQty');
      this.type = navParams.get('type');

      this.getUserStatus();

  }
  buttonLabel="Continue";


  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservationPage');
  }

  boxDialog(){
   
    const alert = this.alertCtrl.create({
      subTitle: 'This helps us provide you with a safer and more secure booking experience, coupled with 24x7 customer support.',
      buttons: ['OK'],
      cssClass: 'alertReservation'
    });
    alert.present();
  
  
}

presentAlert(message) {
  let alert = this.alertCtrl.create({
    title: 'Required',
    subTitle: message,
    buttons: ['Dismiss']
  });
  alert.present();
}


backToEdit(){
  this.navCtrl.pop();
}

getSubtotal(){
  return (this.price * this.qty * this.daysQty).toFixed(2);
}

getTax(){
  let subtotal = this.price * this.qty * this.daysQty;
  return (subtotal * 0.07).toFixed(2);
}

getTotal():any{
  return ((this.price * this.qty * this.daysQty) + ((this.price * this.qty * this.daysQty) * 0.07) + this.gap).toFixed(2);
}

getDiscount(){
  
  this.httpProvider.getJsonData(this.couponEndpoint + this.coupon + '/' + this.productID)
      .subscribe(result => {
          if(result.message === 'ok'){
            let discount = this.getTotal() * (result.amount / 100);
            this.enable = true;
            this.newPrice = this.getTotal() - discount;
          }else{

            this.presentAlert('The coupon is invalid');
          }
      });
}

getUserStatus(){
  this.httpProvider.hasLoggedIn().then(hasLoggedIn => {
    console.log(hasLoggedIn);
      if(hasLoggedIn){
        this.httpProvider.getAzureID().then(azure =>{
          this.azure_id = azure;
          this.getUserData();
          this.root = FeedPage;
          
        });
      }else{
       console.log('User not logged in');
       this.root = HomePage;
      }
      
  })
}

getUserData(){
  this.httpProvider.getJsonData(this.endpoint+this.azure_id).subscribe(
    result => {
        console.log(result);
        this.email = result[0].email;
        this.name = result[0].name;
        this.user_id = result[0].id;
        this.mobile = result[0].phone;
        console.log(this.email);
    }
  )
}


checkRequireFields(){
  console.log(this.name);
    if(this.name != undefined && this.email != undefined && this.mobile != undefined){
        console.log("You can go and pay!");
        this.navCtrl.push(PaymentPage, {
          productID: this.productID,
          productName: this.productName,
          price: this.price,
          transaction_start_date: this.startDate,
          transaction_end_date: this.endDate,
          transaction_start_time: this.startHour,
          transaction_end_time: this.endHour,
          number_activity_reserved: this.qty,
          guestName: this.name,
          guestEmail: this.email,
          guestMobile: this.mobile,
          total: this.getTotal(),
          qty: this.daysQty,
          type: this.type
        });
    }else{
      console.log("You need to enter your information");
      this.presentAlert("Your name, email and phone number are required");
    }
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

cancel(){
  this.coupon = "";
  this.enable = false;
}

presentPopover() {
  let popover = this.popoverCtrl.create(MapModalPage, {
    lat: this.lat,
    lng: this.lng
  }, {cssClass: 'map-popover'});
  popover.present();
}

back(){
  this.navCtrl.popToRoot();
}

}
