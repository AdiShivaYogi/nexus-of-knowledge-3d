
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book } from '@/services/gutendxApi';
import BookCard from './BookCard';

interface SearchResultsProps {
  books: Book[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  favoriteBooks: number[];
  onBookClick: (book: Book) => void;
  onToggleFavorite: (bookId: number) => void;
  onLoadMore: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  books,
  totalCount,
  currentPage,
  loading,
  favoriteBooks,
  onBookClick,
  onToggleFavorite,
  onLoadMore
}) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {totalCount.toLocaleString()} cărți găsite
      </p>
      
      <div className="grid gap-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorite={favoriteBooks.includes(book.id)}
            onBookClick={onBookClick}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {books.length < totalCount && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            disabled={loading}
          >
            Încarcă mai multe
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
