
import React, { useState, useEffect } from 'react';
import Scene3D from '@/components/Scene3D';
import UIOverlay from '@/components/UIOverlay';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [portalSearchQuery, setPortalSearchQuery] = useState<string>('');

  useEffect(() => {
    // Simulate initialization time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handlePanelChange = (panel: string | null) => {
    setActivePanel(panel);
  };

  const handlePortalClick = (portalType: string) => {
    console.log(`Portal activated: ${portalType}`);
    
    switch (portalType) {
      case 'altarulcautarii':
      case 'search':
        setPortalSearchQuery('');
        setActivePanel('search');
        break;
      case 'literaturaclasica':
        setPortalSearchQuery('literature fiction novel');
        setActivePanel('search');
        break;
      case 'stiintatehnologie':
        setPortalSearchQuery('science technology physics mathematics');
        setActivePanel('search');
        break;
      case 'istoriefilozofie':
        setPortalSearchQuery('history philosophy political science');
        setActivePanel('search');
        break;
      case 'colectiafavorite':
        setActivePanel('favorites');
        break;
      default:
        setPortalSearchQuery('');
        setActivePanel('search');
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <LoadingScreen isLoading={isLoading} />
      
      {!isLoading && (
        <>
          <Scene3D onPortalClick={handlePortalClick} />
          <UIOverlay 
            activePanel={activePanel} 
            onPanelChange={handlePanelChange}
            portalSearchQuery={portalSearchQuery}
          />
        </>
      )}
    </div>
  );
};

export default Index;
