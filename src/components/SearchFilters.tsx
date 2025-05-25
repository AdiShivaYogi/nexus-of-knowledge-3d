
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export interface SearchFilters {
  language: string;
  subject: string;
  author: string;
  copyrightFilter: string;
  sortBy: string;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({ onFiltersChange, filters }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      language: '',
      subject: '',
      author: '',
      copyrightFilter: '',
      sortBy: 'download_count'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== 'download_count').length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filtre avansate
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                {activeFiltersCount}
              </span>
            )}
          </div>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <Card className="mt-2">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Limbă</label>
                <Select value={filters.language} onValueChange={(value) => handleFilterChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează limba" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toate limbile</SelectItem>
                    <SelectItem value="en">Engleză</SelectItem>
                    <SelectItem value="fr">Franceză</SelectItem>
                    <SelectItem value="de">Germană</SelectItem>
                    <SelectItem value="es">Spaniolă</SelectItem>
                    <SelectItem value="it">Italiană</SelectItem>
                    <SelectItem value="pt">Portugheză</SelectItem>
                    <SelectItem value="ru">Rusă</SelectItem>
                    <SelectItem value="zh">Chineză</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subiect</label>
                <Select value={filters.subject} onValueChange={(value) => handleFilterChange('subject', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează subiectul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toate subiectele</SelectItem>
                    <SelectItem value="fiction">Ficțiune</SelectItem>
                    <SelectItem value="science">Știință</SelectItem>
                    <SelectItem value="history">Istorie</SelectItem>
                    <SelectItem value="philosophy">Filozofie</SelectItem>
                    <SelectItem value="poetry">Poezie</SelectItem>
                    <SelectItem value="drama">Dramă</SelectItem>
                    <SelectItem value="biography">Biografie</SelectItem>
                    <SelectItem value="children">Cărți pentru copii</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Autor</label>
                <Input
                  placeholder="Numele autorului..."
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status drept de autor</label>
                <Select value={filters.copyrightFilter} onValueChange={(value) => handleFilterChange('copyrightFilter', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează statusul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toate</SelectItem>
                    <SelectItem value="false">Domeniu public</SelectItem>
                    <SelectItem value="true">Sub drept de autor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sortare după</label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="download_count">Popularitate</SelectItem>
                    <SelectItem value="title">Titlu</SelectItem>
                    <SelectItem value="-title">Titlu (descendent)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Resetează filtrele
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SearchFiltersComponent;
