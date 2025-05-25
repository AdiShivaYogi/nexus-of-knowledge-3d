import React from 'react';
import { Download, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Book } from '../services/gutendxApi';

interface BookDetailsViewProps {
  book: Book;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (bookId: number) => void;
}

const BookDetailsView: React.FC<BookDetailsViewProps> = ({
  book,
  isFavorite,
  onBack,
  onToggleFavorite
}) => {
  const getDownloadFormats = (book: Book) => {
    const formats = Object.entries(book.formats)
      .filter(([format, url]) => 
        format.includes('text/plain') || 
        format.includes('epub') || 
        format.includes('pdf') ||
        format.includes('html')
      )
      .map(([format, url]) => ({
        type: format.includes('epub') ? 'EPUB' : 
              format.includes('pdf') ? 'PDF' :
              format.includes('html') ? 'HTML' : 'TXT',
        url: url as string
      }));
    
    return formats;
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-4"
      >
        ← Înapoi la rezultate
      </Button>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
                <p className="text-lg text-muted-foreground mb-2">
                  de {book.authors.map(author => author.name).join(', ')}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Limbă: {book.languages.join(', ')}</span>
                  <span>Descărcări: {book.download_count.toLocaleString()}</span>
                </div>
              </div>
              
              <Button
                variant={isFavorite ? "default" : "outline"}
                onClick={() => onToggleFavorite(book.id)}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'În favorite' : 'Adaugă la favorite'}
              </Button>
            </div>

            {book.subjects.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Subiecte:</h3>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 10).map((subject, index) => (
                    <Badge key={index} variant="secondary">{subject}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-3">Formate disponibile pentru descărcare:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getDownloadFormats(book).map((format, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex items-center justify-center"
                    onClick={() => window.open(format.url, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {format.type}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`https://www.gutenberg.org/ebooks/${book.id}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Vezi pe Project Gutenberg
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDetailsView;
