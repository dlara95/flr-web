import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyReservationPage } from './modify-reservation';

@NgModule({
  declarations: [
    ModifyReservationPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyReservationPage),
  ],
})
export class ModifyReservationPageModule {}
