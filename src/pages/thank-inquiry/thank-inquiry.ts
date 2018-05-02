import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { FeedPage } from '../feed/feed';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-thank-inquiry',
  templateUrl: 'thank-inquiry.html',
})
export class ThankInquiryPage {
  endpoint:any = 'user/azure_id/';
  user_id:any;
  productID:any;
  operatorName:any;
  productName:any;
  azure_id:any;
  root:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private httpProvider: UsersProvider,
    public viewCtrl: ViewController,
    private app:App,
    private readonly ngZone: NgZone) {
    this.getUserStatus();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThankInquiryPage');
  }
  getUserStatus(){
    this.httpProvider.hasLoggedIn().then(hasLoggedIn => {
      console.log(hasLoggedIn);
        if(hasLoggedIn){
          this.httpProvider.getAzureID().then(azure =>{
            this.azure_id = azure;
            this.root = FeedPage;
            
          });
        }else{
         console.log('User not logged in');
         this.root = HomePage;
        }
        
    })
  }

  goHome(){
    console.log(this.root);
    this.viewCtrl.dismiss();
    // this.app.getRootNav().setRoot(this.root);
    // this.navCtrl.popToRoot();
  }

}
