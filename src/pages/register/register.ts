import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { Storage } from '@ionic/storage';
import { FeedPage } from '../feed/feed';
import { Keyboard } from '@ionic-native/keyboard';



@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  azure_id:any;
  name:any;
  username:any;
  email:any;
  password:any;
  endpoint:any = 'user';
  HAS_LOGGED_IN = 'hasLoggedIn';
  photo_url:any = 'https://liveglam.com/wp-content/themes/liveglam-new/assets/img/avatar_placeholder.svg';
  emailEndpoint:any = 'user/check/email/';
  usernameEndpoint:any = 'user/check/username/';
  message:string;
  showMessage:boolean = false;
  phone:any;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private httpProvider: UsersProvider,
    private storage: Storage,
    private readonly ngZone: NgZone,
    public alertCtrl: AlertController,
    private keyboard: Keyboard) {
      this.azure_id = 'sid:' + Date.now();
      this.keyboard.hideKeyboardAccessoryBar(false);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){
    this.httpProvider.addItem(this.endpoint, JSON.stringify({
      name: this.name,
      username: this.username,
      email:this.email,
      password: this.password,
      azure_id: this.azure_id,
      photo_url: this.photo_url,
      phone: this.phone
    })).subscribe(data => {
        console.log(data);
        this.storage.set('azureid', this.azure_id);	
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.storage.set('username', data[0].id);
        this.ngZone.run(() => this.navCtrl.setRoot(FeedPage));

    });

  }

  checkFields(){
    if(this.name != undefined && this.email != undefined && this.password != undefined && this.username != undefined && this.phone != undefined){
      //this.register();
      this.checkEmail();
    }else{
      // this.presentAlert("All fields are required");
      this.message = 'All fields are required';
      this.showMessage = true;
    }
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Required',
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

   validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }


  checkEmail(){
    console.log("Email ok?", this.validateEmail(this.email));
    if(this.validateEmail(this.email)){
      this.httpProvider.getJsonData(this.emailEndpoint + this.email).subscribe(result => {
        console.log("Email: ", result);
        if(result[0].count > 0){
          console.log("Email existing");
          this.message = 'An account already has been created with ' + this.email + ' . Try to sign in.';
          this.showMessage = true;
        }else{
          console.log("New user");
          this.validateUsername();
        }
     });
    } else{
      this.message = 'Please provide a valid email address.';
      this.showMessage = true;
    }
   
  }

  validateUsername(){
    var format = /[ !@#$%^&*()+\=\[\]{};':"\\|,<>\/?]/;
    var format2 = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    var firstLetter = this.username.charAt(0);
    var lastChar = this.username[this.username.length -1];
    var pattern = /[a-z]/;

    if(this.username.length < 3 ){
      this.message = "Username should contain at least 3 characters long";
      console.log("Username should contain at least 3 characters long");
      this.showMessage = true;
      
    }else if(this.username.length > 15){
      this.message = "Username should contain no more than 15 characters long";
      this.showMessage = true;
    }else if (/\s/.test(this.username)) {
      this.message = "Username should not contain spaces";
      this.showMessage = true;
    }else if(format.test(this.username) == true){
      this.message = "Username should not contain special characters";
      this.showMessage = true;
    }else if(format2.test(firstLetter) == true){
      this.message = "Username should not start with -, _  or .";
      this.showMessage = true;
    }else if(format2.test(lastChar) == true){
      this.message = "Username should not end with -, _  or .";
      this.showMessage = true;
    }else if(pattern.test(firstLetter) == false){
      this.message = "Username must start with a lowercase letter";
      this.showMessage = true;
    }else{
      this.checkUsername();
    }
  }


  checkUsername(){
    this.httpProvider.getJsonData(this.usernameEndpoint + this.username).subscribe(result => {
      console.log("Username: ", result);
      if(result[0].count > 0){
        console.log("username existing");
        this.message = this.username + ' already taken.';
          this.showMessage = true;
      }else{
        console.log("New username");
        this.validatePassword();
      }
  });
  }


  validatePassword(){
    if(this.password.length < 4 ){
      this.message = "Password should contain at least 4 characters long";
      this.showMessage = true;
      
    }else{
      this.register();
    }
  }

}
