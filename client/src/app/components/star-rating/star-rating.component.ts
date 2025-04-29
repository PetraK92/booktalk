import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],
})
export class StarRatingComponent {
  @Input() rating = 0; // Nuvarande sparade betyg
  @Output() ratingChange = new EventEmitter<number>(); // Event till förälder

  hoverRating = 0; // Tillfälligt betyg när man hovrar

  get displayRating() {
    return this.hoverRating || this.rating;
  }

  // Beräkna bredden för varje stjärna
  calculateStarWidth(i: number): number {
    return Math.min(Math.max((this.displayRating - i) * 100, 0), 100);
  }

  onMouseMove(event: MouseEvent, index: number) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;

    if (percent < 0.25) {
      this.hoverRating = index + 0.25;
    } else if (percent < 0.5) {
      this.hoverRating = index + 0.5;
    } else if (percent < 0.75) {
      this.hoverRating = index + 0.75;
    } else {
      this.hoverRating = index + 1;
    }
  }

  onMouseLeave() {
    this.hoverRating = 0;
  }

  onClick(index: number, event: MouseEvent) {
    this.onMouseMove(event, index); // Räkna ut exakt vart
    this.rating = this.hoverRating;
    this.ratingChange.emit(this.rating); // Skicka till förälder
  }
}
