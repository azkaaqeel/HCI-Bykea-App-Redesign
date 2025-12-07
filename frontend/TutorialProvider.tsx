import { createContext, useContext, useState, ReactNode } from 'react';
import { TutorialOverlay, TutorialStep } from './TutorialOverlay';
import { TutorialSelectionScreen } from './TutorialSelectionScreen';

interface TutorialContextType {
  isTutorialActive: boolean;
  showSelection: boolean;
  currentStep: number;
  startTutorial: (steps: TutorialStep[], onFinish?: () => void) => void;
  showSelectionScreen: () => void;
  nextStep: () => void;
  previousStep: () => void;
  closeTutorial: (isFinishingFlow?: boolean) => void;
  goToStep: (step: number) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
}

interface TutorialProviderProps {
  children: ReactNode;
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TutorialStep[]>([]);
  const [onFinishCallback, setOnFinishCallback] = useState<(() => void) | null>(null);

  const showSelectionScreen = () => {
    setShowSelection(true);
    setIsTutorialActive(false);
    setCurrentStep(0);
    setSteps([]);
  };

  const startTutorial = (tutorialSteps: TutorialStep[], onFinish?: () => void) => {
    setSteps(tutorialSteps);
    setCurrentStep(0);
    setIsTutorialActive(true);
    setShowSelection(false);
    setOnFinishCallback(() => onFinish || null);
  };

  const nextStep = () => {
    setCurrentStep((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  };

  const previousStep = () => {
    setCurrentStep((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  const closeTutorial = (isFinishingFlow: boolean = false) => {
    setIsTutorialActive(false);
    setCurrentStep(0);
    setSteps([]);
    
    // Only show selection screen if finishing flow via Finish button
    if (isFinishingFlow === true && onFinishCallback) {
      // Flow completed via Finish button - show selection screen again
      onFinishCallback();
      setOnFinishCallback(null);
    } else {
      // User closed manually (X button) or any other way - always navigate back to help-support
      window.dispatchEvent(new CustomEvent('tutorial-close-to-help'));
      setOnFinishCallback(null);
    }
  };


  return (
    <TutorialContext.Provider
      value={{
        isTutorialActive,
        showSelection,
        currentStep,
        startTutorial,
        showSelectionScreen,
        nextStep,
        previousStep,
        closeTutorial,
        goToStep,
      }}
    >
      {children}
      {showSelection && (
        <TutorialSelectionScreen
          onSelect={(flow) => {
            // Dispatch event for App.tsx to handle
            window.dispatchEvent(new CustomEvent('tutorial-select-flow', { detail: { flow } }));
          }}
          onClose={() => {
            setShowSelection(false);
            // Navigate back to help-support when closing from selection screen
            if (onFinishCallback) {
              onFinishCallback();
              setOnFinishCallback(null);
            } else {
              // Dispatch event to navigate back to help-support
              window.dispatchEvent(new CustomEvent('tutorial-close-to-help'));
            }
          }}
        />
      )}
      {isTutorialActive && steps.length > 0 && (
        <TutorialOverlay
          steps={steps}
          currentStep={currentStep}
          onNext={nextStep}
          onPrevious={previousStep}
          onClose={closeTutorial}
          isActive={isTutorialActive}
        />
      )}
    </TutorialContext.Provider>
  );
}

