import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { UsersProvider } from '../../providers/users/users';
import { Storage } from '@ionic/storage';
import { FeedPage } from '../feed/feed';
import { Keyboard } from '@ionic-native/keyboard';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  HAS_LOGGED_IN = 'hasLoggedIn';
  endpoint:any = 'user/login/';
  email:any;
  password:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private httpProvider: UsersProvider,
    private storage: Storage,
    private readonly ngZone: NgZone,
    public alertCtrl: AlertController,
    private keyboard: Keyboard) {
      this.keyboard.hideKeyboardAccessoryBar(false);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }

  login(){
    if(this.email != undefined && this.email != undefined){
      this.httpProvider.getJsonData(this.endpoint + this.email +  '/' + this.password).subscribe(result =>{
        if(result.length > 0){
          this.storage.set('azureid', result[0].azure_id);	
          this.storage.set(this.HAS_LOGGED_IN, true);
          this.storage.set('username', result[0].id);
          this.ngZone.run(() => this.navCtrl.setRoot(FeedPage));
        }else{
          this.presentAlert("Invalid email or password");
        }
      });
    } else{
      this.presentAlert("There's empty fields");
    }
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Required',
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

}
