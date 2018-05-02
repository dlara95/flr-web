import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { ProductListPage } from '../product-list/product-list';


@IonicPage()
@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',
})
export class LocationsPage {

  endpoint:any = 'location/by_distance/';
  qty:any = 600;
  myLat:any;
  myLong:any;
  locations:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private httpProvider: UsersProvider,
    public popoverCtrl: PopoverController) {
      this.getLocations();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationsPage');
  }

  getLocations(){
    this.httpProvider.getJsonData(this.endpoint + '28.471346/-81.54047/10000')
        .subscribe(result => {
          this.locations = result;
        });
  }

  presentPopover(product, operator) {
    let popover = this.popoverCtrl.create(
      ProductListPage, {
        'product':product,
        'operator': operator
      }, {cssClass: 'product-popover'} );
    popover.present(
    );
  }


  

}
