import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { BookListService } from '../../services/book-list.service';
import { BookDetails } from '../../models/book.model';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, StarRatingComponent, FormsModule, RouterModule],
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  bookId: string = '';
  bookDetails: BookDetails | null = null;
  errorMessage: string = '';
  userRating: number = 0;
  userReview: string = '';
  confirmationMessage: string | null = null;
  hasReview: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookListService: BookListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            this.bookId = id;
            return this.bookService.getBookById(id);
          } else {
            this.errorMessage = 'Ingen bok-ID hittades.';
            throw new Error('No book ID provided');
          }
        })
      )
      .subscribe({
        next: (response: BookDetails) => {
          if (response && response.volumeInfo) {
            this.bookDetails = response;
            this.loadUserRating();
            this.loadUserReview();
          } else {
            this.errorMessage = 'Felaktiga bokdetaljer mottogs.';
          }
        },
        error: (err) => {
          console.error('Fel vid hämtning av bokdetaljer:', err);
          this.errorMessage = 'Kunde inte hämta bokdetaljer.';
        },
      });
  }

  addToList(list: 'currentlyReading' | 'tbr' | 'read') {
    if (this.bookDetails) {
      this.bookListService.addToList(list, this.bookDetails);
      this.showConfirmationMessage(`Boken har lagts till i ${list}`);
    }
  }

  onRatingChange(newRating: number) {
    console.log('Nytt användarbetyg:', newRating);
    this.userRating = newRating;
    this.bookListService.saveUserRating(this.bookId, newRating);
  }

  onReviewChange() {
    const review = {
      rating: this.userRating,
      text: this.userReview,
    };

    this.bookListService.saveUserReview(this.bookId, review).subscribe(() => {
      this.showConfirmationMessage('Recension sparad!');
    });
  }

  private loadUserRating() {
    if (this.bookDetails && this.bookId) {
      this.bookListService.getUserRating(this.bookId).subscribe((rating) => {
        this.userRating = rating || 0;
      });
    }
  }

  private loadUserReview() {
    if (this.bookDetails && this.bookId) {
      this.bookListService.getUserReview(this.bookId).subscribe((review) => {
        if (review && typeof review === 'object') {
          this.userReview = review.text || '';
          this.userRating = review.rating || 0;
          this.hasReview = true;
        } else {
          this.userReview = '';
          this.hasReview = false;
        }
      });
    }
  }

  private showConfirmationMessage(message: string) {
    this.confirmationMessage = message;
    setTimeout(() => {
      this.confirmationMessage = null;
    }, 3000);
  }

  goToReviewPage() {
    this.router.navigate([`/review/${this.bookId}`]);
  }
}
