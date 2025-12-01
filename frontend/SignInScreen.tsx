import { useState } from 'react';
import { useTranslation } from './i18n';
import { Globe } from './ui/icons';

interface SignInScreenProps {
  onContinue: () => void;
}

export function SignInScreen({ onContinue }: SignInScreenProps) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');

  const MAX_PHONE_DIGITS = 10;

  const handlePhoneChange = (value: string) => {
    // numbers only, max 10 digits
    const digits = value.replace(/\D/g, '').slice(0, MAX_PHONE_DIGITS);
    setPhone(digits);
  };

  const isValid = phone.length === MAX_PHONE_DIGITS;

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-gray-100 flex flex-col items-center justify-center">
      {/* Green header */}
      <div className="absolute top-0 inset-x-0 h-40 bg-[#00A859] rounded-b-[40px]" />

      <div className="relative w-full px-6">
        <div className="bg-white rounded-[32px] shadow-xl p-6 pt-8">
          {/* Tabs */}
          <div className="flex items-center gap-8 mb-6 text-sm">
            <button className="text-gray-400 font-medium">Sign Up</button>
            <button className="text-gray-900 font-semibold relative">
              Sign In
              <span className="absolute -bottom-1 left-0 right-0 mx-auto h-0.5 w-10 bg-[#00A859]" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-3">Login with your phone number</p>

          {/* Phone input */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3 mb-6 bg-gray-50">
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3 text-gray-600 text-sm">
              <Globe className="w-4 h-4" />
              <span>+92</span>
            </div>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
            />
          </div>

          {/* Next button */}
          <button
            onClick={onContinue}
            disabled={!isValid}
            className={`w-full rounded-2xl py-3 text-sm font-semibold ${
              isValid
                ? 'bg-[#00A859] text-white shadow-md hover:bg-[#00964d]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>

          {/* Call support */}
          <button className="mt-5 w-full rounded-2xl border border-[#00A859] text-[#00A859] py-3 text-sm font-semibold flex items-center justify-center gap-2 bg-white hover:bg-[#00a859]/5">
            <span>📞</span>
            <span>Call Bykea</span>
          </button>
        </div>
      </div>
    </div>
  );
}


