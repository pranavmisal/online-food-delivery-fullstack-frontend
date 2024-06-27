import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-review-rating',
  templateUrl: './review-rating.component.html',
  styleUrls: ['./review-rating.component.scss']
})
export class ReviewRatingComponent {
  public review!: string;

  @Output() reviewSubmitted = new EventEmitter<{rating: number, review: string}>();

  public stars = [1,2,3,4,5];
  public selectedStarIndex!: number;

  constructor(){}

  public rate(index: number){
    this.selectedStarIndex = index;
  }

  public submitReview(){
    this.reviewSubmitted.emit({rating: parseFloat(this.selectedStarIndex.toFixed(1)), review: this.review});
    this.review = '';
    this.selectedStarIndex;
  }
}
