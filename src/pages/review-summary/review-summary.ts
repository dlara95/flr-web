import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';



@IonicPage()
@Component({
  selector: 'page-review-summary',
  templateUrl: 'review-summary.html',
})
export class ReviewSummaryPage {
  operatorID:any;
  comment:any;
  endpoint:any = 'comments-operator';
  disable:boolean = false;
  userID:any;
  azure_id:any;
  userEndpoint:any = 'user';
  rate:any;
  startEndpoint:any = 'stars-operator';
  productName:any;
  operatorEndpoint:any = 'operator/';
  reviews:any;
  image:any;
  avg:any;
  avg1:any;
  avg2:any;
  avg3:any;
  avg4:any;
  avg5:any;
  total:any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private httpProvider: UsersProvider) {
    this.operatorID = navParams.get('product').operatorID;
    this.productName = navParams.get('product').operator_name;
    this.image = 'https://findlocalrentals.net/reservations/shop_image/product/' +  navParams.get('product').name_image;
    this.getStatus();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewSummaryPage');
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
        console.log("User ID", result);
          this.userID = result[0].id;
          this.getPrevReviews();
      });
  }

  getPrevReviews(){
    this.httpProvider.getJsonData(this.operatorEndpoint + this.operatorID + '/stars-comments')
      .subscribe(result =>{
        console.log(result);
        this.reviews = result['reviews'];
        this.avg = result['average'].promedio;
        this.total = result['average'].total;
        this.avg1 = result['average']["1"];
        this.avg2 = result['average']["2"];
        this.avg3 = result['average']["3"];
        this.avg4 = result['average']["4"];
        this.avg5 = result['average']["5"];
      });
    }


    getAvg(count = 0){
      return ((count / this.total) * 100).toFixed(1);

    }

}
