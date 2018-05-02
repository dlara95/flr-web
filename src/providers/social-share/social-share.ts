import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SocialSharing } from '@ionic-native/social-sharing';


@Injectable()
export class SocialShareProvider {

  constructor(public http: Http, private socialSharing: SocialSharing) {
    console.log('Hello SocialShareProvider Provider');
  }

  shareViaEmail(message){
    this.socialSharing.shareViaEmail(message, "Booking Inquiry", ["dayana@senorcoders.com"])
    .then(() =>{
      console.log('Success');
    }).catch((error) => {
      console.log('Error', error);
    })
  }

}
