import { useTranslation } from './i18n';
import { X } from './ui/icons';

const translations = {
  en: {
    title: 'Select Your Language',
    subtitle: 'Choose your preferred language',
    english: 'English',
    englishDesc: 'Continue in English',
    urdu: 'اردو',
    urduDesc: 'اردو میں جاری رکھیں',
    continue: 'Continue',
  },
  ur: {
    title: 'اپنی زبان منتخب کریں',
    subtitle: 'اپنی پسندیدہ زبان چنیں',
    english: 'English',
    englishDesc: 'انگریزی میں جاری رکھیں',
    urdu: 'اردو',
    urduDesc: 'اردو میں جاری رکھیں',
    continue: 'جاری رکھیں',
  },
};

interface LanguageSelectionModalProps {
  onClose: () => void;
}

export function LanguageSelectionModal({ onClose }: LanguageSelectionModalProps) {
  const { language, setLanguage, t } = useTranslation();

  const handleSelectLanguage = (lang: 'en' | 'ur') => {
    setLanguage(lang);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center px-4 pb-6 pt-10">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#00D47C] to-[#00be6f] px-4 py-3 sm:px-6 sm:py-4">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
          <h2 className="text-white text-lg sm:text-xl font-semibold pr-8">{t('language.selectTitle')}</h2>
          <p className="text-white/90 text-xs sm:text-sm mt-0.5">{t('language.selectSubtitle')}</p>
        </div>

        {/* Language Options */}
        <div className="p-4 sm:p-6 space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
          <button
            onClick={() => handleSelectLanguage('en')}
            className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${
              language === 'en'
                ? 'border-[#00D47C] bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ${
                language === 'en' ? 'bg-[#00D47C]' : 'bg-gray-100'
              }`}>
                🇬🇧
              </div>
              <div className="text-left">
                <p className="text-gray-900 font-medium text-sm sm:text-base">English</p>
                <p className="text-xs sm:text-sm text-gray-500">{t('language.englishDescription')}</p>
              </div>
            </div>
            {language === 'en' && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#00D47C] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>

          <button
            onClick={() => handleSelectLanguage('ur')}
            className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${
              language === 'ur'
                ? 'border-[#00D47C] bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ${
                language === 'ur' ? 'bg-[#00D47C]' : 'bg-gray-100'
              }`}>
                🇵🇰
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-medium text-sm sm:text-base">اردو</p>
                <p className="text-xs sm:text-sm text-gray-500">{t('language.urduDescription')}</p>
              </div>
            </div>
            {language === 'ur' && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#00D47C] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* Continue Button */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-[#00D47C] hover:bg-[#00be6f] text-white rounded-xl sm:rounded-2xl py-3 sm:py-4 font-semibold text-sm sm:text-base transition-colors"
          >
            {t('language.continue')}
          </button>
        </div>
      </div>
    </div>
  );
}

