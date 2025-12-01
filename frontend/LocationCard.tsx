import { ArrowUpDown } from './ui/icons';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';

interface LocationCardProps {
  pickupLocation: string;
  dropoffLocation: string;
  onOpenLocationSelection: (type: 'pickup' | 'dropoff') => void;
}

export function LocationCard({ pickupLocation, dropoffLocation, onOpenLocationSelection }: LocationCardProps) {
  const { t } = useTranslation();
  const { isColorblindMode } = useAccessibility();

  return (
    <div className="bg-white rounded-3xl border-2 border-green-400 shadow-xl p-4">
      <div className="flex items-start gap-3">
        {/* Location dots */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <div className="relative">
            <div className="w-3 h-3 rounded-full border-2 border-green-500"></div>
            {isColorblindMode && (
              <span className="absolute -top-1 -right-1 text-blue-600 font-bold text-xs">▲</span>
            )}
          </div>
          <div className="w-0.5 h-3 bg-gray-300"></div>
          <div className="w-0.5 h-3 bg-gray-300"></div>
          <div className="relative">
            <div className="w-3 h-3 rounded-full border-2 border-purple-500"></div>
            {isColorblindMode && (
              <span className="absolute -top-1 -right-1 text-purple-600 font-bold text-xs">●</span>
            )}
          </div>
        </div>

        {/* Location details */}
        <div className="flex-1">
          {/* Pickup location */}
          <button 
            onClick={() => onOpenLocationSelection('pickup')}
            className="mb-4 w-full text-left hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
          >
            <p className="text-xs text-gray-400">{t('home.location.pickupLabel')}</p>
            <p className="text-sm text-black">
              {pickupLocation}
            </p>
          </button>

          {/* Dropoff location */}
          <button 
            onClick={() => onOpenLocationSelection('dropoff')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            {dropoffLocation || t('home.location.dropoffLabel', 'Enter Dropoff')}
          </button>
        </div>

        {/* More options button */}
        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowUpDown className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}