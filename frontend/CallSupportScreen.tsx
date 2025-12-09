import { ArrowLeft, Phone } from './ui/icons';
import { useTranslation } from './i18n';
import { usePageAnnouncement } from './useVoiceAnnouncements';

interface CallSupportScreenProps {
  onBack: () => void;
}

export function CallSupportScreen({ onBack }: CallSupportScreenProps) {
  const { t } = useTranslation();
  usePageAnnouncement(t('voice.callSupport', 'Call Support'));
  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white flex flex-col">
      {/* Header */}
      <header className="bg-[#00D47C] px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-semibold text-lg">{t('call.title', 'Call Bykea')}</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 pt-10 pb-8 flex flex-col items-center text-center text-gray-800">
        {/* Big phone icon */}
        <div className="w-28 h-28 rounded-full bg-[#E6F9EE] flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#00A859] flex items-center justify-center">
            <Phone className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-3">
          {t('call.heading', 'Call Bykea Representative')}
        </h2>
        <p className="text-sm text-gray-600 max-w-xs mb-8">
          {t('call.description', 'Speak directly with a Bykea representative to place your order via phone.')}
        </p>

        {/* Number card */}
        <div className="w-full bg-gray-50 rounded-2xl py-4 mb-6">
          <p className="text-xs text-gray-500 mb-1">{t('call.callUs', 'Call us at')}</p>
          <p className="text-lg font-semibold text-[#00D47C]">
            +92 300 123 4567
          </p>
        </div>

        {/* Call button */}
        <button
          onClick={() => {
            alert(t('call.calling', 'Calling +92 300 123 4567…'));
            // real device:
            // window.location.href = 'tel:+923001234567';
          }}
          className="w-full py-4 rounded-2xl bg-[#00D47C] hover:bg-[#00be6f] text-white font-semibold flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
        >
          <Phone className="w-5 h-5 text-white" />
          <span>{t('call.callNow', 'Call Now')}</span>
        </button>

        <p className="mt-4 text-xs text-gray-500">
          {t('call.available', 'Available 24/7 for your convenience')}
        </p>
      </main>

      {/* Home indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full" />
      </div>
    </div>
  );
}
