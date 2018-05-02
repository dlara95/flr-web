import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';


@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {

  azure_id:any;
  userID:any; 
  userEndpoint:any = 'user/';
  favorites:any;
  loading:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private httpProvider: UsersProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
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
    console.log('ionViewDidLoad FavoritesPage');
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
          this.getFavorites();
      });
  }

  getFavorites(){
    this.httpProvider.getJsonData(this.userEndpoint + this.userID + '/favorites-products')
      .subscribe(result => {
        this.loading.dismiss();
        this.favorites = result;
      });
  }

  showConfirm(favID, index) {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
            confirm.dismiss();
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
            this.deleteFav(favID, index);
          }
        }
      ]
    });
    confirm.present();
  }

  deleteFav(favID, index){
    this.httpProvider.removeItem('favorite-product', favID)
      .subscribe(data => {
        (this.favorites).splice(index, 1);

      });
  }

}
