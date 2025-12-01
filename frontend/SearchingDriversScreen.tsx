import { ArrowLeft, X } from './ui/icons';
import { useState, useEffect } from 'react';

interface SearchingDriversScreenProps {
  onBack: () => void;
  onDriversFound: () => void;
  pickupLocation: string;
  dropoffLocation: string;
  vehicleType: string;
}

export function SearchingDriversScreen({
  onBack,
  onDriversFound,
  pickupLocation,
  dropoffLocation,
  vehicleType,
}: SearchingDriversScreenProps) {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    // Auto-navigate to offers screen after 5 seconds
    const timeout = setTimeout(() => {
      onDriversFound();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onDriversFound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-gradient-to-b from-white to-gray-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-black text-xl flex-1">Finding Drivers for You...</h1>
        </div>
      </div>

      {/* Route Summary Card */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-lg">📍</span>
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="text-sm text-black">{pickupLocation}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">📍</span>
            <div>
              <p className="text-xs text-gray-500">To</p>
              <p className="text-sm text-black">{dropoffLocation}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-base">🛣️</span>
              <span className="text-sm text-gray-600">5.2 km</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">⏱️</span>
              <span className="text-sm text-gray-600">~12 minutes</span>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 border border-green-200">
            <p className="text-sm text-green-800">
              <span>💰</span> Your budget: <span>Rs. 400-600</span>
            </p>
          </div>
        </div>
      </div>

      {/* Center Animation */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Animated Ripple Effect */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Ripple circles */}
            <style>{`
              @keyframes ripple {
                0% {
                  transform: scale(1);
                  opacity: 0.6;
                }
                100% {
                  transform: scale(2.5);
                  opacity: 0;
                }
              }
              @keyframes pulse {
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.1);
                }
              }
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .ripple-1 {
                animation: ripple 2s infinite ease-out;
              }
              .ripple-2 {
                animation: ripple 2s infinite ease-out 0.6s;
              }
              .ripple-3 {
                animation: ripple 2s infinite ease-out 1.2s;
              }
              .pulse-icon {
                animation: pulse 1.5s infinite ease-in-out;
              }
              .fade-in-up {
                animation: fadeInUp 0.5s ease-out 0.3s both;
              }
            `}</style>
            <div className="absolute inset-0 rounded-full border-2 border-[#00D47C] ripple-1" />
            <div className="absolute inset-0 rounded-full border-2 border-[#00D47C] ripple-2" />
            <div className="absolute inset-0 rounded-full border-2 border-[#00D47C] ripple-3" />

            {/* Center Icon */}
            <div className="relative z-10 w-20 h-20 bg-[#00D47C] rounded-full flex items-center justify-center shadow-lg pulse-icon">
              <span className="text-4xl">{vehicleType === 'bike' ? '🏍️' : vehicleType === 'rickshaw' ? '🛺' : vehicleType === 'car' ? '🚗' : '🚙'}</span>
            </div>
          </div>

          {/* Status Text */}
          <div className="mt-8 text-center fade-in-up">
            <p className="text-black mb-2 flex items-center justify-center gap-2">
              <span>⏳</span>
              <span>Sending your ride request to nearby drivers</span>
            </p>
            <div className="bg-gray-100 rounded-full px-4 py-2 inline-block">
              <p className="text-sm text-gray-700">
                Waiting for offers... <span className="text-[#00D47C]">{formatTime(timer)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <p className="text-2xl mb-1">👥</p>
            <p className="text-sm text-blue-900">12 drivers nearby</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
            <p className="text-2xl mb-1">📊</p>
            <p className="text-sm text-purple-900">Avg response: 30 sec</p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 mb-4">
          <div className="space-y-2">
            <p className="text-sm text-yellow-900 flex items-start gap-2">
              <span className="flex-shrink-0">💡</span>
              <span>Drivers will send you price offers shortly</span>
            </p>
            <p className="text-sm text-yellow-900 flex items-start gap-2">
              <span className="flex-shrink-0">✨</span>
              <span>You can accept the best offer</span>
            </p>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onBack}
          className="w-full py-4 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel Request
        </button>

        {/* Home Indicator */}
        <div className="pt-4 flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}