import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservationDetailPage } from './reservation-detail';

@NgModule({
  declarations: [
    ReservationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservationDetailPage),
  ],
})
export class ReservationDetailPageModule {}
