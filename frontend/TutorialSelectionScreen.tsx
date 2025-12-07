import { Car, Package, Store } from './ui/icons';
import { useTranslation } from './i18n';

interface TutorialSelectionScreenProps {
  onSelect: (flow: 'ride' | 'delivery' | 'shops') => void;
  onClose: () => void;
}

export function TutorialSelectionScreen({ onSelect, onClose }: TutorialSelectionScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('tutorial.welcome', 'Welcome to Bykea!')}
          </h2>
          <p className="text-gray-600 text-sm">
            {t('tutorial.selectFlow', 'Choose a flow to learn about:')}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {/* Ride Flow */}
          <button
            onClick={() => onSelect('ride')}
            className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-[#00D47C] to-[#00be6f] rounded-2xl text-white hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg">{t('nav.ride', 'Ride')}</h3>
              <p className="text-sm text-white/90">
                {t('tutorial.rideDesc', 'Learn how to book rides')}
              </p>
            </div>
          </button>

          {/* Delivery Flow */}
          <button
            onClick={() => onSelect('delivery')}
            className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg">{t('nav.delivery', 'Delivery')}</h3>
              <p className="text-sm text-white/90">
                {t('tutorial.deliveryDesc', 'Learn how to send packages')}
              </p>
            </div>
          </button>

          {/* Shops Flow */}
          <button
            onClick={() => onSelect('shops')}
            className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl text-white hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg">{t('nav.shops', 'Shops')}</h3>
              <p className="text-sm text-white/90">
                {t('tutorial.shopsDesc', 'Learn how to shop and order')}
              </p>
            </div>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
        >
          {t('tutorial.close', 'Close')}
        </button>
      </div>
    </div>
  );
}

