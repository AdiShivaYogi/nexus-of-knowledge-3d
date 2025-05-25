
import React, { useState, useEffect } from 'react';
import { Search, Download, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { gutendexApi, Book } from '@/services/gutendexApi';
import { useFavoriteBooks } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface SearchPanelProps {
  initialQuery?: string;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [favoriteBooks, setFavoriteBooks] = useFavoriteBooks();
  const { toast } = useToast();

  const searchBooks = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await gutendexApi.searchBooks(searchQuery, page);
      setBooks(response.results);
      setTotalCount(response.count);
      setCurrentPage(page);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu am putut căuta cărțile. Te rog încearcă din nou.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (bookId: number) => {
    setFavoriteBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
    
    const action = favoriteBooks.includes(bookId) ? 'eliminată din' : 'adăugată în';
    toast({
      title: "Succes",
      description: `Cartea a fost ${action} colecția de favorite.`,
    });
  };

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
        url
      }));
    
    return formats;
  };

  useEffect(() => {
    if (initialQuery) {
      searchBooks(initialQuery);
    }
  }, [initialQuery]);

  if (selectedBook) {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={() => setSelectedBook(null)}
          className="mb-4"
        >
          ← Înapoi la rezultate
        </Button>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                  <p className="text-lg text-muted-foreground mb-2">
                    de {selectedBook.authors.map(author => author.name).join(', ')}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Limbă: {selectedBook.languages.join(', ')}</span>
                    <span>Descărcări: {selectedBook.download_count.toLocaleString()}</span>
                  </div>
                </div>
                
                <Button
                  variant={favoriteBooks.includes(selectedBook.id) ? "default" : "outline"}
                  onClick={() => toggleFavorite(selectedBook.id)}
                >
                  <Heart className={`w-4 h-4 mr-2 ${favoriteBooks.includes(selectedBook.id) ? 'fill-current' : ''}`} />
                  {favoriteBooks.includes(selectedBook.id) ? 'În favorite' : 'Adaugă la favorite'}
                </Button>
              </div>

              {selectedBook.subjects.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Subiecte:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBook.subjects.slice(0, 10).map((subject, index) => (
                      <Badge key={index} variant="secondary">{subject}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Formate disponibile pentru descărcare:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {getDownloadFormats(selectedBook).map((format, index) => (
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
                onClick={() => window.open(`https://www.gutenberg.org/ebooks/${selectedBook.id}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Vezi pe Project Gutenberg
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <Input
          placeholder="Caută după titlu, autor, sau subiect..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchBooks(query)}
          className="flex-1"
        />
        <Button onClick={() => searchBooks(query)} disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          Caută
        </Button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="loading-orb mx-auto mb-4"></div>
          <p>Căutare în arhiva Gutendex...</p>
        </div>
      )}

      {books.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {totalCount.toLocaleString()} cărți găsite
          </p>
          
          <div className="grid gap-4">
            {books.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1" onClick={() => setSelectedBook(book)}>
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
                        toggleFavorite(book.id);
                      }}
                    >
                      <Heart className={`w-4 h-4 ${favoriteBooks.includes(book.id) ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {books.length < totalCount && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => searchBooks(query, currentPage + 1)}
                disabled={loading}
              >
                Încarcă mai multe
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
