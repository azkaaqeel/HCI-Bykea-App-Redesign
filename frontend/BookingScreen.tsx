import { ArrowLeft, MapPin, ChevronDown, ChevronUp, Check, CreditCard, Wallet, Banknote } from './ui/icons';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from './i18n';
import { usePageAnnouncement, useVoiceAnnouncements } from './useVoiceAnnouncements';

interface FareBreakdown {
  base: number;
  distance: number;
  time: number;
}

interface VehicleOption {
  id: string;
  name: string;
  icon: string;
  breakdown: FareBreakdown;
  discountRate?: number;
  badge?: string;
}

interface BookingScreenProps {
  onBack: () => void;
  onConfirm: (vehicleType: string, paymentMethod: string) => void;
  pickupLocation: string;
  dropoffLocation: string;
}

const vehicles: VehicleOption[] = [
  {
    id: 'bike',
    name: 'booking.vehicle.bike',
    icon: '🚲',
    breakdown: { base: 70, distance: 110, time: 20 },
  },
  {
    id: 'rickshaw',
    name: 'booking.vehicle.rickshaw',
    icon: '🛺',
    breakdown: { base: 90, distance: 180, time: 45 },
  },
  {
    id: 'car',
    name: 'booking.vehicle.car',
    icon: '🚗',
    breakdown: { base: 120, distance: 260, time: 80 },
    discountRate: 0.2,
    badge: 'AC',
  },
  {
    id: 'ac-car',
    name: 'booking.vehicle.acCar',
    icon: '🚙',
    breakdown: { base: 100, distance: 260, time: 60 },
    discountRate: 0.3,
    badge: 'XL',
  },
];

function calculateFare(vehicle: VehicleOption) {
  const base = vehicle.breakdown.base;
  const distance = vehicle.breakdown.distance;
  const time = vehicle.breakdown.time;
  const subtotal = base + distance + time;
  const discountRate = vehicle.discountRate ?? 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const total = subtotal - discountAmount;
  const discountLabel = discountRate > 0 ? `${Math.round(discountRate * 100)}%` : null;

  return { base, distance, time, subtotal, discountAmount, discountLabel, total };
}

const paymentMethods = [
  { id: 'cash', nameKey: 'booking.payment.cash', icon: Banknote, descriptionKey: 'booking.payment.cashDesc' },
  { id: 'card', nameKey: 'booking.payment.card', icon: CreditCard, descriptionKey: 'booking.payment.cardDesc' },
  { id: 'wallet', nameKey: 'booking.payment.wallet', icon: Wallet, descriptionKey: 'booking.payment.walletDesc' },
];

export function BookingScreen({ onBack, onConfirm, pickupLocation, dropoffLocation }: BookingScreenProps) {
  const { t } = useTranslation();
  const { announceAction } = useVoiceAnnouncements();
  usePageAnnouncement(t('booking.title', 'Booking Screen'), [pickupLocation, dropoffLocation]);
  const [selectedVehicle, setSelectedVehicle] = useState('ac-car');
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);

  const currentVehicle = vehicles.find(v => v.id === selectedVehicle);
  const currentPaymentMethod = paymentMethods.find(p => p.id === selectedPayment);
  const baseFare = currentVehicle
    ? calculateFare(currentVehicle).total
    : 0;
  
  const displayPrice = customPrice !== null ? customPrice : baseFare;
  const PRICE_INTERVAL = 10;
  const MIN_PRICE = 50;

  // Close payment dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setIsPaymentDropdownOpen(false);
      }
    };

    if (isPaymentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPaymentDropdownOpen]);

  // Focus price input when editing
  useEffect(() => {
    if (isEditingPrice && priceInputRef.current) {
      priceInputRef.current.focus();
      priceInputRef.current.select();
    }
  }, [isEditingPrice]);

  const handlePriceIncrease = () => {
    const newPrice = displayPrice + PRICE_INTERVAL;
    setCustomPrice(newPrice);
  };

  const handlePriceDecrease = () => {
    const newPrice = Math.max(MIN_PRICE, displayPrice - PRICE_INTERVAL);
    setCustomPrice(newPrice);
  };

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setCustomPrice(null);
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= MIN_PRICE) {
      setCustomPrice(numValue);
    }
  };

  const handlePriceInputBlur = () => {
    setIsEditingPrice(false);
    if (customPrice === null || customPrice < MIN_PRICE) {
      setCustomPrice(null);
    }
  };

  const handlePriceClick = () => {
    setIsEditingPrice(true);
  };

  const handleConfirm = () => {
    const vehicleName = vehicles.find(v => v.id === selectedVehicle)?.name || selectedVehicle;
    announceAction(t('voice.bookingConfirmed', `Booking confirmed. Vehicle: ${t(vehicleName)}, Payment: ${t(paymentMethods.find(p => p.id === selectedPayment)?.nameKey || 'cash')}`));
    onConfirm(selectedVehicle, selectedPayment);
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-[#f5f7fb] overflow-hidden flex flex-col">
      {/* Soft gradient backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#dff7ec] via-white to-transparent" />

      {/* Header + Route Summary */}
      <div className="relative z-10 px-4 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-3 rounded-full bg-white shadow hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <p className="text-xs text-gray-500">{t('booking.fasterPickup', 'faster pickup')}</p>
            <h1 className="text-lg font-semibold text-gray-900">{t('booking.payment', 'Booking')}</h1>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-3xl shadow-sm border border-green-100 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#00D47C] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">{t('location.from')}</p>
              <p className="text-sm text-gray-900">{pickupLocation}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">{t('location.to')}</p>
              <p className="text-sm text-gray-900">{dropoffLocation}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-dashed border-gray-200 text-sm text-gray-600">
            <span>⏱️ 5 min</span>
            <span>•</span>
            <span>📏 5.2 km</span>
          </div>
        </div>
      </div>


      {/* Spacer to push content to bottom */}
      <div className="flex-1"></div>

      {/* Bottom Content */}
      <div className="relative z-40 bg-white rounded-t-3xl shadow-2xl">
        <div className="px-4 pt-6 pb-6 space-y-4">
          {/* Payment Method Dropdown */}
          <div className="relative" ref={paymentDropdownRef}>
            <button
              onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {currentPaymentMethod && (
                  <currentPaymentMethod.icon className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-gray-900 font-medium">
                  {currentPaymentMethod ? t(currentPaymentMethod.nameKey) : 'Cash'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isPaymentDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isPaymentDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => {
                        setSelectedPayment(method.id);
                        setIsPaymentDropdownOpen(false);
                        announceAction(t('voice.paymentSelected', `Payment method changed to ${t(method.nameKey)}`));
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                        selectedPayment === method.id ? 'bg-green-50' : ''
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${selectedPayment === method.id ? 'text-[#00D47C]' : 'text-gray-600'}`} />
                      <span className={`flex-1 text-left ${selectedPayment === method.id ? 'text-[#00D47C] font-medium' : 'text-gray-900'}`}>
                        {t(method.nameKey)}
                      </span>
                      {selectedPayment === method.id && (
                        <Check className="w-5 h-5 text-[#00D47C]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Fare Adjust Component */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-center gap-4">
              {/* Price Display/Input */}
              <div className="flex-1 text-center">
                {isEditingPrice ? (
                  <input
                    ref={priceInputRef}
                    type="number"
                    inputMode="numeric"
                    value={customPrice !== null ? customPrice : ''}
                    onChange={handlePriceInputChange}
                    onBlur={handlePriceInputBlur}
                    className="text-[#00D47C] text-5xl font-bold w-full text-center bg-transparent border-none focus:outline-none"
                    min={MIN_PRICE}
                    step={PRICE_INTERVAL}
                  />
                ) : (
                  <button
                    onClick={handlePriceClick}
                    className="text-[#00D47C] text-5xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    Rs. {displayPrice.toLocaleString()}
                  </button>
                )}
              </div>

              {/* Arrow Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handlePriceIncrease}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Increase price"
                >
                  <ChevronUp className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handlePriceDecrease}
                  disabled={displayPrice <= MIN_PRICE}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Decrease price"
                >
                  <ChevronDown className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Note below price */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Minimum fare applies. Offers may vary based on demand.
            </p>
          </div>

          {/* Vehicle Selection */}
          <div data-tutorial="vehicle-selection" className="flex gap-3 overflow-x-auto pb-2">
            {vehicles.map((vehicle) => {
              const fare = calculateFare(vehicle);
              return (
                <button
                  key={vehicle.id}
                  onClick={() => {
                    setSelectedVehicle(vehicle.id);
                    setCustomPrice(null); // Reset custom price when vehicle changes
                    announceAction(t('voice.vehicleSelected', `Selected ${t(vehicle.name)}`));
                  }}
                  className={`relative flex-shrink-0 w-24 rounded-2xl border-2 p-3 transition-all ${
                    selectedVehicle === vehicle.id
                      ? 'border-[#00D47C] bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {vehicle.badge && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {vehicle.badge}
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">{vehicle.icon}</span>
                    <span className="text-xs text-gray-600">{t(vehicle.name)}</span>
                    <span className="text-black font-semibold">Rs. {fare.total.toFixed(0)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confirm Button */}
          <button 
            onClick={handleConfirm}
            className="w-full bg-[#00D47C] rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg hover:bg-[#00bd6e] transition-colors"
          >
            <Check className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg">Confirm</span>
          </button>
        </div>

        {/* Home Indicator */}
        <div className="pb-2 flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>

    </div>
  );
}