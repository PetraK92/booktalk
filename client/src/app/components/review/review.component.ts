import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { BookService } from '../../services/book.service';
import { BookListService } from '../../services/book-list.service';
import { Review, ReadBookDetails } from '../../models/book.model';

import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StarRatingComponent],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  bookId: string = '';
  userRating: number = 0;
  userReview: string = '';
  bookDetails: ReadBookDetails | null = null;
  existingReview: Review | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookListService: BookListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.bookId = id;
        this.loadBookDetails();
        this.loadExistingReview();
      }
    });
  }

  private loadBookDetails() {
    this.bookService
      .getBookById(this.bookId)
      .subscribe((response: ReadBookDetails | null) => {
        if (response) {
          this.bookDetails = response;
        }
      });
  }

  private loadExistingReview() {
    this.bookListService
      .getUserReview(this.bookId)
      .subscribe((review: Review | null) => {
        if (review) {
          this.userRating = review.rating;
          this.userReview = review.text;
          this.existingReview = review;
        } else {
          this.existingReview = null;
        }
      });
  }

  saveReview() {
    if (!this.userReview.trim() || this.userRating === 0) {
      return;
    }

    const review: Review = { rating: this.userRating, text: this.userReview };

    if (this.existingReview) {
      this.bookListService
        .updateUserReview(this.bookId, review)
        .subscribe(() => {
          this.router.navigate([`/books/${this.bookId}`]);
        });
    } else {
      this.bookListService.saveUserReview(this.bookId, review).subscribe(() => {
        this.router.navigate([`/books/${this.bookId}`]);
      });
    }
  }
}
