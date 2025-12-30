import React from 'react';
import { motion } from 'framer-motion';
import { DiscoverHeader } from './DiscoverHeader';

interface DiscoverLayoutProps {
  children: React.ReactNode;
  headerProps: {
    onFilter: () => void;
    onLocation: () => void;
    onWishlist: () => void;
    activeCategory: string;
    setActiveTab: (t: any) => void;
    activeTab: string;
    wishlistCount: number;
  };
  bottomNav: React.ReactNode;
  floatingControls?: React.ReactNode;
}

export const DiscoverLayout: React.FC<DiscoverLayoutProps> = ({ 
  children, 
  headerProps, 
  bottomNav,
  floatingControls 
}) => {
  return (
    <div className="h-[100svh] bg-white flex flex-col overflow-hidden relative">
      <DiscoverHeader {...headerProps} />
      
      <main className="flex-1 relative overflow-hidden flex flex-col px-2">
        {children}
        {floatingControls && (
          <div className="absolute bottom-3 left-0 right-0 z-[110] flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
              {floatingControls}
            </div>
          </div>
        )}
      </main>

      <div className="shrink-0 z-[130]">
        {bottomNav}
      </div>
    </div>
  );
};
