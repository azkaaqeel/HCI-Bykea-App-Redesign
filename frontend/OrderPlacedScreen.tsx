import { Check, MapPin, User, Phone } from './ui/icons';
import { MapView } from './MapView';

interface OrderPlacedScreenProps {
  onDone: () => void;
  trackingId: string;
  pickupAddress: string;
  deliveryAddress: string;
  driverName: string;
  estimatedTime: string;
}

export function OrderPlacedScreen({
  onDone,
  trackingId,
  pickupAddress,
  deliveryAddress,
  driverName,
  estimatedTime,
}: OrderPlacedScreenProps) {
  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1 bg-white z-50">
        <div className="text-black">9:41</div>
        <div className="text-black">75%</div>
      </div>

      {/* Map Background */}
      <div className="h-64 relative">
        <MapView />
        
        {/* Route indicators */}
        <div className="absolute top-1/4 left-1/3">
          <div className="w-8 h-8 bg-[#00D47C] rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-4 h-4 text-white" fill="white" />
          </div>
        </div>
        <div className="absolute top-2/3 right-1/3">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-4 h-4 text-white" fill="white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 shadow-2xl overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#00D47C] rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl text-black mb-2">Your Order Has Been Placed!</h1>
            <p className="text-gray-500">
              Estimated Delivery: <span className="text-black">{estimatedTime}</span>
            </p>
          </div>

          {/* Tracking ID */}
          <div className="bg-[#00D47C]/10 rounded-2xl p-4">
            <div className="text-sm text-gray-600 mb-1">Tracking ID</div>
            <div className="text-xl text-black">{trackingId}</div>
          </div>

          {/* Driver Info */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-black">Your Driver</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-black mb-1">{driverName}</div>
                <div className="text-sm text-gray-500">Honda 125 • Black</div>
              </div>
              <button className="bg-[#00D47C] rounded-full p-3 hover:bg-[#00bd6e] transition-colors">
                <Phone className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Delivery Route */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="text-black mb-2">Delivery Route</div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="w-3 h-3 rounded-full bg-[#00D47C]" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Pick From</div>
                <div className="text-sm text-black">{pickupAddress}</div>
              </div>
            </div>

            <div className="ml-1.5 h-8 w-px bg-gray-300" />

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Deliver To</div>
                <div className="text-sm text-black">{deliveryAddress}</div>
              </div>
            </div>
          </div>

          {/* Status Updates */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📱</div>
              <div>
                <div className="text-black mb-1">Stay Updated</div>
                <div className="text-sm text-gray-600">
                  We'll send you real-time updates via SMS and app notifications
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="flex justify-center">
          <button
            onClick={onDone}
            className="w-full bg-[#00D47C] hover:bg-[#00bd6e] text-white rounded-2xl py-4 transition-colors"
          >
            Done
          </button>
        </div>

        {/* Home Indicator */}
        <div className="pt-4 flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full" />
        </div>
      </div>
    </div>
  );
}
