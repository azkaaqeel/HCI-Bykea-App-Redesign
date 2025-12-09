import { useEffect, useRef } from 'react';
import { useAccessibility } from './accessibility';
import { useTranslation } from './i18n';

/**
 * Hook for voice announcements
 * Provides functions to announce text to screen readers and speech synthesis
 */
export function useVoiceAnnouncements() {
  const { voiceAnnouncementsEnabled } = useAccessibility();
  const { language, t } = useTranslation();
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  /**
   * Announce text using both screen reader (aria-live) and speech synthesis
   */
  const announce = (text: string, priority: 'polite' | 'assertive' = 'polite', useSpeech: boolean = true) => {
    if (!voiceAnnouncementsEnabled) return;

    // Screen reader announcement via aria-live region
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = text;
      // Clear after announcement to allow re-announcement of same text
      setTimeout(() => {
        if (liveRegion.textContent === text) {
          liveRegion.textContent = '';
        }
      }, 1000);
    }

    // Speech synthesis announcement
    if (useSpeech && speechSynthesisRef.current) {
      // Cancel any ongoing speech
      if (currentUtteranceRef.current) {
        speechSynthesisRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on current app language
      utterance.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      
      // Set voice properties
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to find a voice matching the language
      const voices = speechSynthesisRef.current.getVoices();
      const preferredVoice = voices.find(
        (voice) => voice.lang.startsWith(language === 'ur' ? 'ur' : 'en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      currentUtteranceRef.current = utterance;
      speechSynthesisRef.current.speak(utterance);

      // Clear reference when done
      utterance.onend = () => {
        currentUtteranceRef.current = null;
      };

      utterance.onerror = () => {
        currentUtteranceRef.current = null;
      };
    }
  };

  /**
   * Announce page/screen change
   */
  const announcePageChange = (pageName: string) => {
    if (!pageName) return; // Don't announce empty page names
    announce(pageName, 'polite', true);
  };

  /**
   * Announce action completion
   */
  const announceAction = (action: string) => {
    announce(action, 'polite', true);
  };

  /**
   * Announce error
   */
  const announceError = (error: string) => {
    const announcement = t('voice.error', `Error: ${error}`);
    announce(announcement, 'assertive', true);
  };

  /**
   * Announce important information
   */
  const announceInfo = (info: string) => {
    announce(info, 'polite', true);
  };

  /**
   * Stop any ongoing announcements
   */
  const stop = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      currentUtteranceRef.current = null;
    }
  };

  return {
    announce,
    announcePageChange,
    announceAction,
    announceError,
    announceInfo,
    stop,
    enabled: voiceAnnouncementsEnabled,
  };
}

/**
 * Hook to announce page changes when component mounts
 */
export function usePageAnnouncement(pageName: string, dependencies: any[] = []) {
  const { announcePageChange, enabled } = useVoiceAnnouncements();

  useEffect(() => {
    if (enabled) {
      // Small delay to ensure page is fully rendered
      const timer = setTimeout(() => {
        announcePageChange(pageName);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [enabled, pageName, ...dependencies]);
}

