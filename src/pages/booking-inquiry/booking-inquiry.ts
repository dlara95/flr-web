import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { SocialShareProvider } from '../../providers/social-share/social-share';
import { FeedPage } from '../feed/feed';
import { HomePage } from '../home/home';
import { ThankInquiryPage } from '../thank-inquiry/thank-inquiry';
import { Keyboard } from '@ionic-native/keyboard';


@IonicPage()
@Component({
  selector: 'page-booking-inquiry',
  templateUrl: 'booking-inquiry.html',
})
export class BookingInquiryPage {

  endpoint:any = 'user/azure_id/';
  public name:any;
  public email:any;
  user_id:any;
  mobile:any;
  productID:any;
  operatorName:any;
  productName:any;
  azure_id:any;
  inquiryEndpoint:any = 'inquiry';
  root:any;
  stars:any;
  count_stars:any;
  miles:any;
  checked:boolean = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private httpProvider: UsersProvider,
    private shareProvider: SocialShareProvider,
    public modalCtrl: ModalController,
    private keyboard: Keyboard,
    private readonly ngZone: NgZone) {
      this.keyboard.hideKeyboardAccessoryBar(false);

      this.productID = navParams.get('productID');
      this.operatorName = navParams.get('operatorName');
      this.productName = navParams.get('productName');
      this.stars = navParams.get('stars');
      this.count_stars = navParams.get('count_stars');
      this.miles = navParams.get('miles');



      this.getUserStatus();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingInquiryPage');
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Oops!',
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  inquiryOverlay(message){
    let alert = this.alertCtrl.create({
      title: 'Successfully',
      subTitle: message,
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.navCtrl.setRoot(this.root);
        }
      }]
    });
    alert.present();
  }

  showThankModal(){
    let modal = this.modalCtrl.create(ThankInquiryPage);
    modal.present();
    modal.onDidDismiss(() => {
      this.ngZone.run(() =>  this.navCtrl.popToRoot() );

    });
  }


  close(){
    this.navCtrl.popToRoot();

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
      if(this.name != undefined && this.email != undefined && this.mobile != undefined && this.checked != false){
          console.log("Send request!");
          this.httpProvider.addItem(this.inquiryEndpoint, JSON.stringify({
            product_id: this.productID,
            name: this.name,
            email: this.email,
            phone: this.mobile,
            message: 'Product ' + this.productID + ' is not available' 
          })).subscribe(data => {
              console.log(data);
              this.showThankModal();
          });
          //this.shareProvider.shareViaEmail(this.name + " " +  this.email + " " + this.mobile + " " + this.productID);
      }else{
        console.log("You need to enter your information");
        this.presentAlert("Your name, email, phone number and accept the terms are required");
      }
  }

  updateTerms(){
    console.log(this.checked);
  }

}
