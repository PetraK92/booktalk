import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../book.service';
import { BookListService } from '../../services/book-list.service';
import { BookDetails } from './book.model';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component'; // Importera StarRatingComponent
import { FormsModule } from '@angular/forms'; // Lägg till FormsModule här

@Component({
  standalone: true,
  imports: [CommonModule, StarRatingComponent, FormsModule, RouterModule], // Lägg till FormsModule här för ngModel
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  bookId: string = '';
  bookDetails: BookDetails | null = null;
  errorMessage: string = '';
  userRating: number = 0; // Variabel för användarens betyg
  userReview: string = ''; // Variabel för användarens recension
  confirmationMessage: string | null = null; // Bekräftelsemeddelande

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookListService: BookListService,
    private router: Router // Lägg till Router för navigering
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            this.bookId = id;
            return this.bookService.getBookById(id); // Hämtar bokdetaljer
          } else {
            this.errorMessage = 'Ingen bok-ID hittades.';
            throw new Error('No book ID provided');
          }
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response && response.volumeInfo) {
            this.bookDetails = response.volumeInfo;
            this.loadUserRating(); // Hämta användarbetyg när boken laddas
            this.loadUserReview(); // Hämta användarens recension om den finns
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

  // Lägg till boken i rätt lista och visa bekräftelsemeddelande
  addToList(list: 'currentlyReading' | 'tbr' | 'read') {
    if (this.bookDetails) {
      this.bookListService.addToList(list, { id: this.bookId });
      this.showConfirmationMessage(`Boken har lagts till i ${list}`); // Bekräftelse
    }
  }

  // Hantera ratingändring och spara det
  onRatingChange(newRating: number) {
    console.log('Nytt användarbetyg:', newRating);
    this.userRating = newRating;
    this.bookListService.saveUserRating(this.bookId, newRating);
  }

  // Spara användarens recension
  onReviewChange() {
    const review = {
      rating: this.userRating, // Lägg till betyg
      text: this.userReview, // Lägg till recensionstext
    };

    this.bookListService.saveUserReview(this.bookId, review).subscribe(() => {
      this.showConfirmationMessage('Recension sparad!');
    });
  }

  // Hämta användarens betyg för denna bok
  private loadUserRating() {
    if (this.bookDetails && this.bookId) {
      this.bookListService.getUserRating(this.bookId).subscribe((rating) => {
        this.userRating = rating || 0; // Om inget betyg finns, sätt till 0
      });
    }
  }

  // Hämta användarens recension för denna bok
  private loadUserReview() {
    if (this.bookDetails && this.bookId) {
      this.bookListService.getUserReview(this.bookId).subscribe((review) => {
        // Om review inte är en sträng, sätt den till en tom sträng
        this.userReview = typeof review === 'string' ? review : '';
      });
    }
  }

  // Visa bekräftelsemeddelande och dölja det efter en viss tid
  private showConfirmationMessage(message: string) {
    this.confirmationMessage = message;
    setTimeout(() => {
      this.confirmationMessage = null; // Döljer bekräftelsemeddelandet efter 3 sekunder
    }, 3000);
  }

  // Lägg till denna metod för att navigera till recensionssidan
  goToReviewPage() {
    this.router.navigate([`/review/${this.bookId}`]); // Navigera till en sida för recensioner
  }
}
