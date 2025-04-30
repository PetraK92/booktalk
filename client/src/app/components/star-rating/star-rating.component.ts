import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Output() ratingChange = new EventEmitter<number>();

  decimalOptions: number[] = [0, 0.25, 0.5, 0.75];
  wholeOptions: number[] = [0, 1, 2, 3, 4, 5];

  selectedWhole: number = 0;
  selectedDecimal: number = 0;

  ngOnInit() {
    this.selectedWhole = Math.floor(this.rating);
    this.selectedDecimal = +(this.rating % 1).toFixed(2);
  }

  onDropdownChange() {
    const newRating = Number(this.selectedWhole) + Number(this.selectedDecimal);
    this.rating = newRating;
    this.ratingChange.emit(newRating);
  }

  calculateStarWidth(index: number): number {
    const diff = this.rating - index;
    const width = diff >= 1 ? 100 : diff > 0 ? diff * 100 : 0;
    return width;
  }
}
