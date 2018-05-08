import { Component, NgZone } from '@angular/core';
import { NavController, App, NavParams } from 'ionic-angular';
import { LocationsPage } from '../locations/locations';
import { UsersProvider } from '../../providers/users/users';
declare var WindowsAzure: any;
import { Storage } from '@ionic/storage';
import { Http, RequestOptions, Headers } from '@angular/http';
import { FeedPage } from '../feed/feed';
import { MapPage } from '../map/map';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	client: any;
  user:any;
	azure_id:any;
  provider:any;
  appUrl:any = 'https://find-local-rentals.azurewebsites.net';
  HAS_LOGGED_IN = 'hasLoggedIn';
  fbToken:any;
  param:any;



  constructor(
    public navCtrl: NavController, 
    private httpProvider:UsersProvider, 
    private storage: Storage, 
    public http: Http, 
    private app:App,
    private readonly ngZone: NgZone,
    public navParams: NavParams,
  ) {
     this.param = navParams.get('gotopage');
     console.log("Param", this.param);
     if(this.param === 'map'){
       this.goToNearbyActivities();
     }

  }

  goToNearbyActivities(){
    this.navCtrl.push(MapPage);
  }

  // socialLogin(provider){
  //   this.httpProvider.login(provider);
  // }

  login(provider: string) {
    console.log(provider);
		this.provider = provider;
		this.client = new WindowsAzure.MobileServiceClient(this.appUrl);
		this.client.login(provider).done(this.loginResponse.bind(this));
  }
  
  async loginResponse(response) {
    //let nav = this.app.getActiveNav();	
    console.log(response);
    console.log(this.client);
    this.storage.set('azureid', response.userId);	
    this.azure_id = response.userId;
  
    this.httpProvider.getJsonData('user/azure_id/'+response.userId).subscribe(
      result => {
        console.log(result);
        if (result != ""){
          console.log(result, "Usuario ya existe");
          //nav.setRoot(FeedPage);
          //this.app.getRootNav().setRoot(FeedPage);
          this.storage.set(this.HAS_LOGGED_IN, true);
          //this.navCtrl.setRoot(FeedPage);
          this.ngZone.run(() => this.navCtrl.setRoot(FeedPage));

          
        }else{
          this.requestToken();
        }
         
      })
    
  }

  requestToken(){
    var url = this.client.applicationUrl + '/.auth/me';
    var headers = new Headers();
  
    headers.append('X-ZUMO-AUTH', this.client.currentUser.mobileServiceAuthenticationToken);
    let options = new RequestOptions({ headers: headers });	
  
    this.http.get(url, options).subscribe(
      data => {
        console.log("User", data);
        let token = JSON.parse(data['_body']);
        
        if (this.provider === 'facebook'){
          this.fbToken = token[0].access_token;
          this.getFBuserData(this.fbToken);
        }else if(this.provider === 'twitter'){
          console.log("Twitter Token", data);
          this.httpProvider.saveNewUser('user', token[0].user_id, token[0].user_id, 'not defined yet', token[0].user_claims[9].val, this.azure_id)
            .subscribe(data => {
              console.log("Twitter Data", data);
              this.storage.set(this.HAS_LOGGED_IN, true);
              this.storage.set('username', data.id);
              this.ngZone.run(() => this.navCtrl.setRoot(FeedPage));
            });
         
          //this.getTwitterData(token[0].user_id);
        }else{  
          console.log(token);
        }
  
        
      }
    )
  }

  getFBuserData(token){
    this.http.get('https://graph.facebook.com/me?fields=id,name,picture.width(900),email,birthday,first_name&access_token='+token).subscribe(
      user => {
        console.log(user);
        this.user = JSON.parse(user['_body']);
        console.log("Valores a mandar", this.user.name);
        this.httpProvider.saveNewUser('user', this.user.name, this.user.first_name, this.user.email, this.user.picture.data.url, this.azure_id)
        .subscribe(data => {
          console.log(data);
          this.storage.set(this.HAS_LOGGED_IN, true);
          this.storage.set('username', data.id);
          this.ngZone.run(() => this.navCtrl.setRoot(FeedPage));

    
        }, error => {
          console.log("Error", error);
        });
  
      }
    )
  }

  goToLogin(){
    this.navCtrl.push(LoginPage);
  }

}
