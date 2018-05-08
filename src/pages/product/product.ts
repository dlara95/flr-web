import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { ReservationPage } from '../reservation/reservation';
import { BookingInquiryPage } from '../booking-inquiry/booking-inquiry';
import { ChangeLocationPage } from '../change-location/change-location';
import { Storage } from '@ionic/storage';
import { FeedPage } from '../feed/feed';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  @ViewChild('dateTimeUpdate') sTime:ElementRef;

  operator_name:any;
  productName:any;
  price:any;
  productID:any;
  endpoint:any = 'services-dates/better-next-dates/';
  public dates:any = [];
  public datesEnd:any = [];
  enable:boolean;
  azure_id:any;
  userID:any;
  favEndpoint:any = 'favorite-product';
  userEndpoint:any = 'user/';
  liked:boolean;
  enableFirst:boolean = true;
  enableSecond:boolean = false;
  enableThird:boolean = false;
  disable:boolean = true;
  endDate:any;
  endHour:any;
  disableFirst:boolean = false;
  secondColor:any = 'orange-border';
  firstColor:any = 'orange-bg orange-border';
  rowText:string = 'start';
  reserveCount:number = 1;
  startDate:any;
  startHour:any;
  enableContinue:boolean = true;
  enableDates:boolean = false;
  loading:any;
  reloading:boolean = true;
  enableInquiry:boolean = false;
  public timeStarts = '';
  public timeEnd = '';
  enableEndDate:boolean = false;
  pricePlan:any;
  hourly:boolean = true;
  pricingEndpoint:any = 'product/';
  public prices:any = [];
  miles:any;
  pricesRow:boolean = true;
  lat:any;
  lng:any;
  root:any;
  stars:any;
  enablePicker:boolean = false;
  count_stars:any;
  image:any;
  enableEndDateRow:boolean = true;
  enableEndTimeRow:boolean = true;
  daysQty:number = 1;
  type:any;
  showPicker:boolean = false;
  currentHour:any;
  filteredFirstDate:boolean = false;
  private picker:any;
  maxQty:number;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private httpProvider: UsersProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private storage: Storage) {
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img width="150" src="assets/imgs/placeholder.png" />
        <br>
        <h1 class="loader-text-center">Loading...</h1>`,
      });
      this.loading.present();
      var today = new Date();
      var dd:any = today.getDate();
      var mm:any = today.getMonth()+1;
      var yyyy = today.getFullYear();
      this.timeStarts = yyyy + '-' + mm + '-' + dd;
      this.timeEnd = yyyy + '-' + mm + '-' + dd;
      this.currentHour = this.addZero(today.getHours()) + ':' + this.addZero(today.getMinutes()) + ':' + this.addZero(today.getSeconds());
      console.log("Current Hour", this.currentHour);
  }

  ngAfterViewChecked() {
    this.picker = this.sTime;
    console.log("Picker", this.sTime);
}

  ngOnInit(){ 
      this.operator_name = this.navParams.get('operator');
      this.productName = this.navParams.get('product').name;
      this.price = this.navParams.get('product').price;
      this.productID = this.navParams.get('product').product_id;
      this.lat = this.navParams.get('product').lat;
      this.lng = this.navParams.get('product').lot;
      this.pricePlan = this.navParams.get('product').price_plan;
      this.stars = this.navParams.get('stars');
      this.count_stars = this.navParams.get('count_stars');
      this.miles = this.navParams.get('miles');
      this.maxQty = this.navParams.get('product').max_adults;
      this.image =  this.navParams.get('product').name_image ? 'https://findlocalrentals.net/reservations/shop_image/product/' + this.navParams.get('product').name_image : 'assets/imgs/placeholder.png';

      console.log("Product ID", this.productID);
      //this.getDates();
      this.getStatus();
      this.getPricing();
  }

   addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


  timesCount(){
    if(this.reserveCount < this.maxQty){
      this.reserveCount++;

    }
  }

  dicreaseCount(){
    if(this.reserveCount > 1){
      this.reserveCount--;
    }
  }

  increaseDays(){
   
      this.daysQty++;

    
  }

  decreaseDays(){
    if(this.daysQty > 1){
      this.daysQty--;
    }
  }

  goToBookReservation(){
    console.log('click');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
  } 

  onButtonGroupClick($event){
  	console.log($event);
    let clickedElement = $event.target || $event.srcElement;

    if( clickedElement.nodeName === "BUTTON" ) {

      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".orange-bg");
      // if a Button already has Class: .active
      if( isCertainButtonAlreadyActive ) {
        isCertainButtonAlreadyActive.classList.remove("orange-bg");
      }

      clickedElement.className += " orange-bg";
    }

  }
 
  back(){
    console.log('back');
    this.navCtrl.pop();
  }

  getDates(timeStart?){
    if(timeStart != null){
      var url = this.endpoint + this.productID +'/' + timeStart;
    }else{
      var url:string = this.endpoint + this.productID;
    }
    this.httpProvider.getJsonData(url).subscribe(result => {
        console.log("Dates", result.length);
        console.log(result);
        this.loading.dismiss();
        this.reloading = false;
        if (result.length > 0){
          this.getSingleDate(result);
          this.enableDates = true;
        }else{
          console.log('Booking Inquiry');
          this.enableInquiry = true;
          this.enableDates = false;
        }
        //this.dates = result;
    });

  }

  getEndDates(timeStart?){
    if(timeStart != null){
      var url = this.endpoint + this.productID + '/' + timeStart;
    }else{
      var url:string = this.endpoint + this.productID;
    }

    console.log(url);
    this.httpProvider.getJsonData(url).subscribe(result => {
        console.log("Dates", result.length);
        this.loading.dismiss();
        this.reloading = false;
        if (result.length > 0){
          this.getSingleEndDate(result);
          this.enableEndDate = true;
        }else{
          console.log('Booking Inquiry');
          this.enableInquiry = true;
          this.enableDates = false;
        }
        //this.dates = result;
    });
  }
  getSingleDate(array){
    console.log("Longitud", array.length);
    for(var date = 0; date < array.length; date++){
      console.log(array[date], date);
      if (date < 3){
        console.log(array[date]);
       this.dates.push(array[date]);
       this.startDate = this.dates[0].date;

      }

    }
  
  }

  getSingleEndDate(array){
    console.log("Longitud", array.length);
    for(var date = 0; date < array.length; date++){
      console.log(array[date], date);
      if (date < 3){
        console.log(array[date]);
       this.datesEnd.push(array[date]);
       this.endDate = this.dates[1].date;

      }

    }
  
  }


  getStatus(){
    this.httpProvider.hasLoggedIn().then(hasLoggedIn => {
      console.log(hasLoggedIn);
        if(hasLoggedIn){
          this.httpProvider.getAzureID().then(azure =>{
            this.enable = true;
            this.azure_id = azure;
            console.log(azure);
            this.getUserID();
            this.root = FeedPage;
          });
        }else{
          this.enable = false;
          this.root = HomePage;
        }
        
    });
  }


  getUserID(){
    this.httpProvider.getJsonData('user/azure_id/'+this.azure_id).subscribe(
      result =>{
        console.log(result);
          this.userID = result[0].id;
          this.getLikeStatus();
      });
  }


  addToFav(){
    this.httpProvider.addItem(this.favEndpoint, JSON.stringify({product_id:this.productID, user_id:this.userID}))
      .subscribe(data => {
        console.log(data);
        this.liked = true;
      });
  }


getLikeStatus(){
  this.httpProvider.getJsonData(this.userEndpoint + this.userID + '/favorites-products?product_id=' + this.productID)
    .subscribe(result => {
      console.log(result);
      if (result != ""){
        this.liked = true;
      }else{
        this.liked = false;
      }
    });
}

firstTab(value){
  this.enableThird = false;
  this.enableSecond = false;
  this.startDate = value;

  if(this.timeStarts != ''){
    if(this.compareTime(this.timeStarts)){
      this.enableFirst = true;
      this.filteredFirstDate = false;
    }else{
      this.enableFirst = false;
      this.filteredFirstDate = true;
    }
  }
  
 
  console.log(this.startDate);

}

secondTab(value){
  this.enableFirst = false;
  this.enableThird = false;
  this.enableSecond = true;
  this.filteredFirstDate = false;
  this.startDate = value;
  console.log(this.startDate);

}

thirdTab(value){
  this.enableFirst = false;
  this.enableSecond = false;
  this.enableThird = true;
  this.filteredFirstDate = false;
  this.startDate = value;
  console.log(this.startDate);
}

secondEndTab(value){
  this.enableFirst = false;
  this.enableThird = false;
  this.enableSecond = true;
  this.endDate = value;
  console.log(this.endDate);

}

thirdEndTab(value){
  this.enableFirst = false;
  this.enableSecond = false;
  this.enableThird = true;
  this.endDate = value;
  console.log(this.endDate);
}

getDate(date, qty){
  var fecha:any = new Date(date);
  console.log("In miliseconds", fecha.getTime());
  fecha = fecha.getTime();
  fecha += 1000 * 60 * 60 * 24 * qty;
  console.log("Plus days", fecha);
  console.log("Formated Date", new Date(fecha));
  fecha = new Date(fecha);
  var dd = fecha.getDate();
  if(dd < 10){
    dd = '0' + dd;
  }
  var month = new Array();
    month[0] = "01";
    month[1] = "02";
    month[2] = "03";
    month[3] = "04";
    month[4] = "05";
    month[5] = "06";
    month[6] = "07";
    month[7] = "08";
    month[8] = "09";
    month[9] = "10";
    month[10] = "11";
    month[11] = "12";
  var year = fecha.getFullYear();
  console.log(year + '-' + month[fecha.getMonth()] + '-' + dd);
  return year + '-' + month[fecha.getMonth()] + '-' + dd;
} 

enableTabs(){
  if(this.startHour != null){
    if(this.pricePlan === 'hourly'){

    this.endDate = this.startDate;
    let hour = this.startHour.split(":");
    let hourNew = parseInt(hour[0]) + (this.daysQty);
    this.endHour = hourNew + ':' + hour[1] + ':' + hour[2];
    console.log(this.endHour);
    this.goToReservation();
    
    //this.enableEndDate = true;
    } else if(this.pricePlan === 'daily'){
      
            this.endDate = this.getDate(this.startDate, 1 + this.daysQty);
            this.endHour = this.startHour;
            this.goToReservation();
        }
        else if(this.pricePlan === 'weekly'){
          this.endDate = this.getDate(this.startDate, 1 + (this.daysQty * 7));
          this.endHour = this.startHour;
          this.goToReservation();

        }
          else if(this.pricePlan === 'monthly'){
            this.endDate = this.getDate(this.startDate, 1 + (this.daysQty * 30));
            this.endHour = this.startHour;
            this.goToReservation();
    }
   
 

  }else{
    this.presentAlert("You need to choose a start hour");
  }
  
}

setStartHour(value){
  this.startHour = value;
  console.log(this.startHour);
}

setEndHour(value){
  if(value <= this.startHour){
    this.presentAlert("Choose a end time later than " + this.startHour);
  }else{
    this.endHour = value;
    this.endDate = this.startDate;
  }

  console.log(value);
}

toggleEndDate(value){
  this.endDate = value;
  console.log(this.endDate);
}

presentAlert(message) {
  let alert = this.alertCtrl.create({
    title: 'Oops!',
    subTitle: message, 
    buttons: ['Dismiss']
  });
  alert.present();
}
goToReservation(){
  this.navCtrl.push(ReservationPage, {
    productID: this.productID,
    operatorName: this.operator_name,
    productName: this.productName,
    price: this.price,
    startDate: this.startDate,
    startHour: this.startHour,
    endDate: this.endDate,
    endHour: this.endHour,
    reservationCount: this.reserveCount,
    lat: this.lat,
    lng: this.lng,
    pricePlan: this.pricePlan,
    stars: this.stars,
    count_stars: this.count_stars,
    miles: this.miles,
    daysQty: this.daysQty,
    type: this.type
  });
}

diff(start, end):any {
  start = start.split(":");
  end = end.split(":");
  var startDate = new Date(0, 0, 0, start[0], start[1], 0);
  var endDate = new Date(0, 0, 0, end[0], end[1], 0);
  var diff = endDate.getTime() - startDate.getTime();
  var hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  var minutes = Math.floor(diff / 1000 / 60);
  var minPerc = (minutes / 60) * 100;

  // If using time pickers with 24 hours format, add the below line get exact hours
  if (hours < 0)
     hours = hours + 24;

  //return (hours <= 9 ? "0" : "") + hours + "." + (minutes <= 9 ? "0" : "") + minutes;
  return hours + '.' +  minPerc;
}
reservate(){
  if(this.endHour != null){
    console.log("Horas", this.diff(this.startHour, this.endHour));
    this.daysQty = this.diff(this.startHour, this.endHour);
    this.goToReservation();
  }else{
    this.presentAlert("You need to choose a end hour");

  }
}

request(){
  this.navCtrl.push(BookingInquiryPage, {
    productID: this.productID,
    operatorName: this.operator_name,
    productName: this.productName,
    stars: this.stars,
    count_stars: this.count_stars,
    miles: this.miles

  });
}

tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }

  // console.log(time[0] + time[1] + time[2] + time[5]);

  return time[0] + time[1] + time[2] + time[5]; // return adjusted time or original string
}

// openModal() {

//   let modal = this.modalCtrl.create(ChangeLocationPage);
//   modal.present();
//   modal.onDidDismiss(() => {
//     this.getStartDate();
//     this.loading = this.loadingCtrl.create({
//       content: "Please wait...",
//     });
//     this.loading.present();
//     this.enableDates = false;
//     this.dates = []; 
//   });
// }

updateDate(){ 

  console.log("Inicio", this.timeStarts);
  console.log("Testing", this.compareTime(this.timeStarts));
 

  if(this.timeStarts != ''){
    if(this.compareTime(this.timeStarts)){
      this.presentAlert("You need to choose a date later than today!");
    }else{
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img width="150" src="assets/imgs/placeholder.png" />
        <br>
        <h1 class="loader-text-center">Loading...</h1>`,
      });
      this.loading.present();
      this.enableDates = false;
      this.dates = [];
      this.enableFirst = false;
      this.filteredFirstDate = true;
      this.getDates(this.timeStarts);
    }
    
  }
 
}

compareTime(time) {
  return new Date() >= new Date(time); 
 }

updateEndDate(){
  if(this.timeEnd != null){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img width="150" src="assets/imgs/placeholder.png" />
      <br>
      <h1 class="loader-text-center">Loading...</h1>`,
    });
    this.loading.present();
    this.enableDates = false;
    this.datesEnd = [];
    this.getEndDates(this.timeEnd);
  }
 
}

// getStartDate(){
//   this.storage.get('startDate').then((val) => {
//     console.log(val);
//     if(val != null){
//         this.getDates(val);
//     }

//   });
// }


  getPricing(){
    
    this.httpProvider.getJsonData(this.pricingEndpoint + this.productID + '/prices')
      .subscribe(result => {
        console.log(result);
        if(result.length > 0){
          this.prices = result;
          this.getDates(this.timeStarts);
        }else{
          this.prices = result;
          this.enableInquiry = true;
          this.enableDates = false;  
          this.loading.dismiss();
        }
      });
  }

  choosePrice(price, pricePlan){
    console.log(price, pricePlan);
    this.pricesRow = false;
    this.price = price;
    this.pricePlan = pricePlan;
    if(pricePlan === 'hourly'){
      this.type = 'Hours';
    }else if(pricePlan === 'daily'){
      this.type = 'Days';
    }else if(pricePlan === 'monthly'){
      this.type = 'Months';

    }
    if(pricePlan.includes('hourly') == true){
        this.hourly = true;
      }else{
        this.hourly = false;
      }
    this.enablePicker = true;
  }


  updatePicker(){

    this.showPicker = true;
    this.picker.open();
  }

}
