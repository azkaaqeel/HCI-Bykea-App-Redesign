import { ArrowLeft, MapPin, Home, Briefcase, Plus, Search } from './ui/icons';
import { useState } from 'react';
import { useTranslation } from './i18n';
import { MapView } from './MapView';

interface LocationSelectionScreenProps {
  onBack: () => void;
  onSelectLocation: (location: string) => void;
  type: 'pickup' | 'dropoff';
}

const savedAddresses = (t: (key: string) => string) => [
  { icon: Home, label: t('location.home'), address: 'House 23, F-7/2, Islamabad' },
  { icon: Briefcase, label: t('location.work'), address: 'Blue Area, G-9, Islamabad' },
];

const recentLocations = (t: (key: string) => string) => [
  t('location.recent.fastUniversity'),
  t('location.recent.centaurusMall'),
  t('location.recent.jinnahSuperMarket'),
];

const areas = (t: (key: string) => string) => [
  { en: 'Karachi', ur: t('location.areas.karachi') },
  { en: 'Surjani Town', ur: t('location.areas.surjaniTown') },
  { en: 'New Karachi', ur: t('location.areas.newKarachi') },
  { en: 'North Nazimabad', ur: t('location.areas.northNazimabad') },
  { en: 'FB Area', ur: t('location.areas.fbArea') },
  { en: 'Gulshan-e-Maymar', ur: t('location.areas.gulshanMaymar') },
  { en: 'Sohrab Goth', ur: t('location.areas.sohrabGoth') },
  { en: 'Scheme 33', ur: t('location.areas.scheme33') },
  { en: 'Gulistan-e-Johar', ur: t('location.areas.gulistanJohar') },
  { en: 'Malir & Airport', ur: t('location.areas.malirAirport') },
  { en: 'Landhi', ur: t('location.areas.landhi') },
  { en: 'Shah Faisal Town', ur: t('location.areas.shahFaisalTown') },
  { en: 'Korangi', ur: t('location.areas.korangi') },
  { en: 'PAF', ur: t('location.areas.paf') },
  { en: 'Mehmoodabad', ur: t('location.areas.mehmoodabad') },
  { en: 'Qayyumabad', ur: t('location.areas.qayyumabad') },
];

export function LocationSelectionScreen({ onBack, onSelectLocation, type }: LocationSelectionScreenProps) {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'recent' | 'map' | 'area'>('area');
  const [searchQuery, setSearchQuery] = useState('');

  const areaList = areas(t);
  const filteredAreas = areaList.filter(area => {
    const displayName = language === 'ur' ? area.ur : area.en;
    return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           area.en.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const recentList = recentLocations(t);
  const filteredRecent = recentList.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <div className="text-black">9:55</div>
        <div className="flex items-center gap-1">
          <div className="text-black">56</div>
        </div>
      </div>

      {/* Header with Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('location.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-[#00D47C] rounded-full focus:outline-none text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 py-2 px-4 rounded-full transition-all ${
              activeTab === 'recent'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            {t('location.recent')}
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-2 px-4 rounded-full transition-all ${
              activeTab === 'map'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            {t('location.map')}
          </button>
          <button
            onClick={() => setActiveTab('area')}
            className={`flex-1 py-2 px-4 rounded-full transition-all ${
              activeTab === 'area'
                ? 'bg-[#00D47C] text-white shadow-sm'
                : 'text-gray-500'
            }`}
          >
            {t('location.area')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'recent' && (
          <div className="px-4">
            {/* Use Current Location */}
            <button className="w-full bg-[#00D47C] text-white rounded-xl py-4 px-6 flex items-center justify-center gap-3 mb-6 shadow-lg">
              <MapPin className="w-6 h-6" />
              <span>{t('location.useCurrent')}</span>
            </button>

            {/* Saved Addresses */}
            <div className="mb-6">
              <h3 className="text-gray-600 mb-3">{t('location.savedAddresses')}</h3>
              <div className="space-y-1">
                {savedAddresses(t).map((address, index) => {
                  const Icon = address.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => onSelectLocation(address.address)}
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
                <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Plus className="w-5 h-5 text-[#00D47C]" />
                  </div>
                  <p className="text-[#00D47C]">{t('location.addNew')}</p>
                </button>
              </div>
            </div>

            {/* Recent Locations */}
            <div>
              <h3 className="text-gray-600 mb-3">{t('location.recentLocations')}</h3>
              <div className="space-y-1">
                {filteredRecent.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectLocation(location)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-black">{location}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-full relative">
            <MapView />
          </div>
        )}

        {activeTab === 'area' && (
          <div className="px-4">
            <h3 className="text-gray-600 mb-3">{language === 'ur' ? t('location.areas.karachi') : 'Karachi'}</h3>
            <div className="space-y-1 pb-6">
              {/* Current Location as first option */}
              <button
                onClick={() => onSelectLocation('Current Location')}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-[#00D47C] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <p className="text-black">{t('location.currentLocation')}</p>
              </button>

              {filteredAreas.map((area, index) => {
                const displayName = language === 'ur' ? area.ur : area.en;
                return (
                  <button
                    key={index}
                    onClick={() => onSelectLocation(area.en)}
                    className="w-full text-left p-4 hover:bg-gray-50 rounded-xl transition-colors text-black"
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Home Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}