import React, { createContext, useContext } from 'react';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

interface ViewportContextType {
  viewport: ViewportMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const ViewportContext = createContext<ViewportContextType>({
  viewport: 'desktop',
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});

export const ViewportProvider: React.FC<{
  viewport?: ViewportMode;
  children: React.ReactNode;
}> = ({ viewport = 'desktop', children }) => {
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';
  const isDesktop = viewport === 'desktop';

  return (
    <ViewportContext.Provider value={{ viewport, isMobile, isTablet, isDesktop }}>
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = () => useContext(ViewportContext);

