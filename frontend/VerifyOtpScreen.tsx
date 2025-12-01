import { useRef, useState } from 'react';
import { ArrowLeft } from './ui/icons';

interface VerifyOtpScreenProps {
  onBack: () => void;
  onVerified: () => void;
}

export function VerifyOtpScreen({ onBack, onVerified }: VerifyOtpScreenProps) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const updateDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // allow single digit or empty
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const code = digits.join('');
  const isComplete = code.length === 4;

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-gray-100 flex flex-col items-center justify-center">
      {/* Green header */}
      <div className="absolute top-0 inset-x-0 h-40 bg-[#00A859] rounded-b-[40px]" />

      <div className="relative w-full px-6">
        <div className="bg-white rounded-[32px] shadow-xl p-6 pt-8 pb-10">
          {/* Back button */}
          <button
            onClick={onBack}
            className="mb-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Code inputs */}
          <div className="flex justify-between mb-8 mx-4">
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                className="w-10 border-b-2 border-gray-200 text-center text-xl font-semibold text-gray-900 focus:outline-none focus:border-[#00A859]"
                value={digits[idx]}
                onChange={(e) => updateDigit(idx, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
                    inputsRef.current[idx - 1]?.focus();
                  }
                }}
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            onClick={onVerified}
            disabled={!isComplete}
            className={`w-full rounded-2xl py-3 text-sm font-semibold ${
              isComplete
                ? 'bg-[#00A859] text-white shadow-md hover:bg-[#00964d]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );
}


