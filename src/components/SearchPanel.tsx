
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Book } from '@/services/gutendxApi';
import { useFavoriteBooks } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import SearchFiltersComponent, { SearchFilters } from './SearchFilters';
import BookDetailsView from './BookDetailsView';
import SearchResults from './SearchResults';

interface SearchPanelProps {
  initialQuery?: string;
  portalType?: 'manual' | 'portal';
}

const SearchPanel: React.FC<SearchPanelProps> = ({ initialQuery = '', portalType = 'manual' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [favoriteBooks, setFavoriteBooks] = useFavoriteBooks();
  const [filters, setFilters] = useState<SearchFilters>({
    language: '',
    subject: '',
    author: '',
    copyrightFilter: '',
    sortBy: 'download_count'
  });
  const { toast } = useToast();

  const buildSearchUrl = (searchQuery: string, page: number = 1, searchFilters: SearchFilters) => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery);
    }
    
    if (searchFilters.language) {
      params.append('languages', searchFilters.language);
    }
    
    if (searchFilters.subject) {
      params.append('topic', searchFilters.subject);
    }
    
    if (searchFilters.author) {
      params.append('search', `${searchQuery} ${searchFilters.author}`.trim());
    }
    
    if (searchFilters.copyrightFilter) {
      params.append('copyright', searchFilters.copyrightFilter);
    }
    
    if (searchFilters.sortBy && searchFilters.sortBy !== 'download_count') {
      params.append('sort', searchFilters.sortBy);
    }
    
    params.append('page', page.toString());
    
    return `https://gutendx.com/books/?${params.toString()}`;
  };

  const searchBooks = async (searchQuery: string, page: number = 1, searchFilters: SearchFilters = filters) => {
    if (!searchQuery.trim() && !searchFilters.subject && !searchFilters.author) return;
    
    setLoading(true);
    try {
      const url = buildSearchUrl(searchQuery, page, searchFilters);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBooks(data.results || []);
      setTotalCount(data.count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Search error:', error);
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

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (query.trim() || newFilters.subject || newFilters.author) {
      searchBooks(query, 1, newFilters);
    }
  };

  const handleLoadMore = () => {
    searchBooks(query, currentPage + 1);
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      searchBooks(initialQuery);
    }
  }, [initialQuery]);

  if (selectedBook) {
    return (
      <BookDetailsView
        book={selectedBook}
        isFavorite={favoriteBooks.includes(selectedBook.id)}
        onBack={() => setSelectedBook(null)}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  return (
    <div className="space-y-6">
      {portalType === 'portal' && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-primary">
            🔮 Ai activat un portal tematic! Rezultatele sunt filtrate pentru această categorie.
          </p>
        </div>
      )}

      <div className="space-y-4">
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

        <SearchFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="loading-orb mx-auto mb-4"></div>
          <p>Căutare în arhiva Gutendx...</p>
        </div>
      )}

      <SearchResults
        books={books}
        totalCount={totalCount}
        currentPage={currentPage}
        loading={loading}
        favoriteBooks={favoriteBooks}
        onBookClick={setSelectedBook}
        onToggleFavorite={toggleFavorite}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default SearchPanel;
