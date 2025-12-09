import { ArrowLeft, Star, Check, X, TrendingDown, ChevronRight } from './ui/icons';
import { useState, useEffect } from 'react';
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
  priceLabel?: string;
  arrivalTime: number;
  distance: string;
  isVerified: boolean;
  message?: string;
  isBestOffer?: boolean;
}

const driverOffers: DriverOffer[] = [
  {
    id: '1',
    name: 'Muhammad Ali',
    photo: '👨',
    rating: 4.9,
    totalTrips: 234,
    vehicleType: 'Bike',
    vehicleModel: 'Honda 125',
    vehicleColor: 'Black',
    vehiclePlate: 'ABC-123',
    price: 320,
    priceLabel: '20% below average',
    arrivalTime: 2,
    distance: '400m',
    isVerified: true,
    message: 'Traffic is clear, quick pickup!',
    isBestOffer: true,
  },
  {
    id: '2',
    name: 'Hassan Khan',
    photo: '👨‍💼',
    rating: 4.7,
    totalTrips: 156,
    vehicleType: 'Bike',
    vehicleModel: 'Honda CD-70',
    vehicleColor: 'Red',
    vehiclePlate: 'XYZ-789',
    price: 380,
    arrivalTime: 5,
    distance: '1.2 km',
    isVerified: true,
  },
  {
    id: '3',
    name: 'Ahmed Raza',
    photo: '🧔',
    rating: 4.8,
    totalTrips: 189,
    vehicleType: 'Bike',
    vehicleModel: 'Yamaha YBR',
    vehicleColor: 'Blue',
    vehiclePlate: 'DEF-456',
    price: 350,
    arrivalTime: 3,
    distance: '800m',
    isVerified: true,
    message: 'Ready to go!',
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
  const [expiryTimer, setExpiryTimer] = useState(225); // 3:45 in seconds
  const [rejectedOffers, setRejectedOffers] = useState<string[]>([]);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setExpiryTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedOffers = [...driverOffers].filter(offer => !rejectedOffers.includes(offer.id)).sort((a, b) => {
    if (selectedFilter === 'price') return a.price - b.price;
    if (selectedFilter === 'rating') return b.rating - a.rating;
    if (selectedFilter === 'pickup') return a.arrivalTime - b.arrivalTime;
    return 0;
  });

  const handleReject = (offerId: string) => {
    setRejectedOffers([...rejectedOffers, offerId]);
    if (expandedOfferId === offerId) {
      setExpandedOfferId(null);
    }
  };

  const toggleExpand = (offerId: string) => {
    setExpandedOfferId(expandedOfferId === offerId ? null : offerId);
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-gray-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-black text-xl">Driver Offers ({sortedOffers.length})</h1>
          </div>
          <div className="bg-red-100 px-3 py-1 rounded-full">
            <p className="text-sm text-red-800">⏰ {formatTime(expiryTimer)}</p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedFilter('price')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedFilter === 'price'
                ? 'bg-[#00D47C] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lowest Price
          </button>
          <button
            onClick={() => setSelectedFilter('rating')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedFilter === 'rating'
                ? 'bg-[#00D47C] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Highest Rating
          </button>
          <button
            onClick={() => setSelectedFilter('pickup')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedFilter === 'pickup'
                ? 'bg-[#00D47C] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fastest Pickup
          </button>
        </div>
      </div>

      {/* Route Info */}
      <div className="bg-blue-50 mx-4 mt-4 rounded-xl p-3 border border-blue-200">
        <div className="flex items-center gap-2 text-sm text-blue-900">
          <span>📍</span>
          <span className="truncate">{pickupLocation.slice(0, 20)}...</span>
          <span>→</span>
          <span className="truncate">{dropoffLocation.slice(0, 20)}...</span>
        </div>
        <p className="text-xs text-blue-700 mt-1 ml-6">5.2 km • 12 min</p>
      </div>

      {/* Driver Offers List */}
      <div data-tutorial="driver-offers" className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {sortedOffers.map((offer) => {
          const isExpanded = expandedOfferId === offer.id;
          const driverInitial = offer.name.charAt(0).toUpperCase();
          
          return (
            <div
              key={offer.id}
              className={`bg-white rounded-xl border transition-all duration-200 ${
                isExpanded 
                  ? 'border-[#00D47C] shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ minHeight: isExpanded ? 'auto' : '110px', maxHeight: isExpanded ? 'none' : '130px' }}
            >
              {/* Compact Horizontal Card */}
              {!isExpanded && (
                <button
                  onClick={() => toggleExpand(offer.id)}
                  className="relative w-full p-3 text-left hover:bg-gray-50 transition-colors"
                >
                  {/* Best Offer Badge - Small and Subtle */}
                  {offer.isBestOffer && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                      BEST OFFER
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {/* Left: Avatar + Driver Name */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{driverInitial}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{offer.name}</p>
                      </div>
                    </div>

                    {/* Center: Rating + Trips + Vehicle */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-gray-900">{offer.rating}</span>
                        <span className="text-xs text-gray-500">({offer.totalTrips})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                          <span className="text-xs">🏍️</span>
                          <span className="text-xs text-gray-700">{offer.vehicleType}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                          <span className="text-xs text-gray-500">{offer.vehiclePlate}</span>
                        </div>
                        {offer.isVerified && (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Right: Price + ETA + Distance + Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#00D47C]">{offer.price} Rs.</p>
                        <p className="text-[10px] text-gray-500">Total fare</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-600">⏱️ {offer.arrivalTime} min</span>
                          <span className="text-[10px] text-gray-600">📍 {offer.distance}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            announceAction(t('voice.driverAccepted', `Driver ${offer.name} accepted. Price: Rs. ${offer.price}`));
                            onAcceptOffer(offer.id, offer);
                          }}
                          className="px-2.5 py-1 bg-[#00D47C] text-white text-[10px] font-medium rounded hover:bg-[#00bd6e] transition-colors whitespace-nowrap"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(offer.id);
                          }}
                          className="px-2.5 py-1 border border-red-300 text-red-600 text-[10px] font-medium rounded hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* Expanded View - Optional for more details */}
              {isExpanded && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{driverInitial}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{offer.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-gray-700">{offer.rating} ({offer.totalTrips} trips)</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpand(offer.id)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-900">
                      <span className="text-sm">🏍️</span> {offer.vehicleType} • {offer.vehicleModel} • {offer.vehicleColor} • {offer.vehiclePlate}
                    </p>
                  </div>

                  {offer.message && (
                    <div className="bg-gray-50 rounded-lg p-2 border-l-2 border-[#00D47C]">
                      <p className="text-xs text-gray-700">💬 "{offer.message}"</p>
                    </div>
                  )}

                  {offer.isVerified && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-blue-600" />
                      <span className="text-xs text-blue-700">Verified Driver</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        announceAction(t('voice.driverAccepted', `Driver ${offer.name} accepted. Price: Rs. ${offer.price}`));
                        onAcceptOffer(offer.id, offer);
                      }}
                      className="flex-1 bg-[#00D47C] text-white py-2 rounded-lg hover:bg-[#00bd6e] transition-colors text-sm font-semibold"
                    >
                      Accept Offer
                    </button>
                    <button
                      onClick={() => handleReject(offer.id)}
                      className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* More Offers Coming */}
        <div className="bg-white rounded-xl p-3 border border-dashed border-gray-300 mt-2">
          <p className="text-center text-gray-500 text-xs">💡 More offers coming in...</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        {/* Home Indicator */}
        <div className="flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}