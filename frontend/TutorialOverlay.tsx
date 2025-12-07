import { useEffect, useRef, useState } from 'react';
import { X, ChevronRight, ChevronLeft } from './ui/icons';
import { useTranslation } from './i18n';

export interface TutorialStep {
  id: string;
  screen: string;
  target?: string; // CSS selector or element ID
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  title: string;
  description: string;
  action?: () => void; // Action to perform when step is shown
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: (isFinishingFlow?: boolean) => void;
  isActive: boolean;
}

export function TutorialOverlay({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onClose,
  isActive,
}: TutorialOverlayProps) {
  const { t } = useTranslation();
  const [position, setPosition] = useState({ top: 0, left: 0, arrow: 'bottom' as const });
  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  useEffect(() => {
    if (!isActive || !step) return;

    let cleanup: (() => void) | null = null;

    // Wait a bit for screen to render
    const timeoutId = setTimeout(() => {
      // Find target element
      let targetElement: HTMLElement | null = null;
      
      if (step.target) {
        // Try as ID first
        targetElement = document.getElementById(step.target);
        // If not found, try as CSS selector
        if (!targetElement) {
          targetElement = document.querySelector(step.target) as HTMLElement;
        }
      }

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const popupRect = popupRef.current?.getBoundingClientRect();
        const popupHeight = popupRect?.height || 200;
        const popupWidth = popupRect?.width || 300;

        let top = 0;
        let left = 0;
        let arrow: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

        switch (step.position) {
          case 'top':
            top = rect.top - popupHeight - 20;
            left = rect.left + rect.width / 2 - popupWidth / 2;
            arrow = 'bottom';
            break;
          case 'bottom':
            top = rect.bottom + 20;
            left = rect.left + rect.width / 2 - popupWidth / 2;
            arrow = 'top';
            break;
          case 'left':
            top = rect.top + rect.height / 2 - popupHeight / 2;
            left = rect.left - popupWidth - 20;
            arrow = 'right';
            break;
          case 'right':
            top = rect.top + rect.height / 2 - popupHeight / 2;
            left = rect.right + 20;
            arrow = 'left';
            break;
          case 'center':
          default:
            top = window.innerHeight / 2 - popupHeight / 2;
            left = window.innerWidth / 2 - popupWidth / 2;
            arrow = 'bottom';
            break;
        }

        // Keep popup within viewport
        top = Math.max(20, Math.min(top, window.innerHeight - popupHeight - 20));
        left = Math.max(20, Math.min(left, window.innerWidth - popupWidth - 20));

        setPosition({ top, left, arrow });

        // Highlight target element
        targetElement.style.transition = 'all 0.3s ease';
        targetElement.style.boxShadow = '0 0 0 4px rgba(0, 212, 124, 0.3), 0 0 20px rgba(0, 212, 124, 0.2)';
        targetElement.style.zIndex = '9998';
        targetElement.style.position = 'relative';

        cleanup = () => {
          if (targetElement) {
            targetElement.style.boxShadow = '';
            targetElement.style.zIndex = '';
            targetElement.style.position = '';
          }
        };
      } else {
        // Center if no target
        setPosition({
          top: window.innerHeight / 2 - 200,
          left: window.innerWidth / 2 - 300,
          arrow: 'bottom',
        });
      }
    }, 300); // Wait 300ms for screen to render

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
  }, [isActive, step, currentStep]);

  useEffect(() => {
    if (isActive && step?.action) {
      step.action();
    }
  }, [isActive, step, currentStep]);

  if (!isActive || !step) return null;

  return (
    <>
      {/* Backdrop - no blur so user can see what popup refers to */}
      <div
        className="fixed inset-0 bg-black/30 z-[9997]"
        onClick={onClose}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className="fixed z-[9999] bg-white rounded-2xl shadow-2xl p-6 max-w-sm animate-in fade-in zoom-in duration-300"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - always navigates back to help-support */}
        <button
          onClick={() => {
            // Pass false to indicate manual close (not finishing flow)
            onClose();
          }}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Arrow pointing to target */}
        {step.target && step.position !== 'center' && (
          <div
            className={`absolute w-0 h-0 border-8 ${
              position.arrow === 'top'
                ? 'border-b-white -top-4 left-1/2 -translate-x-1/2'
                : position.arrow === 'bottom'
                ? 'border-t-white -bottom-4 left-1/2 -translate-x-1/2'
                : position.arrow === 'left'
                ? 'border-r-white -left-4 top-1/2 -translate-y-1/2'
                : 'border-l-white -right-4 top-1/2 -translate-y-1/2'
            }`}
          />
        )}

        {/* Content */}
        <div className="pr-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#00D47C] flex items-center justify-center text-white font-bold text-sm">
              {currentStep + 1}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{t(step.title, step.title)}</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {t(step.description, step.description)}
          </p>

          {/* Progress indicator */}
          <div className="mb-4">
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    idx <= currentStep ? 'bg-[#00D47C]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {currentStep + 1} / {steps.length}
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={onPrevious}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {t('tutorial.previous', 'Previous')}
              </button>
            )}
            <button
              onClick={() => {
                if (isLast) {
                  // When finishing flow, pass true to show selection screen again
                  onClose(true);
                } else {
                  onNext();
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                isLast
                  ? 'bg-[#00D47C] hover:bg-[#00be6f] text-white'
                  : 'bg-[#00D47C] hover:bg-[#00be6f] text-white'
              }`}
            >
              {isLast ? (
                <>
                  {t('tutorial.finish', 'Finish')}
                  <X className="w-4 h-4" />
                </>
              ) : (
                <>
                  {t('tutorial.next', 'Next')}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

