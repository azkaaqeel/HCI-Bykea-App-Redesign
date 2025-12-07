import { ArrowLeft, Phone, MessageSquare, Navigation, ChevronDown, ChevronUp, MapPin } from './ui/icons';
import { useState, useEffect } from 'react';
import { MapView } from './MapView';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface RideTrackingScreenProps {
  onBack: () => void;
  onCancelRide: () => void;
  pickupLocation: string;
  dropoffLocation: string;
  fare: number;
  driverName: string;
  driverRating: number;
  vehicleDetails: string;
}

export function RideTrackingScreen({
  onBack,
  onCancelRide,
  pickupLocation,
  dropoffLocation,
  fare,
  driverName,
  driverRating,
  vehicleDetails,
}: RideTrackingScreenProps) {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isSafetyExpanded, setIsSafetyExpanded] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(2);
  const [distance, setDistance] = useState(400);
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Simulate live updates for arrival time and distance
  useEffect(() => {
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

    return () => clearInterval(interval);
  }, []);

  const handleEmergencySOS = () => {
    alert('🚨 Emergency SOS Activated!\n\nNotifying:\n• Emergency contacts\n• Local authorities\n• Bykea Safety Team\n\nHelp is on the way!');
  };

  const handleCallDriver = () => {
    alert(`Calling ${driverName}...`);
  };

  const handleChatDriver = () => {
    alert('Opening chat with driver...');
  };

  const handleShareTrip = () => {
    alert('Trip shared via SMS to Mom ✓');
  };

  const handleConfirmCancel = () => {
    onCancelRide();
    setShowCancelDialog(false);
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-10 left-4 z-40 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* ETA Overlay */}
      <div className="absolute top-10 right-4 z-40 bg-[#00D47C] rounded-2xl px-4 py-3 shadow-lg">
        <div className="text-white text-xs">Arriving in</div>
        <div className="text-white text-xl">{arrivalTime.toFixed(1)} min</div>
      </div>

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
            <span className="text-2xl">🏍️</span>
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

      {/* Sliding Bottom Card */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl transition-all duration-300 ${
          isCardMinimized ? 'translate-y-[calc(100%-120px)]' : 'translate-y-0'
        }`}
      >
        {/* Drag Handle */}
        <button 
          onClick={() => setIsCardMinimized(!isCardMinimized)}
          className="w-full py-3 flex justify-center"
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </button>

        <div className="px-4 pb-6 max-h-[70vh] overflow-y-auto">
          {/* Driver Info Section */}
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
            {/* Driver Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D47C] to-[#00a366] flex items-center justify-center text-white text-2xl overflow-hidden">
                <span>👨</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#00D47C] rounded-full p-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            {/* Driver Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg text-black">{driverName}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" fill="#eab308" />
                  <span className="text-sm text-black">{driverRating}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">{vehicleDetails}</div>
              <div className="bg-blue-50 rounded-lg px-3 py-2 text-sm text-blue-800">
                💬 "On my way to pick you up!"
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="grid grid-cols-2 gap-3 py-4 border-b border-gray-100">
            <div className="bg-[#00D47C]/10 rounded-xl p-3">
              <div className="flex items-center gap-2 text-[#00D47C] mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <path d="M12 6v6l4 2" strokeWidth={2} strokeLinecap="round" />
                </svg>
                <span className="text-xs">Arriving in</span>
              </div>
              <div className="text-black text-lg">{arrivalTime.toFixed(1)} min</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Distance</span>
              </div>
              <div className="text-black text-lg">{distance}m away</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 py-4 border-b border-gray-100">
            <button
              onClick={handleCallDriver}
              className="flex flex-col items-center gap-2 bg-[#00D47C] rounded-xl p-4 hover:bg-[#00bd6e] transition-colors"
            >
              <Phone className="w-5 h-5 text-white" />
              <span className="text-xs text-white">Call</span>
            </button>
            <button
              onClick={handleChatDriver}
              className="flex flex-col items-center gap-2 bg-blue-500 rounded-xl p-4 hover:bg-blue-600 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="text-xs text-white">Chat</span>
            </button>
            <button
              onClick={handleShareTrip}
              className="flex flex-col items-center gap-2 bg-purple-500 rounded-xl p-4 hover:bg-purple-600 transition-colors"
            >
              <Navigation className="w-5 h-5 text-white" />
              <span className="text-xs text-white">Share</span>
            </button>
          </div>

          {/* Trip Details - Expandable */}
          <div className="py-4 border-b border-gray-100">
            <button
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="w-full flex items-center justify-between mb-3"
            >
              <span className="text-black">Trip Details</span>
              {isDetailsExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isDetailsExpanded && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#00D47C] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Pickup</div>
                    <div className="text-sm text-black">{pickupLocation}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Dropoff</div>
                    <div className="text-sm text-black">{dropoffLocation}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Fare</div>
                    <div className="text-black">Rs. {fare}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Duration</div>
                    <div className="text-black">~12 min</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Safety Features Section - NEW & IMPRESSIVE */}
          <div className="py-4 border-b border-gray-100">
            <button
              onClick={() => setIsSafetyExpanded(!isSafetyExpanded)}
              className="w-full flex items-center justify-between mb-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <span className="text-black">Safety Features</span>
              </div>
              {isSafetyExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isSafetyExpanded && (
              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Trip shared with: <strong>Mom</strong> (via SMS)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Emergency SOS button active</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Trip recording <strong>ON</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>Live location tracking enabled</span>
                  </div>
                </div>

                {/* Emergency SOS Button */}
                <button
                  data-tutorial="emergency-sos"
                  onClick={handleEmergencySOS}
                  className="w-full bg-white border-2 border-red-500 rounded-xl p-4 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">🚨</span>
                    <span className="text-red-600">EMERGENCY SOS</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Hold for 3 seconds to activate</div>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="pt-4 space-y-3">
            {/* Safety Rating */}
            <div className="bg-green-50 rounded-lg p-3 flex items-center justify-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-sm text-green-800">
                Driver has 5-star safety rating
              </span>
            </div>

            {/* Cancel Ride Link */}
            <button
              data-tutorial="cancel-ride"
              onClick={() => setShowCancelDialog(true)}
              className="w-full text-center text-sm text-red-500 hover:text-red-600 py-2"
            >
              Cancel Ride
            </button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="pb-2 flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full" />
        </div>
      </div>

      {/* Cancel Ride Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-sm mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Ride?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this ride? This action cannot be undone. You may be charged a cancellation fee.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Ride</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, Cancel Ride
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Star icon component (if not already in icons.tsx)
function Star({ className, fill }: { className?: string; fill?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={fill || "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
}
