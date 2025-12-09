import { ArrowLeft, Star, X, Clock, MapPin } from './ui/icons';
import { useState } from 'react';
import { useAccessibility } from './accessibility';
import { useTranslation } from './i18n';
import { usePageAnnouncement, useVoiceAnnouncements } from './useVoiceAnnouncements';

interface DriverOffersScreenProps {
  onBack: () => void;
  onAcceptOffer: (driverId: string, driverData?: DriverOffer) => void;
  pickupLocation: string;
  dropoffLocation: string;
}

interface DriverOffer {
  id: string;
  name: string;
  photo: string;
  rating: number;
  totalTrips: number;
  vehicleType: string;
  vehicleModel: string;
  vehicleColor: string;
  vehiclePlate: string;
  price: number;
  arrivalTime: number;
  distance: string;
  isVerified: boolean;
  isBestOffer?: boolean;
}

const driverOffers: DriverOffer[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    photo: 'A',
    rating: 4.8,
    totalTrips: 234,
    vehicleType: 'Bike',
    vehicleModel: 'Honda 125',
    vehicleColor: 'Black',
    vehiclePlate: 'KHI-2341',
    price: 850,
    arrivalTime: 2,
    distance: '0.5 km away',
    isVerified: true,
    isBestOffer: true,
  },
  {
    id: '2',
    name: 'Hassan Ali',
    photo: 'H',
    rating: 4.9,
    totalTrips: 456,
    vehicleType: 'Bike',
    vehicleModel: 'Honda CD-70',
    vehicleColor: 'Red',
    vehiclePlate: 'KHI-5678',
    price: 900,
    arrivalTime: 3,
    distance: '0.8 km away',
    isVerified: true,
  },
  {
    id: '3',
    name: 'Bilal Ahmed',
    photo: 'B',
    rating: 4.7,
    totalTrips: 189,
    vehicleType: 'Bike',
    vehicleModel: 'Yamaha YBR',
    vehicleColor: 'Blue',
    vehiclePlate: 'KHI-9012',
    price: 920,
    arrivalTime: 4,
    distance: '1.2 km away',
    isVerified: true,
  },
];

export function DriverOffersScreen({
  onBack,
  onAcceptOffer,
  pickupLocation,
  dropoffLocation,
}: DriverOffersScreenProps) {
  const { t } = useTranslation();
  const { announceAction } = useVoiceAnnouncements();
  const { isColorblindMode } = useAccessibility();
  usePageAnnouncement(t('voice.driverOffers', 'Driver Offers'), [pickupLocation, dropoffLocation]);
  const [selectedFilter, setSelectedFilter] = useState<'price' | 'rating' | 'pickup'>('price');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const sortedOffers = [...driverOffers].sort((a, b) => {
    if (selectedFilter === 'price') return a.price - b.price;
    if (selectedFilter === 'rating') return b.rating - a.rating;
    if (selectedFilter === 'pickup') return a.arrivalTime - b.arrivalTime;
    return 0;
  });

  const selectedDriver = selectedDriverId ? driverOffers.find(d => d.id === selectedDriverId) : null;

  const handleConfirmRide = () => {
    if (selectedDriverId && selectedDriver) {
      announceAction(t('voice.driverAccepted', `Driver ${selectedDriver.name} accepted. Price: Rs. ${selectedDriver.price}`));
      onAcceptOffer(selectedDriverId, selectedDriver);
    }
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <div className="mb-3">
          <h1 className={`text-xl font-semibold ${isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]'}`}>
            {t('driverOffers.title', 'Available Rides')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {sortedOffers.length} {t('driverOffers.driversFound', 'drivers found nearby')}
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedFilter('price')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedFilter === 'price'
                ? (isColorblindMode ? 'bg-blue-500 text-white' : 'bg-[#00D47C] text-white')
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('driverOffers.lowestPrice', 'Lowest Price')}
          </button>
          <button
            onClick={() => setSelectedFilter('rating')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedFilter === 'rating'
                ? (isColorblindMode ? 'bg-blue-500 text-white' : 'bg-[#00D47C] text-white')
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('driverOffers.highestRating', 'Highest Rating')}
          </button>
          <button
            onClick={() => setSelectedFilter('pickup')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedFilter === 'pickup'
                ? (isColorblindMode ? 'bg-blue-500 text-white' : 'bg-[#00D47C] text-white')
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('driverOffers.fastestPickup', 'Fastest Pickup')}
          </button>
        </div>
      </div>

      {/* Driver Offers List */}
      <div data-tutorial="driver-offers" className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {sortedOffers.map((offer) => {
          const driverInitial = offer.name.charAt(0).toUpperCase();
          const isSelected = selectedDriverId === offer.id;
          
          return (
            <button
              key={offer.id}
              onClick={() => setSelectedDriverId(offer.id)}
              className={`w-full bg-gray-50 rounded-2xl p-4 text-left transition-all ${
                isSelected
                  ? (isColorblindMode ? 'ring-2 ring-blue-500 bg-blue-50' : 'ring-2 ring-[#00D47C] bg-green-50')
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? (isColorblindMode ? 'bg-blue-500' : 'bg-[#00D47C]')
                    : 'bg-gray-300'
                } text-white text-xl font-semibold`}>
                  {driverInitial}
                </div>

                {/* Driver Info */}
                <div className="flex-1 min-w-0">
                  {/* Best Offer Badge */}
                  {offer.isBestOffer && (
                    <div className={`inline-block mb-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      isColorblindMode ? 'bg-blue-500' : 'bg-[#00D47C]'
                    } text-white`}>
                      {t('driverOffers.bestOffer', 'BEST OFFER')}
                    </div>
                  )}

                  {/* Name */}
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{offer.name}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-700">
                      {offer.rating} ({offer.totalTrips})
                    </span>
                  </div>

                  {/* Fare */}
                  <div className="mb-2">
                    <p className={`text-xl font-bold ${isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]'}`}>
                      {offer.price} {t('driverOffers.rs', 'Rs.')}
                    </p>
                    <p className="text-xs text-gray-500">{t('driverOffers.totalFare', 'Total fare')}</p>
                  </div>

                  {/* Vehicle, Time, Distance */}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-base">🏍️</span>
                      <span className="text-sm text-gray-700">{offer.vehicleType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]'}`} />
                      <span className="text-sm text-gray-700">{offer.arrivalTime} {t('driverOffers.min', 'min')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className={`w-4 h-4 ${isColorblindMode ? 'text-purple-600' : 'text-red-500'}`} />
                      <span className="text-sm text-gray-700">{offer.distance}</span>
                    </div>
                  </div>

                  {/* Vehicle ID */}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-gray-600">{offer.vehiclePlate}</span>
                    <div className={`w-2 h-2 rounded-full ${isColorblindMode ? 'bg-blue-500' : 'bg-[#00D47C]'}`}></div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Action Buttons */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 space-y-3">
        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center">
          {t('driverOffers.disclaimer', 'Prices may vary based on traffic and demand')}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            {t('driverOffers.cancel', 'CANCEL')}
          </button>
          {selectedDriverId && (
            <button
              onClick={handleConfirmRide}
              className={`flex-1 py-3 rounded-xl font-semibold text-white transition-colors ${
                isColorblindMode
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-[#00D47C] hover:bg-[#00be6f]'
              }`}
            >
              {t('driverOffers.confirmRide', 'CONFIRM RIDE')}
            </button>
          )}
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center pt-2">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
