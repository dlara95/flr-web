import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { FeedPage } from '../../pages/feed/feed';
import { App } from 'ionic-angular';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
declare var WindowsAzure: any;

@Injectable()
export class UsersProvider {
  HAS_LOGGED_IN = 'hasLoggedIn';
	base:string = 'https://reserverentals.com/api/';
	client: any;
	userid: string;
  loggedIn: boolean = false;
	appUrl:any = 'https://find-local-rentals.azurewebsites.net';
	fbToken:any;
	user:any;
	azure_id:any;
	provider:any;

  constructor(public http: Http, private storage: Storage, public app: App) {
    console.log('Hello UsersProvider Provider');
  }

  

  getTwitterData(twitterId){
    this.http.get('https://api.twitter.com/1.1/account/verify_credentials.json').subscribe(
      user => {
        console.log(user);
        //this.user = JSON.parse(user['_body']);
        //this.saveNewUser('user', this.user.name, this.user.first_name, this.user.email, this.user.picture.data.url, this.azure_id);
  
      }
    )
  }

  getUsername(): Promise<string> {  
    return this.storage.get('username').then((value) => {
      return value;
    });
  }
  
  getAzureID(): Promise<string> {  
    return this.storage.get('azureid').then((value) => {
      return value;
    });
  }

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
}

  getJsonData(endpoint){
    return this.http.get(this.base + endpoint).map(res => res.json());
}

saveNewUser(endpoint, name, username, email, photo_url, azure_id){
  //let nav = this.app.getActiveNav();

  var headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8' );
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    let options = new RequestOptions({ headers: headers });
  let userData = {name: name, username: username, email: email, photo_url: photo_url, azure_id: azure_id};
  console.log(userData);
  return this.http.post(encodeURI(this.base + endpoint), userData, options)
    .map(res => res.json())
    
}

updateUser(endpoint, name,username, email, password, photo_url, phone){
  var headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8' );
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  let userData = {name: name, username: username, email: email, photo_url: photo_url, password:password, phone:phone};
  console.log(userData);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(encodeURI(this.base + endpoint), userData, options)
    .map(res => res.json())
}

addItem(endpoint, data){
  console.log(data);
  var headers = new Headers();
headers.append('Content-Type', 'application/json' );
headers.append('Accept', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  let options = new RequestOptions({ headers: headers });
  
  
    return this.http.post(this.base + endpoint, data, options)
  .map(res => res.json())
  .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any

  
}

removeItem(endpoint, recordID){
  var headers = new Headers();
   headers.append('Content-Type', 'application/json' );
   let options = new RequestOptions({ headers: headers });
          return this.http.delete(this.base + endpoint + '/' + recordID, options)
                .map(res => res.json())
                .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
 
   
}


load(endpoint){
console.log(this.base + endpoint);
return new Promise(resolve => {
  this.http.get(this.base + endpoint)
    .map(res => res.json())
    .subscribe(data => {
      console.log(data);
        resolve(data);
    });
});

}


updateItem(endpoint, data){
  var _authdata = btoa('testing' + ':' + 'testing123');
  console.log(_authdata);
  var headers = new Headers();
  headers.append('Authorization', 'Basic ' + _authdata);
  headers.append('Content-Type', 'application/json' );
  headers.append('Access-Control-Allow-Origin', '*');

  // headers.append('Accept', 'application/json');
  // headers.append('Access-Control-Allow-Origin', '*');
    let options = new RequestOptions({ headers: headers });
    
      return this.http.put(endpoint, data, options)
    .map(res => res.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
}

}
