import { ArrowLeft, MapPin, Check, X } from './ui/icons';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';

interface HistoryScreenProps {
  onBack: () => void;
}

interface HistoryEntry {
  id: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  vehicleType?: string;
}

export function HistoryScreen({ onBack }: HistoryScreenProps) {
  const { t } = useTranslation();
  const { isColorblindMode } = useAccessibility();

  const historyEntries: HistoryEntry[] = [
    {
      id: '1',
      pickup: 'Karachi University',
      dropoff: 'Habib University',
      fare: 120,
      status: 'pending',
      date: 'Today, 2:30 PM',
      vehicleType: 'Bike',
    },
    {
      id: '2',
      pickup: 'Habib University',
      dropoff: 'Home',
      fare: 129,
      status: 'completed',
      date: 'Yesterday, 5:45 PM',
      vehicleType: 'Car',
    },
    {
      id: '3',
      pickup: 'FAST',
      dropoff: 'Karachi University',
      fare: 93,
      status: 'cancelled',
      date: '2 days ago, 10:15 AM',
      vehicleType: 'Bike',
    },
    {
      id: '4',
      pickup: 'Gulshan-e-Iqbal',
      dropoff: 'DHA Phase 5',
      fare: 250,
      status: 'completed',
      date: '3 days ago, 8:20 PM',
      vehicleType: 'AC Car',
    },
    {
      id: '5',
      pickup: 'Clifton',
      dropoff: 'Saddar',
      fare: 180,
      status: 'completed',
      date: '1 week ago, 3:10 PM',
      vehicleType: 'Rickshaw',
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'completed') return isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]';
    if (status === 'cancelled') return 'text-gray-500';
    return 'text-orange-500';
  };

  const getStatusText = (status: string) => {
    if (status === 'completed') return t('history.completed', 'Completed');
    if (status === 'cancelled') return t('history.cancelled', 'Cancelled');
    return t('history.confirm', 'Confirm');
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#00D47C] px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-semibold text-lg">{t('history.title', 'History')}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {historyEntries.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-3 hover:shadow-md transition-shadow"
          >
            {/* Location Info */}
            <div className="flex items-start gap-3 mb-3">
              {/* Pickup */}
              <div className="flex items-start gap-2 flex-1">
                <div className="relative mt-1">
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    isColorblindMode ? 'border-blue-500' : 'border-[#00D47C]'
                  }`}></div>
                  {isColorblindMode && (
                    <span className="absolute -top-1 -right-1 text-blue-600 font-bold text-xs">▲</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{t('history.pickup', 'Pickup')}</p>
                  <p className="text-sm font-medium text-gray-900">{entry.pickup}</p>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex items-start gap-2 flex-1">
                <div className="relative mt-1">
                  <MapPin className={`w-4 h-4 ${
                    isColorblindMode ? 'text-purple-600' : 'text-red-500'
                  }`} />
                  {isColorblindMode && (
                    <span className="absolute -top-1 -right-1 text-purple-600 font-bold text-xs">●</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{t('history.dropoff', 'Dropoff')}</p>
                  <p className="text-sm font-medium text-gray-900">{entry.dropoff}</p>
                </div>
              </div>
            </div>

            {/* Fare and Status */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('history.fare', 'Fare')}</p>
                <p className="text-lg font-semibold text-gray-900">Rs. {entry.fare}</p>
                {entry.vehicleType && (
                  <p className="text-xs text-gray-400 mt-1">{entry.vehicleType}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">{entry.date}</p>
                {entry.status === 'pending' ? (
                  <button className={`px-4 py-2 rounded-xl text-sm font-medium ${
                    isColorblindMode 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-[#00D47C] text-white hover:bg-[#00be6f]'
                  } transition-colors`}>
                    {getStatusText(entry.status)}
                  </button>
                ) : (
                  <p className={`text-sm font-medium ${getStatusColor(entry.status)}`}>
                    {getStatusText(entry.status)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Home Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}

