import { Car, Package, Store } from './ui/icons';
import { useState } from 'react';
import { useTranslation } from './i18n';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function BottomNav({ activeTab: externalActiveTab, onTabChange }: BottomNavProps = {}) {
  const { t } = useTranslation();
  const [internalActiveTab, setInternalActiveTab] = useState('ride');
  const activeTab = externalActiveTab || internalActiveTab;
  
  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  return (
    <div className="absolute bottom-8 left-0 right-0 z-20 pointer-events-none">
      <div className="flex items-end justify-around px-6 pb-2 gap-2 pointer-events-auto">
        {/* RIDE */}
        <button
          onClick={() => handleTabChange('ride')}
          className={`flex flex-col items-center justify-end gap-2 px-6 py-3 rounded-3xl transition-all flex-1 ${
            activeTab === 'ride' 
              ? 'bg-green-200 h-24 shadow-lg' 
              : 'bg-gray-100 h-20'
          }`}
        >
          <Car className={`w-6 h-6 ${activeTab === 'ride' ? 'text-green-600' : 'text-gray-600'}`} />
          <span className={`text-xs ${activeTab === 'ride' ? 'text-green-600' : 'text-gray-600'}`}>
            {t('nav.ride')}
          </span>
          {activeTab === 'ride' && (
            <div className="w-12 h-1 bg-green-600 rounded-full absolute bottom-2"></div>
          )}
        </button>

        {/* DELIVERY */}
        <button
          onClick={() => handleTabChange('delivery')}
          className={`flex flex-col items-center justify-end gap-2 px-6 py-3 rounded-3xl transition-all flex-1 ${
            activeTab === 'delivery' 
              ? 'bg-green-200 h-24 shadow-lg' 
              : 'bg-gray-100 h-20'
          }`}
        >
          <Package className={`w-6 h-6 ${activeTab === 'delivery' ? 'text-green-600' : 'text-gray-600'}`} />
          <span className={`text-xs ${activeTab === 'delivery' ? 'text-green-600' : 'text-gray-600'}`}>
            {t('nav.delivery')}
          </span>
        </button>

        {/* SHOPS */}
        <button
          onClick={() => handleTabChange('shops')}
          className={`flex flex-col items-center justify-end gap-2 px-6 py-3 rounded-3xl transition-all flex-1 ${
            activeTab === 'shops' 
              ? 'bg-green-200 h-24 shadow-lg' 
              : 'bg-gray-100 h-20'
          }`}
        >
          <Store className={`w-6 h-6 ${activeTab === 'shops' ? 'text-green-600' : 'text-gray-600'}`} />
          <span className={`text-xs ${activeTab === 'shops' ? 'text-green-600' : 'text-gray-600'}`}>
            {t('nav.shops')}
          </span>
        </button>
      </div>
    </div>
  );
}