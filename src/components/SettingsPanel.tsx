
import React, { useState } from 'react';
import { Key, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiKey, useFavoriteBooks, useSearchHistory } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

const SettingsPanel: React.FC = () => {
  const [apiKey, setApiKey] = useApiKey();
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [favoriteBooks, setFavoriteBooks] = useFavoriteBooks();
  const [searchHistory, setSearchHistory] = useSearchHistory();
  const { toast } = useToast();

  const saveApiKey = () => {
    setApiKey(tempApiKey);
    toast({
      title: "Salvat",
      description: "Cheia API a fost salvată cu succes.",
    });
  };

  const clearFavorites = () => {
    setFavoriteBooks([]);
    toast({
      title: "Șterse",
      description: "Toate cărțile favorite au fost șterse.",
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    toast({
      title: "Șters",
      description: "Istoricul căutărilor a fost șters.",
    });
  };

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Configurare API
          </CardTitle>
          <CardDescription>
            Configurează cheia API pentru funcționalitățile avansate (generare colecții AI)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api-key">Cheie API DeepSeek</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="api-key"
                type="password"
                placeholder="sk-..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={saveApiKey}>
                <Save className="w-4 h-4 mr-2" />
                Salvează
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cheia API va fi salvată local și folosită pentru generarea colecțiilor tematice.
            </p>
          </div>
          
          {apiKey && (
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✓ Cheia API este configurată și gata pentru utilizare
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Gestionare Date</CardTitle>
          <CardDescription>
            Administrează datele salvate local
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Cărți Favorite</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {favoriteBooks.length} {favoriteBooks.length === 1 ? 'carte salvată' : 'cărți salvate'}
              </p>
              <Button variant="destructive" size="sm" onClick={clearFavorites}>
                <Trash2 className="w-4 h-4 mr-2" />
                Șterge favorite
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Istoric Căutări</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {searchHistory.length} {searchHistory.length === 1 ? 'căutare salvată' : 'căutări salvate'}
              </p>
              <Button variant="destructive" size="sm" onClick={clearSearchHistory}>
                <Trash2 className="w-4 h-4 mr-2" />
                Șterge istoric
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>Despre Nexus al Cunoașterii</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              O bibliotecă digitală 3D interactivă care folosește API-ul Gutendx pentru a oferi acces la mii de cărți gratuite din Project Gutenberg.
            </p>
            <p>
              <strong>Funcționalități:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Căutare avansată în arhiva Gutendx</li>
              <li>Colecții tematice predefinite</li>
              <li>Salvare locală a cărților favorite</li>
              <li>Interfață 3D explorabilă</li>
              <li>Descărcări multiple de formate (EPUB, PDF, TXT)</li>
            </ul>
            <p className="text-xs">
              Versiunea 1.0 - Construit cu React, Three.js și shadcn/ui
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
