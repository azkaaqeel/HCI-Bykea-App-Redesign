import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { ColorblindType, getColorblindCSSVars } from './colorTransformations';

type AccessibilityMode = 'normal' | 'colorblind' | 'high-contrast';

interface AccessibilityContextValue {
  mode: AccessibilityMode;
  setMode: (mode: AccessibilityMode) => void;
  colorblindType: ColorblindType;
  setColorblindType: (type: ColorblindType) => void;
  isColorblindMode: boolean;
  isHighContrast: boolean;
  voiceAnnouncementsEnabled: boolean;
  setVoiceAnnouncementsEnabled: (enabled: boolean) => void;
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

  const [colorblindType, setColorblindType] = useState<ColorblindType>(() => {
    if (typeof window === 'undefined') {
      return 'general';
    }
    const stored = window.localStorage.getItem('hci-colorblind-type');
    return (stored as ColorblindType) || 'general';
  });

  const [voiceAnnouncementsEnabled, setVoiceAnnouncementsEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return true; // Default to enabled
    }
    const stored = window.localStorage.getItem('hci-voice-announcements-enabled');
    return stored !== null ? stored === 'true' : true; // Default to enabled
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('hci-accessibility-mode', mode);
      window.localStorage.setItem('hci-colorblind-type', colorblindType);
      window.localStorage.setItem('hci-voice-announcements-enabled', String(voiceAnnouncementsEnabled));
      
      // Apply CSS classes to root element
      document.documentElement.classList.remove(
        'colorblind-mode',
        'colorblind-protanopia',
        'colorblind-deuteranopia',
        'colorblind-tritanopia',
        'colorblind-general',
        'high-contrast-mode'
      );
      
      if (mode === 'colorblind') {
        // Add general colorblind class
        document.documentElement.classList.add('colorblind-mode');
        // Add specific type class
        document.documentElement.classList.add(`colorblind-${colorblindType}`);
        
        // Apply CSS variables for the specific colorblind type
        const cssVars = getColorblindCSSVars(colorblindType);
        Object.entries(cssVars).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        // Force update elements with inline styles
        const updateColorElements = () => {
          // Update elements with brand green color
          const greenElements = document.querySelectorAll(
            '[class*="green"], [class*="00D47C"], [style*="#00D47C"], [style*="rgb(0, 212, 124)"]'
          );
          
          const replacementColor = cssVars['--color-success'];
          
          greenElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.style) {
              const computed = window.getComputedStyle(htmlEl);
              if (computed.backgroundColor.includes('rgb(0, 212') || 
                  computed.backgroundColor.includes('#00D47C') ||
                  computed.backgroundColor.includes('#00be6f')) {
                htmlEl.style.setProperty('background-color', replacementColor, 'important');
              }
              if (computed.color.includes('rgb(0, 212') || 
                  computed.color.includes('#00D47C') ||
                  computed.color.includes('#00be6f')) {
                htmlEl.style.setProperty('color', cssVars['--color-success-dark'], 'important');
              }
            }
          });
        };
        
        // Run immediately and after delays to catch dynamically rendered elements
        setTimeout(updateColorElements, 100);
        setTimeout(updateColorElements, 500);
        setTimeout(updateColorElements, 1000);
      } else if (mode === 'high-contrast') {
        document.documentElement.classList.add('high-contrast-mode');
      }
    }
  }, [mode, colorblindType, voiceAnnouncementsEnabled]);

  const value = useMemo<AccessibilityContextValue>(() => {
    return {
      mode,
      setMode,
      colorblindType,
      setColorblindType,
      isColorblindMode: mode === 'colorblind',
      isHighContrast: mode === 'high-contrast',
      voiceAnnouncementsEnabled,
      setVoiceAnnouncementsEnabled,
    };
  }, [mode, colorblindType, voiceAnnouncementsEnabled]);

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

