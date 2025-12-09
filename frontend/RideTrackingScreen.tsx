import { Phone, MessageSquare, Share2, Star, X, MapPin } from './ui/icons';
import { useState, useEffect } from 'react';
import { MapView } from './MapView';
import { useTranslation } from './i18n';
import { usePageAnnouncement, useVoiceAnnouncements } from './useVoiceAnnouncements';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from './ui/sheet';

interface RideTrackingScreenProps {
  onCancelRide: () => void;
  onOpenChat: () => void;
  pickupLocation: string;
  dropoffLocation: string;
  fare: number;
  driver: {
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
    isVerified: boolean;
    phoneNumber?: string; // Optional phone number for calling
  };
}

type RideState = 'arriving' | 'driver-here' | 'ride-in-progress' | 'ride-completed';

const CANCEL_REASONS = [
  'Driver taking too long',
  'Wrong pickup location',
  'Change of plans',
  'Found another ride',
  'Other',
];

export function RideTrackingScreen({
  onCancelRide,
  onOpenChat,
  pickupLocation,
  dropoffLocation,
  fare,
  driver,
}: RideTrackingScreenProps) {
  const { t } = useTranslation();
  const { announceInfo, announceAction } = useVoiceAnnouncements();
  usePageAnnouncement(t('voice.rideTracking', 'Ride Tracking'), [driver.name]);
  
  const [rideState, setRideState] = useState<RideState>('arriving');
  const [arrivalTime, setArrivalTime] = useState(2);
  const [distance, setDistance] = useState(400);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState<string>('');
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  // Simulate ride state transitions
  useEffect(() => {
    if (rideState === 'arriving') {
      // Update arrival time and distance
    const interval = setInterval(() => {
      setDistance((prev) => {
        const newDistance = prev - 15;
        return newDistance > 50 ? newDistance : 50;
      });
      
      setArrivalTime((prev) => {
        const newTime = prev - 0.1;
        return newTime > 0.5 ? newTime : 0.5;
      });
    }, 3000);

      // Transition to "driver here" after 10-20 seconds (faster for testing)
      const timer = setTimeout(() => {
        setRideState('driver-here');
        announceInfo('Driver has arrived at pickup location');
      }, 10000 + Math.random() * 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [rideState]); // Removed announceInfo from dependencies

  const handleStartRide = () => {
    setRideState('ride-in-progress');
    announceAction('Ride started');
    
    // Simulate ride completion after 20-40 seconds
    setTimeout(() => {
      setRideState('ride-completed');
      setShowRating(true);
      announceInfo('Ride completed. Please rate your driver.');
    }, 20000 + Math.random() * 20000);
  };

  const handleCallDriver = () => {
    const phoneNumber = driver.phoneNumber || '+923001234567'; // Default phone number
    window.location.href = `tel:${phoneNumber}`;
    announceAction(`Calling ${driver.name}`);
  };

  const handleChatDriver = () => {
    onOpenChat();
    announceAction('Opening chat with driver');
  };

  const handleShareTrip = async () => {
    const shareData = {
      title: 'My Ride',
      text: `I'm taking a ride with ${driver.name} (${driver.rating}⭐). Pickup: ${pickupLocation}, Dropoff: ${dropoffLocation}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        announceAction('Trip shared');
      } else {
        // Fallback: Copy to clipboard
        const textToCopy = `${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(textToCopy);
        alert('Trip details copied to clipboard!');
        announceAction('Trip details copied');
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed:', error);
    }
  };

  const handleCancelRide = () => {
    if (!selectedCancelReason && customCancelReason.trim() === '') {
      alert('Please select or enter a cancellation reason');
      return;
    }
    
    const reason = selectedCancelReason === 'Other' ? customCancelReason : selectedCancelReason;
    console.log('Cancelling ride. Reason:', reason);
    onCancelRide();
    setShowCancelSheet(false);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    console.log('Rating submitted:', rating);
    announceAction(`Rating of ${rating} stars submitted`);
    // Navigate back to home or show completion screen
    onCancelRide(); // For now, just go back to home
  };

  const driverInitial = driver.name.charAt(0).toUpperCase();
  const vehicleDisplay = `${driver.vehicleType === 'Bike' ? '🏍️' : '🚗'} ${driver.vehicleModel} • ${driver.vehicleColor} • ${driver.vehiclePlate}`;

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* ETA Overlay (top-right) */}
      {rideState === 'arriving' && (
        <div className="absolute top-6 right-4 z-40 bg-[#00D47C] rounded-2xl px-4 py-3 shadow-lg">
        <div className="text-white text-xs">Arriving in</div>
          <div className="text-white text-xl font-bold">{arrivalTime.toFixed(1)} min</div>
      </div>
      )}

      {/* Full Screen Map */}
      <div className="absolute inset-0">
        <MapView />
        
        {/* Your Location Pin - Green */}
        <div className="absolute top-[60%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
          <div className="relative">
            <MapPin className="w-8 h-8 text-[#00D47C]" fill="#00D47C" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#00D47C] rounded-full w-3 h-3 animate-ping" />
          </div>
        </div>

        {/* Driver Location - Motorcycle Icon */}
        <div className="absolute top-[35%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000">
          <div className="relative bg-white rounded-full p-2 shadow-lg">
            <span className="text-2xl">{driver.vehicleType === 'Bike' ? '🏍️' : '🚗'}</span>
            <div className="absolute -top-1 -right-1 bg-[#00D47C] rounded-full w-3 h-3 border-2 border-white" />
          </div>
        </div>

        {/* Route Line Simulation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#00D47C', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#0ea5e9', stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>
          <path
            d="M 180 420 Q 250 350, 220 280"
            stroke="url(#routeGradient)"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8 4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom Card - Compact Driver Info */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl">
        {/* Drag Handle */}
        <div className="w-full py-3 flex justify-center">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-6">
          {/* Driver Info Section - Compact (200-260px max) */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            {/* Driver Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00D47C] to-[#00a366] flex items-center justify-center text-white text-xl overflow-hidden">
                <span>{driver.photo || driverInitial}</span>
              </div>
              {driver.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              )}
            </div>

            {/* Driver Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-semibold text-black truncate">{driver.name}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-700">{driver.rating}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-2 truncate">{vehicleDisplay}</div>
              
              {/* Ride State Messages */}
              {rideState === 'arriving' && (
                <div className="bg-blue-50 rounded-lg px-2 py-1 text-xs text-blue-800">
                  Arriving in {arrivalTime.toFixed(1)} min • {distance}m away
              </div>
              )}
              {rideState === 'driver-here' && (
                <div className="bg-green-50 rounded-lg px-2 py-1 text-xs text-green-800">
                  Driver is here
            </div>
              )}
              {rideState === 'ride-in-progress' && (
                <div className="bg-purple-50 rounded-lg px-2 py-1 text-xs text-purple-800">
                  Ride in progress
              </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Compact Rounded-Pill Style */}
          <div className="flex gap-2 py-3 border-b border-gray-100">
            <button
              onClick={handleCallDriver}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-4 h-4 text-gray-700" />
              <span className="text-xs text-gray-700 font-medium">Call</span>
            </button>
            <button
              onClick={handleChatDriver}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-gray-700" />
              <span className="text-xs text-gray-700 font-medium">Chat</span>
            </button>
            <button
              onClick={handleShareTrip}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4 text-gray-700" />
              <span className="text-xs text-gray-700 font-medium">Share</span>
            </button>
          </div>

          {/* Ride State Actions */}
          {rideState === 'driver-here' && (
            <div className="pt-3">
            <button
                onClick={handleStartRide}
                className="w-full bg-[#00D47C] text-white py-3 rounded-xl font-semibold hover:bg-[#00bd6e] transition-colors"
              >
                Start Ride
            </button>
              </div>
            )}

          {/* Cancel Ride Link */}
          {rideState !== 'ride-completed' && (
            <button
              onClick={() => setShowCancelSheet(true)}
              className="w-full text-center text-sm text-red-500 hover:text-red-600 py-2 mt-2"
            >
              Cancel Ride
            </button>
          )}

          {/* Rating Section (when ride completed) */}
          {showRating && rideState === 'ride-completed' && (
            <div className="pt-4 space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black mb-2">Rate your driver</h3>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
            </button>
                  ))}
                  </div>
                </div>
                <button
                onClick={handleSubmitRating}
                className="w-full bg-[#00D47C] text-white py-3 rounded-xl font-semibold hover:bg-[#00bd6e] transition-colors"
              >
                Submit Rating
                </button>
              </div>
            )}
        </div>

        {/* Home Indicator */}
        <div className="pb-2 flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full" />
        </div>
      </div>

      {/* Cancel Ride Bottom Sheet */}
      <Sheet open={showCancelSheet} onOpenChange={setShowCancelSheet}>
        <SheetContent side="bottom" className="max-h-[80vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-left">Cancel Ride</SheetTitle>
          </SheetHeader>
          
          <div className="px-4 py-4 space-y-3">
            <p className="text-sm text-gray-600 mb-4">Please select a reason for cancellation:</p>
            
            {/* Cancel Reasons */}
            <div className="space-y-2">
              {CANCEL_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    setSelectedCancelReason(reason);
                    if (reason !== 'Other') {
                      setCustomCancelReason('');
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedCancelReason === reason
                      ? 'border-[#00D47C] bg-green-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm ${selectedCancelReason === reason ? 'text-[#00D47C] font-medium' : 'text-gray-700'}`}>
                    {reason}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Reason Input */}
            {selectedCancelReason === 'Other' && (
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-2">Please specify:</label>
                <textarea
                  value={customCancelReason}
                  onChange={(e) => setCustomCancelReason(e.target.value)}
                  placeholder="Enter your reason..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#00D47C]"
                  rows={3}
                />
              </div>
            )}
          </div>

          <SheetFooter className="px-4 pb-4">
            <button
              onClick={() => setShowCancelSheet(false)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Keep Ride
            </button>
            <button
              onClick={handleCancelRide}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
            >
              Confirm Cancel
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
