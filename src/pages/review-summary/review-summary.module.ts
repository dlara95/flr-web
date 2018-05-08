import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewSummaryPage } from './review-summary';

@NgModule({
  declarations: [
    ReviewSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewSummaryPage),
  ],
})
export class ReviewSummaryPageModule {}
