import { ArrowLeft, Search, MapPin, Clock } from './ui/icons';
import { useState } from 'react';
import { MapView } from './MapView';
import { useTranslation } from './i18n';

interface DeliveryLocationScreenProps {
  onBack: () => void;
  onSelectLocation: (location: string) => void;
  type: 'pickup' | 'delivery';
}

const recentAddresses = (t: (key: string) => string) => [
  {
    name: t('location.home'),
    address: '123, Street 5, Gulshan-e-Iqbal',
    area: 'Karachi',
  },
  {
    name: t('location.work'),
    address: 'Plot 456, Shahrah-e-Faisal',
    area: 'Karachi',
  },
  {
    name: 'Millennium Mall',
    address: 'Main Rashid Minhas Road',
    area: 'Karachi',
  },
  {
    name: 'Dolmen Mall',
    address: 'Tariq Road, PECHS',
    area: 'Karachi',
  },
];

export function DeliveryLocationScreen({
  onBack,
  onSelectLocation,
  type,
}: DeliveryLocationScreenProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAddresses = recentAddresses(t).filter(
    (addr) =>
      addr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white z-50 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl text-black">
          {type === 'pickup' ? t('delivery.pickFromTitle') : t('delivery.deliverToTitle')}
        </h1>
      </div>

      {/* Map Preview */}
      <div className="h-48 relative">
        <MapView />
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('delivery.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-black placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#00D47C] focus:ring-1 focus:ring-[#00D47C]"
          />
        </div>
      </div>

      {/* Recent Addresses List */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{t('location.recentLocations')}</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredAddresses.map((addr, index) => (
            <button
              key={index}
              onClick={() => onSelectLocation(addr.address)}
              className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="text-black mb-1">{addr.name}</div>
                  <div className="text-sm text-gray-500">{addr.address}</div>
                  <div className="text-xs text-gray-400 mt-1">{addr.area}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredAddresses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <MapPin className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-400 text-center">No locations found</p>
            <p className="text-gray-400 text-sm text-center mt-1">
              Try searching with a different keyword
            </p>
          </div>
        )}
      </div>

      {/* Home Indicator */}
      <div className="pb-2 bg-white flex justify-center border-t border-gray-100">
        <div className="w-32 h-1 bg-black rounded-full mt-2" />
      </div>
    </div>
  );
}
