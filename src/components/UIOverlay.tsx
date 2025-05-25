
import React, { useState } from 'react';
import { Search, Settings, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchPanel from './SearchPanel';
import FavoritesPanel from './FavoritesPanel';
import SettingsPanel from './SettingsPanel';

interface UIOverlayProps {
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
  portalSearchQuery?: string;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ activePanel, onPanelChange, portalSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickSearch = () => {
    if (searchQuery.trim()) {
      onPanelChange('search');
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-4 left-4 right-4 z-40 pointer-events-none">
        <div className="flex justify-between items-center">
          <div className="nexus-title text-2xl font-bold pointer-events-auto">
            Nexus al Cunoașterii
          </div>
          
          <div className="flex items-center space-x-4 pointer-events-auto">
            {/* Quick Search Bar */}
            <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-md rounded-lg px-4 py-2 mystical-glow">
              <Input
                placeholder="Caută o carte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
                className="w-64 bg-transparent border-none focus:ring-0"
              />
              <Button size="sm" variant="ghost" onClick={handleQuickSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Action Buttons */}
            <Button
              variant={activePanel === 'favorites' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPanelChange(activePanel === 'favorites' ? null : 'favorites')}
              className="mystical-glow"
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorite
            </Button>
            
            <Button
              variant={activePanel === 'settings' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPanelChange(activePanel === 'settings' ? null : 'settings')}
              className="mystical-glow"
            >
              <Settings className="w-4 h-4 mr-2" />
              Setări
            </Button>
          </div>
        </div>
      </div>

      {/* Instructions Panel */}
      <div className="fixed bottom-4 left-4 z-40 pointer-events-auto">
        <Card className="bg-card/80 backdrop-blur-md mystical-glow">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p><kbd className="px-2 py-1 bg-muted rounded text-xs">Click</kbd> pe obiectele 3D pentru interacțiune</p>
              <p><kbd className="px-2 py-1 bg-muted rounded text-xs">Drag</kbd> pentru rotire • <kbd className="px-2 py-1 bg-muted rounded text-xs">Scroll</kbd> pentru zoom</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Panel */}
      {activePanel && (
        <div className="fixed inset-0 z-50 pointer-events-auto">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" onClick={() => onPanelChange(null)} />
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <Card className="mystical-glow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="nexus-title">
                  {activePanel === 'search' && 'Căutare în Arhiva Gutendx'}
                  {activePanel === 'favorites' && 'Colecția Ta de Favorite'}
                  {activePanel === 'settings' && 'Configurări Portal'}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => onPanelChange(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto">
                {activePanel === 'search' && (
                  <SearchPanel 
                    initialQuery={portalSearchQuery || searchQuery} 
                    portalType={portalSearchQuery ? 'portal' : 'manual'}
                  />
                )}
                {activePanel === 'favorites' && <FavoritesPanel />}
                {activePanel === 'settings' && <SettingsPanel />}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default UIOverlay;
