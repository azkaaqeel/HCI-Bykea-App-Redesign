import { ArrowLeft, MapPin } from './ui/icons';
import { MapView } from './MapView';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';
import { usePageAnnouncement } from './useVoiceAnnouncements';

interface DeliveryPickFromScreenProps {
  onBack: () => void;
  onEnterPickupAddress: () => void;
  onEnterDeliveryAddress: () => void;
  onBook: () => void;
  pickupAddress: string;
  deliveryAddress: string;
}

export function DeliveryPickFromScreen({
  onBack,
  onEnterPickupAddress,
  onEnterDeliveryAddress,
  onBook,
  pickupAddress,
  deliveryAddress,
}: DeliveryPickFromScreenProps) {
  const { t } = useTranslation();
  const { isColorblindMode } = useAccessibility();
  usePageAnnouncement(t('voice.deliveryScreen', 'Delivery Screen'));
  const bothAddressesEntered = pickupAddress && deliveryAddress;

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white z-50 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl text-black">{t('delivery.title')}</h1>
      </div>

      {/* Map Background */}
      <div className="flex-1 relative">
        <MapView />
      </div>

      {/* Bottom Card */}
      <div className="bg-white rounded-t-3xl shadow-2xl px-4 pt-4 pb-6">
        {/* Pick From Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00D47C]" />
              {isColorblindMode && (
                <span className="text-xs font-bold text-blue-600">▲ PICKUP</span>
              )}
            </div>
            <span className="text-sm text-gray-600">{t('delivery.pickFrom')}</span>
          </div>
          
          <button
            onClick={onEnterPickupAddress}
            className="w-full bg-gray-50 rounded-xl px-4 py-4 text-left hover:bg-gray-100 transition-colors border border-gray-200"
          >
            {pickupAddress ? (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#00D47C] flex-shrink-0" />
                <span className="text-black">{pickupAddress}</span>
              </div>
            ) : (
              <span className="text-gray-400">{t('delivery.enterAddress')}</span>
            )}
          </button>
        </div>

        {/* Get Fare Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              {isColorblindMode && (
                <span className="text-xs font-bold text-purple-600">● DROP</span>
              )}
            </div>
            <span className="text-sm text-gray-600">{t('delivery.deliverTo')}</span>
          </div>
          
          <button
            onClick={onEnterDeliveryAddress}
            className="w-full bg-gray-50 rounded-xl px-4 py-4 text-left hover:bg-gray-100 transition-colors border border-gray-200"
          >
            {deliveryAddress ? (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-black">{deliveryAddress}</span>
              </div>
            ) : (
              <span className="text-gray-400">{t('delivery.enterAddress')}</span>
            )}
          </button>
        </div>

        {/* Book Button */}
        <div className="flex justify-center">
          <button
            onClick={onBook}
            disabled={!bothAddressesEntered}
            className={`w-full rounded-2xl py-4 transition-all ${
              bothAddressesEntered
                ? 'bg-[#00D47C] hover:bg-[#00bd6e] text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {bothAddressesEntered ? t('delivery.getFare') : t('delivery.enterBothAddresses')}
          </button>
        </div>

        {/* Home Indicator */}
        <div className="pt-4 flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full" />
        </div>
      </div>
    </div>
  );
}
