import { useState } from 'react';
import { ArrowLeft, MapPin, Edit3, Mic, Banknote, X, Plus, ArrowRight } from './ui/icons';
import { MapView } from './MapView';
import { useTranslation } from './i18n';

interface OrderScreenProps {
  onBack: () => void;
  shopName?: string;
  dropAddress?: string;
  onUpdateLocation?: (location: string) => void;
  onOpenLocationSelection?: () => void;
  onPlaceOrder?: (orderDetails: {
    purchaseValue: number;
    deliveryFare: number;
    voiceNote?: string;
    paymentMethod: string;
  }) => void;
}

export function OrderScreen({ onBack, shopName, dropAddress = '75270 KU Circular Rd University Of', onUpdateLocation, onOpenLocationSelection, onPlaceOrder }: OrderScreenProps) {
  const { t } = useTranslation();
  const [purchaseValue, setPurchaseValue] = useState(1500);
  const [deliveryFare, setDeliveryFare] = useState(180);
  const [voiceNote, setVoiceNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showFareModal, setShowFareModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tempFare, setTempFare] = useState(180);
  const recommendedFare = 200;

  // Breakdown components - calculate based on delivery fare
  const calculateBreakdown = (fare: number) => {
    const base = Math.round(fare * 0.67);
    const distance = Math.round(fare * 0.22);
    const service = fare - base - distance;
    return { base, distance, service };
  };
  
  const breakdown = calculateBreakdown(deliveryFare);
  const baseFare = breakdown.base;
  const distanceFee = breakdown.distance;
  const serviceFee = breakdown.service;

  const handlePlaceOrder = () => {
    onPlaceOrder?.({
      purchaseValue,
      deliveryFare,
      voiceNote,
      paymentMethod,
    });
  };

  const handleFareClick = () => {
    setTempFare(deliveryFare);
    setShowFareModal(true);
  };

  const handleFareConfirm = () => {
    setDeliveryFare(tempFare);
    setShowFareModal(false);
  };

  const handleFareIncrease = () => {
    setTempFare(prev => prev + 10);
  };

  const handleFareDecrease = () => {
    setTempFare(prev => Math.max(0, prev - 10));
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-gray-100 overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapView showRoute={false} />
      </div>

      {/* Drop Location Input Overlay */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="bg-[#00D47C] rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">DROP</p>
                <p className="text-white/90 text-xs">{dropAddress}</p>
              </div>
            </div>
            <button 
              onClick={() => onOpenLocationSelection?.()}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - White Card */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-2xl" style={{ height: '75%' }}>
        <div className="h-full overflow-y-auto pt-6 pb-24">
          <div className="px-4">
            {/* Title */}
            <h1 className="text-3xl font-bold text-[#00D47C] mb-6 text-center">Order</h1>

            {/* Offer Your Fare */}
            <div className="border-2 border-[#00D47C] rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase mb-2">OFFER YOUR FARE</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleFareClick}
                  className="text-2xl font-bold text-black cursor-pointer hover:text-[#00D47C] transition-colors"
                >
                  {deliveryFare} Rs.
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowBreakdown(true)}
                    className="bg-[#00D47C] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#00b869] transition-colors"
                  >
                    Breakdown
                  </button>
                  <button className="bg-[#00D47C] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-[#00b869] transition-colors">
                    Promo <span className="text-lg">+</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Purchase Details */}
            <div className="border-2 border-[#00D47C] rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#00D47C] font-semibold">Purchase Details</p>
                <button className="text-[#00D47C] text-sm hover:underline">Edit</button>
              </div>
              <p className="text-xs text-gray-500 uppercase mb-3">PURCHASE VALUE</p>
              
              {/* Slider */}
              <div className="mb-4">
                <input
                  type="range"
                  min="500"
                  max="2500"
                  step="500"
                  value={purchaseValue}
                  onChange={(e) => setPurchaseValue(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00D47C 0%, #00D47C ${((purchaseValue - 500) / 2000) * 100}%, #e5e7eb ${((purchaseValue - 500) / 2000) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <style>{`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #00D47C;
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #00D47C;
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  }
                `}</style>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>500</span>
                  <span>1000</span>
                  <span>1500</span>
                  <span>2000</span>
                  <span>2500</span>
                </div>
              </div>
              
              <p className="text-xl font-bold text-[#00D47C]">{purchaseValue} Rs.</p>
            </div>

            {/* Voice Note for Driver */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Voice Note for Driver"
                value={voiceNote}
                onChange={(e) => setVoiceNote(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white"
              />
              <div className="flex justify-end mt-2">
                <button className="bg-[#00D47C] text-white rounded-full p-3 shadow-lg hover:bg-[#00b869] transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full border-2 border-[#00D47C] rounded-2xl p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <p className="text-xs text-gray-500 uppercase mb-3">PAYMENT METHOD</p>
              <div className="flex items-center gap-3">
                <Banknote className="w-6 h-6 text-[#00D47C]" />
                <p className="text-lg font-bold text-black">{paymentMethod}</p>
              </div>
            </button>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#00D47C] text-white py-4 rounded-2xl font-bold text-lg mt-6 shadow-lg hover:bg-[#00b869] transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Fare Offer Modal */}
      {showFareModal && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            {/* YOUR FARE Header */}
            <p className="text-xs text-gray-400 uppercase mb-6 text-center">YOUR FARE</p>
            
            {/* Fare Adjustment Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={handleFareDecrease}
                className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <span className="text-2xl font-bold text-gray-700">−</span>
              </button>
              <div className="text-center">
                <span className="text-sm text-gray-400">PKR</span>
                <p className="text-4xl font-bold text-gray-800">{tempFare}</p>
              </div>
              <button
                onClick={handleFareIncrease}
                className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <Plus className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Recommended Fare */}
            <p className="text-sm text-gray-400 text-center mb-6">
              RECOMMENDED FARE: PKR {recommendedFare}
            </p>

            {/* CONFIRM Button */}
            <button
              onClick={handleFareConfirm}
              className="w-full bg-[#00D47C] text-white py-4 rounded-2xl font-bold text-lg mb-4 hover:bg-[#00b869] transition-colors"
            >
              CONFIRM
            </button>

            {/* Fare Breakdown Button */}
            <button
              onClick={() => {
                setShowFareModal(false);
                setShowBreakdown(true);
              }}
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl flex items-center justify-between px-4 hover:bg-gray-200 transition-colors"
            >
              <span className="font-medium">Fare Breakdown</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Select Payment Method</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setPaymentMethod('Cash');
                  setShowPaymentModal(false);
                }}
                className={`w-full border-2 rounded-xl p-4 flex items-center gap-3 text-left transition-colors ${
                  paymentMethod === 'Cash'
                    ? 'border-[#00D47C] bg-green-50'
                    : 'border-gray-200 hover:border-[#00D47C] hover:bg-gray-50'
                }`}
              >
                <Banknote className={`w-6 h-6 ${paymentMethod === 'Cash' ? 'text-[#00D47C]' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <p className={`font-semibold ${paymentMethod === 'Cash' ? 'text-[#00D47C]' : 'text-gray-800'}`}>
                    Cash
                  </p>
                  <p className="text-xs text-gray-500">Pay with cash on delivery</p>
                </div>
                {paymentMethod === 'Cash' && (
                  <div className="w-5 h-5 rounded-full bg-[#00D47C] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </button>
              <button
                onClick={() => {
                  setPaymentMethod('Transfer');
                  setShowPaymentModal(false);
                }}
                className={`w-full border-2 rounded-xl p-4 flex items-center gap-3 text-left transition-colors ${
                  paymentMethod === 'Transfer'
                    ? 'border-[#00D47C] bg-green-50'
                    : 'border-gray-200 hover:border-[#00D47C] hover:bg-gray-50'
                }`}
              >
                <svg
                  className={`w-6 h-6 ${paymentMethod === 'Transfer' ? 'text-[#00D47C]' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <div className="flex-1">
                  <p className={`font-semibold ${paymentMethod === 'Transfer' ? 'text-[#00D47C]' : 'text-gray-800'}`}>
                    Transfer
                  </p>
                  <p className="text-xs text-gray-500">Pay via bank transfer or digital wallet</p>
                </div>
                {paymentMethod === 'Transfer' && (
                  <div className="w-5 h-5 rounded-full bg-[#00D47C] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breakdown Modal */}
      {showBreakdown && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Fare Breakdown</h2>
              <button
                onClick={() => setShowBreakdown(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Base Fare</span>
                <span className="font-semibold text-gray-800">{baseFare} Rs.</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Distance Fee</span>
                <span className="font-semibold text-gray-800">{distanceFee} Rs.</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-semibold text-gray-800">{serviceFee} Rs.</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-[#00D47C]">{deliveryFare} Rs.</span>
              </div>
            </div>
            <button
              onClick={() => setShowBreakdown(false)}
              className="w-full mt-6 bg-[#00D47C] text-white py-3 rounded-xl font-semibold hover:bg-[#00b869] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

