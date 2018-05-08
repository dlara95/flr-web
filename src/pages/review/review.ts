import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { SingleReviewPage } from '../single-review/single-review';
import { MapPage } from '../map/map';
import { ReviewSummaryPage } from '../review-summary/review-summary';


@IonicPage()
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {

  endpoint:any = 'user/';
  reviews:any = [];
  loading:any;
  azure_id:any;
  userID:any;
  oldreviews:any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
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
    console.log('ionViewDidLoad ReviewPage');
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
          this.getReviews();
          this.getOldReviews();
      });
  }

  getReviews(){
    this.httpProvider.getJsonData(this.endpoint+this.userID+'/not-stars-comments' ).subscribe(result => {
      this.loading.dismiss();
      this.reviews = result;
    });
  }

  getOldReviews(){
    this.httpProvider.getJsonData(this.endpoint+this.userID+'/stars-comments-more' ).subscribe(result => {
      this.oldreviews = result;
    });
  }

  evaluate(product){
    this.navCtrl.push(SingleReviewPage, {'product': product});
  }

  goToSummary(product){
    this.navCtrl.push(ReviewSummaryPage, {'product': product});

  }

  goToNearbyActivities(){
    this.navCtrl.push(MapPage);
  }

}
