
# Find Local Rentals

## Requirements

```
Ionic version 3.16.0
Node v8.8.1
Cordova version 6.5.0
```

## Getting started

```
$ git clone https://github.com/senorcoders/FLR
$ cd FLR
$ npm install
```

## Running on Android Device

 ```
 $ ionic cordova platform add android
 $ ionic cordova run android --device --livereload
 ```

 ## Running on IOS Device

 ```
 $ ionic cordova platform add ios
 $ ionic cordova run ios --device --livereload
 ```

  ## Endpoints used

 ```
  Booking Inquiry => /api/inquiry
  Favorites       => /api/user/:userid/favorites-products
  Locations       => /api/location/by_distance/:lat/:lng/:distance
  Reservation     => /api/reservation
  Guest           => /api/guest
  Dates           => /api/services-dates/next-dates/:productid/:date
  Pricing         => /api/product/:productid/prices
  Payment         => /api/payment
 ```