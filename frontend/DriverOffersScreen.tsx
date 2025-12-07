import { ArrowLeft, Star, Check, X, TrendingDown } from './ui/icons';
import { useState, useEffect } from 'react';
import { useAccessibility } from './accessibility';

interface DriverOffersScreenProps {
  onBack: () => void;
  onAcceptOffer: (driverId: string) => void;
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
  const { isColorblindMode } = useAccessibility();
  const [selectedFilter, setSelectedFilter] = useState<'price' | 'rating' | 'pickup'>('price');
  const [expiryTimer, setExpiryTimer] = useState(225); // 3:45 in seconds
  const [rejectedOffers, setRejectedOffers] = useState<string[]>([]);

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
        <style>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pulse-opacity {
            0%, 100% {
              opacity: 0.5;
            }
            50% {
              opacity: 1;
            }
          }
          .slide-in-up {
            animation: slideInUp 0.5s ease-out both;
          }
          .pulse-fade {
            animation: pulse-opacity 2s ease-in-out infinite;
          }
        `}</style>
        {sortedOffers.map((offer, index) => (
          <div
            key={offer.id}
            className={`bg-white rounded-2xl shadow-sm p-4 slide-in-up ${
              offer.isBestOffer ? 'border-2 border-[#00D47C]' : 'border border-gray-200'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Best Offer Badge */}
            {offer.isBestOffer && (
              <div className="flex items-center gap-2 mb-3 bg-[#00D47C] -mx-4 -mt-4 px-4 py-2 rounded-t-2xl">
                <Star className="w-4 h-4 text-white fill-white" />
                <span className="text-white text-sm">BEST OFFER</span>
              </div>
            )}

            {/* Driver Info */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                {offer.photo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-black truncate">{offer.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-700">{offer.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">({offer.totalTrips} trips)</p>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="flex items-center gap-2 mb-3 bg-gray-50 rounded-xl p-3">
              <span className="text-xl">🏍️</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {offer.vehicleType} • {offer.vehicleModel}
                </p>
                <p className="text-xs text-gray-600">
                  {offer.vehicleColor} • {offer.vehiclePlate}
                </p>
              </div>
            </div>

            {/* Price and Details */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-green-50 rounded-xl p-3 border border-green-200 relative">
                {isColorblindMode && (
                  <span className="absolute top-2 right-2 text-blue-600 font-bold text-xs">✓</span>
                )}
                <p className="text-xs text-green-700 mb-1">💰 Price</p>
                <p className="text-xl text-green-900">Rs. {offer.price}</p>
                {offer.priceLabel && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-green-600" />
                    <p className="text-xs text-green-700">{offer.priceLabel}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="bg-blue-50 rounded-xl p-2 border border-blue-200 relative">
                  {isColorblindMode && (
                    <span className="absolute top-1 right-1 text-purple-600 font-bold text-xs">ℹ</span>
                  )}
                  <p className="text-xs text-blue-900">
                    ⏱️ Arrives in: <span>{offer.arrivalTime} min</span>
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-2 border border-purple-200 relative" style={{ backgroundImage: isColorblindMode ? 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 8px)' : undefined }}>
                  {isColorblindMode && (
                    <span className="absolute top-1 right-1 text-purple-600 font-bold text-xs">📍</span>
                  )}
                  <p className="text-xs text-purple-900">
                    📍 {offer.distance} away
                  </p>
                </div>
              </div>
            </div>

            {/* Badges */}
            {offer.isVerified && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                  <Check className="w-3 h-3 text-blue-700" />
                  <span className="text-xs text-blue-700">Verified Driver</span>
                </div>
              </div>
            )}

            {/* Driver Message */}
            {offer.message && (
              <div className="bg-gray-50 rounded-xl p-3 mb-3 border-l-4 border-[#00D47C]">
                <p className="text-sm text-gray-700">
                  💬 "{offer.message}"
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => onAcceptOffer(offer.id)}
                className="flex-1 bg-[#00D47C] text-white py-3 rounded-xl hover:bg-[#00bd6e] transition-colors"
              >
                {offer.isBestOffer ? 'ACCEPT OFFER' : 'ACCEPT'}
              </button>
              {!offer.isBestOffer && (
                <button
                  onClick={() => handleReject(offer.id)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button className="px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* More Offers Coming */}
        <div className="bg-white rounded-xl p-4 border border-dashed border-gray-300 pulse-fade">
          <p className="text-center text-gray-500">💡 More offers coming in...</p>
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