
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Book } from '@/services/gutendxApi';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onBookClick: (book: Book) => void;
  onToggleFavorite: (bookId: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  isFavorite, 
  onBookClick, 
  onToggleFavorite 
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1" onClick={() => onBookClick(book)}>
            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-muted-foreground mb-2">
              de {book.authors.map(author => author.name).join(', ')}
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Limbă: {book.languages.join(', ')}</span>
              <span>Descărcări: {book.download_count.toLocaleString()}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(book.id);
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
