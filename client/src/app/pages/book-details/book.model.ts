export interface BookDetails {
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
  id?: string;
}
