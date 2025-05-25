
import React, { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { gutendexApi, Book } from '@/services/gutendexApi';
import { useFavoriteBooks } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

const FavoritesPanel: React.FC = () => {
  const [favoriteBooks, setFavoriteBooks] = useFavoriteBooks();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadFavoriteBooks = async () => {
    if (favoriteBooks.length === 0) return;
    
    setLoading(true);
    try {
      const bookPromises = favoriteBooks.map(id => gutendexApi.getBookById(id));
      const loadedBooks = await Promise.all(bookPromises);
      setBooks(loadedBooks);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu am putut încărca cărțile favorite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (bookId: number) => {
    setFavoriteBooks(prev => prev.filter(id => id !== bookId));
    setBooks(prev => prev.filter(book => book.id !== bookId));
    toast({
      title: "Eliminat",
      description: "Cartea a fost eliminată din favorite.",
    });
  };

  const clearAllFavorites = () => {
    setFavoriteBooks([]);
    setBooks([]);
    toast({
      title: "Șterse",
      description: "Toate cărțile favorite au fost șterse.",
    });
  };

  useEffect(() => {
    loadFavoriteBooks();
  }, [favoriteBooks.length]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="loading-orb mx-auto mb-4"></div>
        <p>Încărcare cărți favorite...</p>
      </div>
    );
  }

  if (favoriteBooks.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Nicio carte favorită</h3>
        <p className="text-muted-foreground mb-6">
          Începe să explorezi și adaugă cărți în colecția ta de favorite!
        </p>
        <Button onClick={() => window.location.reload()}>
          Explorează cărți
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {favoriteBooks.length} {favoriteBooks.length === 1 ? 'carte favorită' : 'cărți favorite'}
        </h3>
        {favoriteBooks.length > 0 && (
          <Button variant="destructive" size="sm" onClick={clearAllFavorites}>
            <Trash2 className="w-4 h-4 mr-2" />
            Șterge toate
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {books.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">{book.title}</h4>
                  <p className="text-muted-foreground mb-2">
                    de {book.authors.map(author => author.name).join(', ')}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Limbă: {book.languages.join(', ')}</span>
                    <span>Descărcări: {book.download_count.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://www.gutenberg.org/ebooks/${book.id}`, '_blank')}
                  >
                    Vezi carte
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFavorite(book.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPanel;
