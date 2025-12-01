import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

type AccessibilityMode = 'normal' | 'colorblind' | 'high-contrast';

interface AccessibilityContextValue {
  mode: AccessibilityMode;
  setMode: (mode: AccessibilityMode) => void;
  isColorblindMode: boolean;
  isHighContrast: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: ProviderProps) {
  const [mode, setMode] = useState<AccessibilityMode>(() => {
    if (typeof window === 'undefined') {
      return 'normal';
    }
    const stored = window.localStorage.getItem('hci-accessibility-mode');
    return (stored as AccessibilityMode) || 'normal';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('hci-accessibility-mode', mode);
      // Apply CSS class to root element for styling
      document.documentElement.classList.remove('colorblind-mode', 'high-contrast-mode');
      
      if (mode === 'colorblind') {
        document.documentElement.classList.add('colorblind-mode');
        // Force update green elements to blue
        const updateGreenElements = () => {
          const greenElements = document.querySelectorAll('[class*="green"], [class*="00D47C"], [style*="#00D47C"], [style*="rgb(0, 212, 124)"]');
          greenElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.style) {
              const computed = window.getComputedStyle(htmlEl);
              if (computed.backgroundColor.includes('rgb(0, 212') || computed.backgroundColor.includes('#00D47C')) {
                htmlEl.style.setProperty('background-color', '#2563eb', 'important');
              }
              if (computed.color.includes('rgb(0, 212') || computed.color.includes('#00D47C')) {
                htmlEl.style.setProperty('color', '#1e40af', 'important');
              }
            }
          });
        };
        // Run immediately and after a short delay to catch dynamically rendered elements
        setTimeout(updateGreenElements, 100);
        setTimeout(updateGreenElements, 500);
      } else if (mode === 'high-contrast') {
        document.documentElement.classList.add('high-contrast-mode');
      }
    }
  }, [mode]);

  const value = useMemo<AccessibilityContextValue>(() => {
    return {
      mode,
      setMode,
      isColorblindMode: mode === 'colorblind',
      isHighContrast: mode === 'high-contrast',
    };
  }, [mode]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

