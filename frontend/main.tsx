import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './globals.css';
import { LanguageProvider } from './i18n.tsx';
import { AccessibilityProvider } from './accessibility.tsx';
import { TutorialProvider } from './TutorialProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <AccessibilityProvider>
        <TutorialProvider>
          <App />
        </TutorialProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  </React.StrictMode>
);

