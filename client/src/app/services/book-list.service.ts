import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface BookList {
  currentlyReading: any[];
  tbr: any[];
  read: any[];
}

@Injectable({
  providedIn: 'root',
})
export class BookListService {
  private lists: BookList = {
    currentlyReading: [],
    tbr: [],
    read: [],
  };

  private listsSubject = new BehaviorSubject<BookList>(this.lists);

  constructor() {}

  // Uppdaterad addToList-metod för att acceptera ett helt bokobjekt
  addToList(list: 'currentlyReading' | 'tbr' | 'read', book: any) {
    if (!this.lists[list]) {
      this.lists[list] = [];
    }
    this.lists[list].push(book);
    this.listsSubject.next(this.lists); // Uppdatera listan
  }

  // Hämta alla listor
  getLists() {
    return this.listsSubject.asObservable();
  }
}
