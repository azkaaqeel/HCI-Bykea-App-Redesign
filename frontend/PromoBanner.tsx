import { Bell } from './ui/icons';
import { useTranslation } from './i18n';

export function PromoBanner() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 shadow-lg flex items-center gap-3">
      <div className="bg-yellow-400 rounded-full p-2 flex-shrink-0">
        <Bell className="w-6 h-6 text-purple-900" />
      </div>
      <div className="text-white flex-1 text-sm leading-snug">
        <p className="font-semibold">{t('home.promo.title')}</p>
        <p className="text-white/80 text-xs mt-1">{t('home.promo.subtitle')}</p>
      </div>
    </div>
  );
}