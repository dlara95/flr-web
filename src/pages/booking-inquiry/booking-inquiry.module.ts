import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingInquiryPage } from './booking-inquiry';

@NgModule({
  declarations: [
    BookingInquiryPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingInquiryPage),
  ],
})
export class BookingInquiryPageModule {}
