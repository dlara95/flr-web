import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleReviewPage } from './single-review';

@NgModule({
  declarations: [
    SingleReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleReviewPage),
  ],
})
export class SingleReviewPageModule {}
