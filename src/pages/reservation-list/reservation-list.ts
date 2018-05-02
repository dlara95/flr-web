import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { ReservationDetailPage } from '../reservation-detail/reservation-detail';

@IonicPage()
@Component({
  selector: 'page-reservation-list',
  templateUrl: 'reservation-list.html',
})
export class ReservationListPage {

  azure_id:any;
  userID:any;
  userEndpoint:any = 'user/';
  productEndpoint:any = 'product/';
  reservations:any;
  data:any = {
      id: '',
      transaction_date: '',
      misc_trip_name: '',
      number_activity_reserved: '',
      transaction_start_date: '',
      transaction_end_date: '',
      transaction_start_time: '',
      transaction_end_time: '',
      price: '',
      nbr_in_party: ''
  };
  loading:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private httpProvider: UsersProvider,
    public loadingCtrl: LoadingController) {
      this.getStatus();
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img width="150" src="assets/imgs/placeholder.png" />
        <br>
        <h1 class="loader-text-center">Loading...</h1>`,
      });
      this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservationListPage');
  }

  getStatus(){
    this.httpProvider.hasLoggedIn().then(hasLoggedIn => {
      console.log(hasLoggedIn);
        if(hasLoggedIn){
          this.httpProvider.getAzureID().then(azure =>{
            this.azure_id = azure;
            console.log(azure);
            this.getUserID();
          });
        }
        
    });
  }


  getUserID(){
    this.httpProvider.getJsonData('user/azure_id/'+this.azure_id).subscribe(
      result =>{
        console.log(result);
          this.userID = result[0].id;
          this.getReservations();
      });
  }

  openMenu() {
    this.menuCtrl.open();
  }
 
  closeMenu() {
    this.menuCtrl.close();
  }
 
  toggleMenu() {
    this.menuCtrl.toggle();
  }

  getReservations(){
    this.httpProvider.getJsonData(this.userEndpoint + this.userID + '/reservations')
      .subscribe(result => {
        this.loading.dismiss();
        this.reservations = result;
      });
  }

  modifyReservation(id, transaction_date, misc_trip_name, number_activity_reserved, transaction_start_date, transaction_end_date, transaction_start_time, transaction_end_time, price, nbr_in_party, productID){
    this.httpProvider.getJsonData(this.productEndpoint + productID + '/location')
      .subscribe(data => {
        console.log("Coords", data);
        this.data.id = id;
        this.data.transaction_date = transaction_date;
        this.data.misc_trip_name = misc_trip_name;
        this.data.number_activity_reserved = number_activity_reserved;
        this.data.transaction_start_date = transaction_start_date;
        this.data.transaction_end_date = transaction_end_date;
        this.data.transaction_start_time = transaction_start_time;
        this.data.transaction_end_time = transaction_end_time;
        this.data.price = price;
        this.data.nbr_in_party = nbr_in_party;
        this.navCtrl.push(ReservationDetailPage, {reservation: this.data, lat: data[0].lat, lng: data[0].lng});

      });
  
  }

}
