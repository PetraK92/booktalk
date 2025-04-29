import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';
import { BookListService } from '../services/book-list.service';
import { StarRatingComponent } from '../components/star-rating/star-rating.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Importera Observable

@Component({
  standalone: true,
  imports: [StarRatingComponent, FormsModule, CommonModule],
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  bookId: string = '';
  userRating: number = 0;
  userReview: string = '';
  bookDetails: any = null;
  existingReview: any = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookListService: BookListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Hämtar bok-id från URL och bokdetaljer
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.bookId = id;
        this.loadBookDetails();
        this.loadExistingReview();
      }
    });
  }

  // Ladda bokdetaljer
  private loadBookDetails() {
    this.bookService.getBookById(this.bookId).subscribe((response: any) => {
      if (response && response.volumeInfo) {
        this.bookDetails = response.volumeInfo;
      }
    });
  }

  // Ladda eventuell befintlig recension
  private loadExistingReview() {
    this.bookListService.getUserReview(this.bookId).subscribe((review: any) => {
      if (review) {
        this.userRating = review.rating;
        this.userReview = review.text;
        this.existingReview = review;
      }
    });
  }

  // Spara eller uppdatera recension
  saveReview() {
    if (!this.userReview.trim() || this.userRating === 0) {
      return; // Om recensionen är tom eller inget betyg valts, gör inget
    }

    const review = { rating: this.userRating, text: this.userReview };

    // Om det finns en befintlig recension, uppdatera den
    if (this.existingReview) {
      this.bookListService
        .updateUserReview(this.bookId, review)
        .subscribe(() => {
          this.router.navigate([`/books/${this.bookId}`]); // Navigera tillbaka till bokdetaljsidan
        });
    } else {
      // Annars skapa en ny recension
      this.bookListService.saveUserReview(this.bookId, review).subscribe(() => {
        this.router.navigate([`/books/${this.bookId}`]); // Navigera tillbaka till bokdetaljsidan
      });
    }
  }
}
