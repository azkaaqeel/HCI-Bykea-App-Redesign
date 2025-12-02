import { useState } from 'react';
import { Globe } from './ui/icons';

interface SignInScreenProps {
  onContinue: () => void;
  onCallAir?: () => void;
}

export function SignInScreen({ onContinue, onCallAir }: SignInScreenProps) {
  const [phone, setPhone] = useState('');

  const MAX_PHONE_DIGITS = 10;

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, MAX_PHONE_DIGITS);
    setPhone(digits);
  };

  const isValid = phone.length === MAX_PHONE_DIGITS;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">

      {/* ✅ STATUS BAR (FROM REF) */}
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

      {/* ✅ GREEN BACKGROUND (ROUNDED TOP) */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-[#00A859] rounded-t-[40px]" />

      {/* ✅ WHITE CARD OVERLAPPING GREEN (LIKE REF) */}
      <div className="relative z-20 mt-48 flex-1 bg-white rounded-t-[40px] px-6 pt-8 pb-6 flex flex-col">

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6">
          <button className="text-base font-normal text-gray-400">
            Sign Up
          </button>

          <button className="text-base font-bold text-gray-900 relative">
            Sign In
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A859] -mb-1" />
          </button>
        </div>

        {/* Instruction */}
        <p className="text-base font-normal text-gray-900 mb-6">
          Login with your phone number
        </p>

        {/* ✅ PHONE INPUT — MATCHED TO REF */}
        <div className="mb-6">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-4 py-4 shadow-sm focus-within:border-[#00A859] transition-all">

            {/* Country Code */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Globe className="w-5 h-5 text-[#00A859]" />
              <span className="text-base font-semibold text-gray-900">+92</span>
            </div>

            {/* Phone Input */}
            <div className="flex-1 flex items-center">
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Enter phone number"
                className="flex-1 text-lg font-normal text-gray-900 bg-transparent border-none outline-none placeholder:text-gray-400"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        {/* ✅ NEXT BUTTON (REF STYLE) */}
        <button
          onClick={onContinue}
          disabled={!isValid}
          className={`w-full rounded-full px-6 py-4 text-center font-semibold text-white transition-all duration-200 mb-4 ${
            isValid
              ? 'bg-[#00A859] hover:bg-[#00964d] active:scale-95 shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Next
        </button>

        {/* ✅ CALL AIR BUTTON (REF STYLE) */}
        <button
          onClick={onCallAir}
          className="w-full rounded-full px-6 py-4 text-center font-semibold text-[#00A859] border-2 border-[#00A859] bg-white hover:bg-[#00A859] hover:text-white transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="text-xl">📞</span>
          Call BYKEA
        </button>

      </div>
    </div>
  );
}
