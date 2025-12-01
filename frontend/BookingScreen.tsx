import { ArrowLeft, MapPin, ChevronDown, ChevronUp, Info, Check, CreditCard, Wallet, Banknote } from './ui/icons';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { useTranslation } from './i18n';

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
  const [selectedVehicle, setSelectedVehicle] = useState('ac-car');
  const [isFareBreakdownOpen, setIsFareBreakdownOpen] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cash');

  const currentVehicle = vehicles.find(v => v.id === selectedVehicle);
  const currentPaymentMethod = paymentMethods.find(p => p.id === selectedPayment);
  const currentFare = currentVehicle
    ? calculateFare(currentVehicle)
    : { base: 0, distance: 0, time: 0, subtotal: 0, discountAmount: 0, discountLabel: null, total: 0 };

  const handleConfirm = () => {
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

      {/* Discount Banner */}
      {currentFare.discountLabel && (
        <div className="relative z-40 mx-4 mt-3 bg-[#00D47C] rounded-2xl shadow-lg py-3 px-4 flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span className="text-white">
            {currentFare.discountLabel} {t('booking.discountBanner', 'discount applied')}
          </span>
        </div>
      )}

      {/* Spacer to push content to bottom */}
      <div className="flex-1"></div>

      {/* Bottom Content */}
      <div className="relative z-40 bg-white rounded-t-3xl shadow-2xl">
        {/* Fare Breakdown */}
        <div className="px-4 pt-4">
          <button
            onClick={() => setIsFareBreakdownOpen(!isFareBreakdownOpen)}
            className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-2 -mx-2"
          >
            <span className="flex items-center gap-2">
              <span>💰</span>
              <span className="text-black">{t('booking.fareBreakdown', 'FARE BREAKDOWN')}</span>
            </span>
            {isFareBreakdownOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {isFareBreakdownOpen && (
            <div className="mt-2 space-y-2 pb-3 border-b border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('booking.baseFare', 'Base Fare')}</span>
                <span className="text-black">Rs. {currentFare.base.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('booking.distanceCharge', 'Distance charge (5 km)')}</span>
                <span className="text-black">Rs. {currentFare.distance.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('booking.timeCharge', 'Time charge (12 min)')}</span>
                <span className="text-black">Rs. {currentFare.time.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <span className="text-gray-600">{t('booking.subtotal', 'Subtotal')}</span>
                <span className="text-black">Rs. {currentFare.subtotal.toFixed(0)}</span>
              </div>
              {currentFare.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#00D47C]">
                    {t('booking.discount', 'Promo discount')} ({currentFare.discountLabel})
                  </span>
                  <span className="text-[#00D47C]">-Rs. {currentFare.discountAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-black">{t('booking.totalFare', 'Total Fare')}</span>
                <span className="text-black">Rs. {currentFare.total.toFixed(0)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <button
          onClick={() => setIsPaymentSheetOpen(true)}
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {currentPaymentMethod && <currentPaymentMethod.icon className="w-5 h-5 text-gray-600" />}
            <span className="text-black">
              {t('booking.payment', 'Payment')}: {currentPaymentMethod ? t(currentPaymentMethod.nameKey) : ''}
            </span>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>

        <div className="px-4 pb-4 flex items-start gap-2 bg-blue-50 mx-4 rounded-xl p-3">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">{t('booking.payAfterRide', 'You will pay AFTER the ride completes')}</p>
        </div>

        {/* Vehicle Selection */}
        <div className="px-4 py-4 flex gap-3 overflow-x-auto">
          {vehicles.map((vehicle) => {
            const fare = calculateFare(vehicle);
            return (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`relative flex-shrink-0 w-24 rounded-2xl border-2 p-3 transition-all ${
                  selectedVehicle === vehicle.id
                    ? 'border-[#00D47C] bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {fare.discountLabel && (
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {fare.discountLabel}
                  </div>
                )}
                {vehicle.badge && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {vehicle.badge}
                  </div>
                )}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{vehicle.icon}</span>
                  <span className="text-xs text-gray-600">{t(vehicle.name)}</span>
                  {fare.discountAmount > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      Rs. {fare.subtotal.toFixed(0)}
                    </span>
                  )}
                  <span className="text-black">Rs. {fare.total.toFixed(0)}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Action Section */}
        <div className="px-4 pb-6 flex items-center gap-3">
          {/* Price Display */}
          <div className="flex-1 border-2 border-[#00D47C] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">751</span>
              <span className="text-[#00D47C] text-sm">{t('booking.fasterPickup', 'faster pickup')}</span>
            </div>
            <div className="flex items-center gap-3">
              {currentFare.discountAmount > 0 && (
                <span className="text-gray-400 line-through text-xl">
                  Rs. {currentFare.subtotal.toFixed(0)}
                </span>
              )}
              <span className="text-black text-4xl">Rs. {currentFare.total.toFixed(0)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-400 text-sm">615</span>
              <span className="text-[#00D47C] text-sm">{t('booking.longerWait', 'longer wait')}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <button 
            onClick={handleConfirm}
            className="bg-[#00D47C] rounded-2xl p-8 shadow-lg hover:bg-[#00bd6e] transition-colors"
          >
            <Check className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Home Indicator */}
        <div className="pb-2 flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>

      {/* Payment Method Sheet */}
      <Sheet open={isPaymentSheetOpen} onOpenChange={setIsPaymentSheetOpen}>
        <SheetContent side="bottom" className="max-w-md mx-auto rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>{t('booking.paymentSheet.title', 'Select Payment Method')}</SheetTitle>
            <SheetDescription>
              {t('booking.paymentSheet.subtitle', 'Choose how you want to pay for your ride')}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedPayment(method.id);
                    setIsPaymentSheetOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    selectedPayment === method.id
                      ? 'border-[#00D47C] bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${
                    selectedPayment === method.id ? 'bg-[#00D47C]' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      selectedPayment === method.id ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-black">{t(method.nameKey)}</p>
                    <p className="text-sm text-gray-500">{t(method.descriptionKey)}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <Check className="w-6 h-6 text-[#00D47C]" />
                  )}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}