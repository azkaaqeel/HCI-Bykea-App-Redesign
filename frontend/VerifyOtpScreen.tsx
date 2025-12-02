import { useRef, useState, useEffect } from 'react';
import { ArrowLeft } from './ui/icons';

interface VerifyOtpScreenProps {
  onBack: () => void;
  onVerified: () => void;
}

export function VerifyOtpScreen({ onBack, onVerified }: VerifyOtpScreenProps) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [showKeypad, setShowKeypad] = useState(true);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleNumberClick = (num: string) => {
    const emptyIndex = digits.findIndex((d) => d === '');
    if (emptyIndex !== -1) {
      const next = [...digits];
      next[emptyIndex] = num;
      setDigits(next);

      if (emptyIndex < 3) {
        inputsRef.current[emptyIndex + 1]?.focus();
      } else {
        setTimeout(() => onVerified(), 300);
      }
    }
  };

  const handleBackspace = () => {
    let lastFilledIndex = -1;
    for (let i = digits.length - 1; i >= 0; i--) {
      if (digits[i] !== '') {
        lastFilledIndex = i;
        break;
      }
    }

    if (lastFilledIndex !== -1) {
      const next = [...digits];
      next[lastFilledIndex] = '';
      setDigits(next);
      inputsRef.current[lastFilledIndex]?.focus();
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">

      {/* ✅ STATUS BAR */}
      <div className="absolute top-0 left-0 right-0 px-6 py-2 flex items-center justify-between z-10 bg-[#00A859]">
        <span className="text-white font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 bg-white rounded-sm" />
          <div className="w-4 h-2 bg-white rounded-sm" />
          <div className="w-6 h-3 border-2 border-white rounded-sm">
            <div className="h-full bg-white rounded-sm w-[70%]" />
          </div>
        </div>
      </div>

      {/* ✅ GREEN HEADER */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-[#00A859]" />

      {/* ✅ WHITE OVERLAPPING CARD */}
      <div className="relative z-20 mt-48 flex-1 bg-white rounded-t-[40px] px-6 pt-8 pb-4 flex flex-col">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all mb-4"
        >
          <ArrowLeft className="w-6 h-6 text-[#00A859]" />
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#00A859] mb-2 mt-4">
          Phone Verification
        </h1>

        <p className="text-base font-normal text-gray-600 mb-8">
          Enter your OTP code here
        </p>

        {/* ✅ OTP INPUTS */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => setShowKeypad(true)}
              className="w-16 h-20 text-center text-3xl font-bold text-gray-900 border-b-4 border-gray-300 focus:border-[#00A859] outline-none transition-colors"
            />
          ))}
        </div>

        {/* ✅ VERIFY BUTTON */}
        <button
          onClick={onVerified}
          disabled={!isComplete}
          className={`w-full rounded-full px-6 py-4 text-center font-semibold text-white transition-all duration-200 mb-4 ${
            isComplete
              ? 'bg-[#00A859] hover:bg-[#00964d] active:scale-95 shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Verify Now
        </button>

        {/* ✅ NUMERIC KEYPAD */}
        {showKeypad && (
          <div className="mt-auto grid grid-cols-3 gap-3 pb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="aspect-square rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex flex-col items-center justify-center"
              >
                <span className="text-2xl font-semibold text-gray-900">{num}</span>
              </button>
            ))}

            <button className="aspect-square rounded-xl bg-gray-100" />

            <button
              onClick={() => handleNumberClick('0')}
              className="aspect-square rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
            >
              <span className="text-2xl font-semibold text-gray-900">0</span>
            </button>

            <button
              onClick={handleBackspace}
              className="aspect-square rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
