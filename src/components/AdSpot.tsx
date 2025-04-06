import React, { useEffect, useState } from 'react';
import { getActiveAdForSpot, updateAdSpotClickCount } from '../lib/storage';

interface AdSpotProps {
  name: string;
  className?: string;
}

export function AdSpot({ name, className = '' }: AdSpotProps) {
  const [adContent, setAdContent] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const ad = getActiveAdForSpot(name);
    if (ad) {
      setAdContent(ad.content);
    }
  }, [name]);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount % 2 === 1) {
      updateAdSpotClickCount(name);
      if (adContent) {
        window.open(adContent, '_blank');
      }
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {adContent && adContent.startsWith('<iframe') ? (
        <div dangerouslySetInnerHTML={{ __html: adContent }} />
      ) : (
        <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
          <span className="text-gray-400">Advertisement</span>
        </div>
      )}
    </div>
  );
}