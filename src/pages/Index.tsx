
import React, { useState, useEffect } from 'react';
import Scene3D from '@/components/Scene3D';
import UIOverlay from '@/components/UIOverlay';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);

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
        setActivePanel('search');
        break;
      case 'literaturaclasica':
        // TODO: Implement predefined collection search
        setActivePanel('search');
        break;
      case 'stiintatehnologie':
        // TODO: Implement science collection
        setActivePanel('search');
        break;
      case 'istoriefilozofie':
        // TODO: Implement history collection
        setActivePanel('search');
        break;
      case 'colectiafavorite':
        setActivePanel('favorites');
        break;
      default:
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
          />
        </>
      )}
    </div>
  );
};

export default Index;
