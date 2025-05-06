export interface BookListItem {
  id: string;
  title?: string;
  authors?: string[];
  pagesRead?: number;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    pageCount?: number;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

export interface BookDetails {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    averageRating?: number;
    categories?: string[];
    pageCount?: number;
    subtitle?: string;
  };
}

export interface BookWithProgress extends BookDetails {
  pagesRead: number;
  totalPages: number;
}

export interface ReadBookDetails extends BookDetails {
  id: string;
  pagesRead: number;
  userRating: number | null;
  reviewText: string;
  reviewFull: boolean;
  totalPages: number;
}

export interface Review {
  rating: number;
  text: string;
}

export interface GoogleBooksApiResponse {
  items: GoogleBookItem[];
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: BookDetails['volumeInfo'];
}
