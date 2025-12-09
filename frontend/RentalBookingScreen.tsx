import { ArrowLeft, MapPin, ChevronUp, ChevronDown, Check, Edit3, ChevronRight, Mic } from './ui/icons';
import type { LatLngTuple } from 'leaflet';
import { MapView } from './MapView';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from './i18n';
import { usePageAnnouncement, useVoiceAnnouncements } from './useVoiceAnnouncements';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Banknote, CreditCard, Wallet, Home, Briefcase, Building } from './ui/icons';

interface RentalBookingScreenProps {
  onBack: () => void;
  onConfirm: (hours: number, vehicleType: string, paymentMethod: string) => void;
  pickupLocation: string;
  onOpenLocationSelection?: () => void;
}

interface VehicleOption {
  id: string;
  name: string;
  icon: string;
  pricePerHour: number;
  badge?: string;
}

const vehicles: VehicleOption[] = [
  {
    id: 'motorcycle',
    name: 'Motorcycle',
    icon: '🏍️',
    pricePerHour: 1000,
  },
  {
    id: 'rickshaw',
    name: 'Rickshaw',
    icon: '🛺',
    pricePerHour: 2200,
  },
  {
    id: 'car',
    name: 'Car',
    icon: '🚗',
    pricePerHour: 2800,
  },
  {
    id: 'car-ac',
    name: 'Car AC',
    icon: '🚙',
    pricePerHour: 3500,
    badge: 'AC',
  },
];

const paymentMethods = [
  { id: 'cash', nameKey: 'booking.payment.cash', icon: Banknote, descriptionKey: 'booking.payment.cashDesc', label: 'Cash' },
  { id: 'bank-transfer', nameKey: 'booking.payment.bankTransfer', icon: Building, descriptionKey: 'booking.payment.bankTransferDesc', label: 'Bank Transfer' },
  { id: 'card', nameKey: 'booking.payment.card', icon: CreditCard, descriptionKey: 'booking.payment.cardDesc', label: 'Card' },
  { id: 'wallet', nameKey: 'booking.payment.wallet', icon: Wallet, descriptionKey: 'booking.payment.walletDesc', label: 'Wallet' },
];

const pickupLocations = [
  'University Of Karachi',
  'Hill Park',
  'National Stadium',
  'Clifton Beach',
  'Dolmen Mall',
  'Port Grand',
];

const savedAddresses = [
  { icon: Home, label: 'Home', address: 'House 23, F-7/2, Islamabad' },
  { icon: Briefcase, label: 'Work', address: 'Blue Area, G-9, Islamabad' },
];

export function RentalBookingScreen({
  onBack,
  onConfirm,
  pickupLocation,
  onOpenLocationSelection,
}: RentalBookingScreenProps) {
  const { t } = useTranslation();
  const { announceAction } = useVoiceAnnouncements();
  usePageAnnouncement(t('voice.rentalBookingScreen', 'Rental Booking Screen'), [pickupLocation]);
  const [selectedHours, setSelectedHours] = useState(2);
  const [selectedVehicle, setSelectedVehicle] = useState('motorcycle');
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [isCashDropdownOpen, setIsCashDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [locationText, setLocationText] = useState(pickupLocation || 'King Tower, Johar Chowrangi...');
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [currentLocationPin, setCurrentLocationPin] = useState<LatLngTuple | null>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  
  const MIN_HOURS = 1;
  const MAX_HOURS = 24;
  const PRICE_INTERVAL = 10;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicle);
  const currentPaymentMethod = paymentMethods.find((p) => p.id === selectedPayment);
  const basePrice = currentVehicle ? currentVehicle.pricePerHour * selectedHours : 0;
  
  // Use custom price if set, otherwise use base price
  const displayPrice = customPrice !== null ? customPrice : basePrice;
  
  // Pricing options (faster pickup vs longer wait)
  const fasterPickupPrice = Math.round(displayPrice * 1.1);
  const longerWaitPrice = Math.round(displayPrice * 0.9);

  // Focus input when editing
  useEffect(() => {
    if (isEditingPrice && priceInputRef.current) {
      priceInputRef.current.focus();
      priceInputRef.current.select();
    }
  }, [isEditingPrice]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCashDropdownOpen(false);
      }
    };

    if (isCashDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCashDropdownOpen]);

  const handleConfirm = () => {
    const vehicleName = vehicles.find(v => v.id === selectedVehicle)?.name || selectedVehicle;
    announceAction(t('voice.rentalConfirmed', `Rental confirmed. ${selectedHours} hours, ${t(vehicleName)}, Payment: ${currentPaymentMethod?.label || 'Cash'}`));
    onConfirm(selectedHours, selectedVehicle, selectedPayment);
  };

  // Handle wheel scroll for hour selection
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) return;
    
    e.preventDefault();
    isScrollingRef.current = true;
    
    if (e.deltaY > 0) {
      setSelectedHours((prev) => Math.max(MIN_HOURS, prev - 1));
    } else {
      setSelectedHours((prev) => Math.min(MAX_HOURS, prev + 1));
    }
    
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 100);
  };

  // Handle touch scroll for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    const startHours = selectedHours;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaY = startY - touch.clientY;
      const deltaHours = Math.round(deltaY / 30);
      const newHours = Math.max(MIN_HOURS, Math.min(MAX_HOURS, startHours + deltaHours));
      setSelectedHours(newHours);
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Arrow button handlers for hours
  const handleDecrease = () => {
    setSelectedHours((prev) => Math.max(MIN_HOURS, prev - 1));
  };

  const handleIncrease = () => {
    setSelectedHours((prev) => Math.min(MAX_HOURS, prev + 1));
  };

  // Price adjustment handlers
  const handlePriceIncrease = () => {
    const currentPrice = customPrice !== null ? customPrice : basePrice;
    const newPrice = Math.round((currentPrice + PRICE_INTERVAL) / PRICE_INTERVAL) * PRICE_INTERVAL;
    setCustomPrice(newPrice);
  };

  const handlePriceDecrease = () => {
    const currentPrice = customPrice !== null ? customPrice : basePrice;
    const newPrice = Math.max(PRICE_INTERVAL, Math.round((currentPrice - PRICE_INTERVAL) / PRICE_INTERVAL) * PRICE_INTERVAL);
    setCustomPrice(newPrice);
  };

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setCustomPrice(null);
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      // Round to nearest 10
      const rounded = Math.round(numValue / PRICE_INTERVAL) * PRICE_INTERVAL;
      setCustomPrice(rounded);
    }
  };

  const handlePriceInputBlur = () => {
    setIsEditingPrice(false);
    if (customPrice === null || customPrice < PRICE_INTERVAL) {
      setCustomPrice(null);
    }
  };

  const handlePriceClick = () => {
    setIsEditingPrice(true);
  };

  const handleOpenLocationSelection = () => {
    if (onOpenLocationSelection) {
      onOpenLocationSelection();
    } else {
      setIsLocationSheetOpen(true);
    }
  };

  const handleLocationSelect = (location: string) => {
    setLocationText(location);
    setIsLocationSheetOpen(false);
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Header - Back Button */}
      <div className="absolute top-0 left-0 z-50">
        <button onClick={onBack} className="p-3 m-3 bg-white rounded-full shadow-lg hover:bg-gray-50">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative">
        <MapView 
          showRoute={false} 
          hideLocateButton={true}
          showCurrentLocationPin={true}
          currentLocationPin={currentLocationPin}
        />
        
        {/* Location Popup - Shows when locate is clicked */}
        {currentLocationPin && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="inline-flex max-w-xs items-center justify-between gap-3 rounded-full bg-white/95 px-4 py-2 text-xs text-gray-700 shadow-lg pointer-events-auto">
              <span className="font-semibold text-[#00D47C]">Your current location</span>
              <span className="truncate">
                {currentLocationPin[0].toFixed(4)}, {currentLocationPin[1].toFixed(4)}
              </span>
            </div>
          </div>
        )}
        
        {/* Locate Button - Below zoom controls on left */}
        <div className="absolute left-4 top-20 z-40">
          <button 
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const coords: LatLngTuple = [position.coords.latitude, position.coords.longitude];
                    setCurrentLocationPin(coords);
                    setLocationText(`${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`);
                    // Show popup for 3 seconds
                    setTimeout(() => {
                      setCurrentLocationPin(null);
                    }, 3000);
                  },
                  () => {}
                );
              }
            }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-5 h-5 text-gray-700" />
          </button>
        </div>

      </div>

      {/* Bottom Content - Position relative for voice button */}
      <div className="bg-white rounded-t-3xl shadow-2xl z-50 relative">
        {/* Voice Button - Centered above content */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 z-50">
          <button className="bg-[#00D47C] rounded-full px-6 py-3 flex items-center justify-center gap-2 shadow-lg hover:bg-[#00bd6e] transition-colors">
            <Mic className="w-5 h-5 text-white" />
            <span className="text-white font-medium">VOICE</span>
          </button>
        </div>

        <div className="px-4 pt-6 pb-6">
          {/* Hour Selection - Vertical Arrows */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Hours</h2>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleIncrease}
                disabled={selectedHours >= MAX_HOURS}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronUp className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Scrollable Hour Display */}
              <div
                ref={scrollContainerRef}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                className="relative w-20 h-20 flex items-center justify-center select-none cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00D47C] transition-all duration-200">
                    {selectedHours}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">hours</div>
                </div>
              </div>

              <button
                onClick={handleDecrease}
                disabled={selectedHours <= MIN_HOURS}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => {
                    setSelectedVehicle(vehicle.id);
                    setCustomPrice(null); // Reset custom price when vehicle changes
                  }}
                  className={`relative flex-shrink-0 w-20 rounded-xl border-2 p-3 transition-all ${
                    selectedVehicle === vehicle.id
                      ? 'border-[#00D47C] bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {vehicle.badge && (
                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {vehicle.badge}
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{vehicle.icon}</span>
                    <span className="text-[10px] text-gray-600 leading-tight text-center">{vehicle.name}</span>
                    <span className={`text-sm font-semibold ${selectedVehicle === vehicle.id ? 'text-[#00D47C]' : 'text-gray-900'}`}>
                      {vehicle.pricePerHour.toLocaleString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Selection and Payment Method */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Price</h2>
              {/* Cash/Payment Dropdown - Aligned with Price title */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsCashDropdownOpen(!isCashDropdownOpen)}
                  className="bg-[#00D47C] rounded-lg px-4 py-2 flex items-center gap-2 shadow-md hover:bg-[#00bd6e] transition-colors"
                >
                  <span className="text-white font-medium">{currentPaymentMethod?.label || 'Cash'}</span>
                  <ChevronDown className={`w-4 h-4 text-white transition-transform ${isCashDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCashDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[160px] z-50">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => {
                          setSelectedPayment(method.id);
                          setIsCashDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          selectedPayment === method.id ? 'bg-green-50' : ''
                        }`}
                      >
                        <span className={`text-sm ${selectedPayment === method.id ? 'text-[#00D47C] font-medium' : 'text-gray-700'}`}>
                          {method.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handlePriceIncrease}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronUp className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Price Display - Clickable to edit */}
              <div className="relative">
                {isEditingPrice ? (
                  <input
                    ref={priceInputRef}
                    type="number"
                    inputMode="numeric"
                    value={customPrice !== null ? customPrice : basePrice}
                    onChange={handlePriceInputChange}
                    onBlur={handlePriceInputBlur}
                    className="w-32 text-center text-4xl font-bold text-[#00D47C] border-2 border-[#00D47C] rounded-xl px-4 py-2 focus:outline-none"
                    min={PRICE_INTERVAL}
                    step={PRICE_INTERVAL}
                  />
                ) : (
                  <button
                    onClick={handlePriceClick}
                    className="text-4xl font-bold text-[#00D47C] transition-all duration-200 hover:opacity-80"
                  >
                    Rs. {displayPrice.toLocaleString()}
                  </button>
                )}
              </div>

              <button
                onClick={handlePriceDecrease}
                disabled={displayPrice <= PRICE_INTERVAL}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">
                {fasterPickupPrice.toLocaleString()} faster pickup • {longerWaitPrice.toLocaleString()} longer wait
              </p>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="w-full bg-[#00D47C] rounded-2xl p-4 flex items-center justify-center gap-2 shadow-lg hover:bg-[#00bd6e] transition-colors"
          >
            <Check className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg">Confirm</span>
          </button>
        </div>
      </div>

      {/* Location Selection Sheet */}
      <Sheet open={isLocationSheetOpen} onOpenChange={setIsLocationSheetOpen}>
        <SheetContent side="bottom" className="max-w-md mx-auto rounded-t-3xl max-h-[80vh]">
          <SheetHeader>
            <SheetTitle>Select Pickup Location</SheetTitle>
            <SheetDescription>Choose your pickup location</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-2 overflow-y-auto">
            {/* Current Location */}
            <button
              onClick={() => handleLocationSelect('My current location')}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 bg-[#00D47C] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <p className="text-black">My current location</p>
            </button>

            {/* Saved Addresses */}
            {savedAddresses.map((address, index) => {
              const Icon = address.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(address.address)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-black">{address.label}</p>
                    <p className="text-sm text-gray-500">{address.address}</p>
                  </div>
                </button>
              );
            })}

            {/* Quick Locations */}
            {pickupLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-black">{location}</p>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Payment Method Sheet */}
      <Sheet open={isPaymentSheetOpen} onOpenChange={setIsPaymentSheetOpen}>
        <SheetContent side="bottom" className="max-w-md mx-auto rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>{t('booking.paymentSheet.title', 'Select Payment Method')}</SheetTitle>
            <SheetDescription>
              {t('booking.paymentSheet.subtitle', 'Choose how you want to pay for your rental')}
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
