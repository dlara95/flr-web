import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { UsersProvider } from '../providers/users/users';
import { FeedPage } from '../pages/feed/feed';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  gps:boolean;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public httpProvider: UsersProvider,
    private diagnostic: Diagnostic,
    private splashscreen: SplashScreen) {
    platform.ready().then(() => {
      console.log(platform.is('android'));
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if(platform.is('android')){
        let successCallback = (isAvailable) => { 
          console.log('Is available? ' + isAvailable); 
          if(isAvailable == true){
            this.gps = false;
          }else{
            this.gps = true;
          }
        };
        let errorCallback = (e) => console.error(e);
  
        this.diagnostic.isGpsLocationEnabled().then(successCallback).catch(errorCallback);
      }
      


    });

    this.httpProvider.hasLoggedIn().then(hasLoggedIn => {
      console.log(hasLoggedIn);
        if(hasLoggedIn){
          this.rootPage = FeedPage;
         
        }else{
          this.rootPage = HomePage;
        }
        
    });
    
  }



  
 
  closeOverlay(){
    this.gps = false;
    this.splashscreen.show();
    window.location.reload();

  }

   
}

