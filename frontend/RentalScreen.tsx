import { ArrowLeft, MapPin, Mic, ChevronRight } from './ui/icons';
import { MapView } from './MapView';
import { useState } from 'react';
import { useTranslation } from './i18n';
import type { LatLngTuple } from 'leaflet';
import { usePageAnnouncement, useVoiceAnnouncements } from './useVoiceAnnouncements';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Home, Briefcase } from './ui/icons';

interface RentalScreenProps {
  onBack: () => void;
  onSelectPickupLocation: (location: string) => void;
  pickupLocation: string;
  onOpenLocationSelection?: () => void;
}

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

export function RentalScreen({
  onBack,
  onSelectPickupLocation,
  pickupLocation,
  onOpenLocationSelection,
}: RentalScreenProps) {
  const { t } = useTranslation();
  const { announceAction } = useVoiceAnnouncements();
  usePageAnnouncement(t('voice.rentalScreen', 'Rental Screen'), [pickupLocation]);
  const [selectedLocation, setSelectedLocation] = useState(pickupLocation || 'My current location');
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [currentLocationPin, setCurrentLocationPin] = useState<LatLngTuple | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngTuple | null>(null);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsLocationSheetOpen(false);
  };

  const handleLocationConfirm = () => {
    // Only navigate when Next button is clicked
    if (selectedLocation) {
      announceAction(t('voice.locationSelected', `Pickup location selected: ${selectedLocation}`));
      onSelectPickupLocation(selectedLocation);
    }
  };

  const handleMapClick = (coords: LatLngTuple) => {
    const locationName = `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
    handleLocationSelect(locationName);
  };

  const handleOpenLocationSelection = () => {
    if (onOpenLocationSelection) {
      onOpenLocationSelection();
    } else {
      setIsLocationSheetOpen(true);
    }
  };

  const handleLocateClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: LatLngTuple = [position.coords.latitude, position.coords.longitude];
          setCurrentLocationPin(coords);
          setMapCenter(coords); // Zoom to location
          // Update selected location to "My current location" (without navigating)
          setSelectedLocation('My current location');
          // Show popup for 3 seconds
          setTimeout(() => {
            setCurrentLocationPin(null);
          }, 3000);
        },
        () => {}
      );
    }
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white z-50 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl text-black">Rentals</h1>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative">
        <MapView 
          showRoute={false} 
          selectionType="pickup" 
          onMapClick={handleMapClick}
          hideLocateButton={true}
          showCurrentLocationPin={true}
          currentLocationPin={currentLocationPin || mapCenter}
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
        
        {/* Locate Button - Top right, below zoom controls */}
        <div className="absolute right-4 top-24 z-40">
          <button 
            onClick={handleLocateClick}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-white rounded-t-3xl shadow-2xl z-50 relative">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="px-4 pb-6">
          <h1 className="text-3xl font-bold text-[#00D47C] mb-1">Rentals</h1>
          <p className="text-sm text-gray-500 mb-4">SELECT PICKUP LOCATION</p>

          {/* Location Options */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
            {/* Current Location Option */}
            <button
              onClick={() => handleLocationSelect('My current location')}
              className={`flex-shrink-0 px-6 py-3 rounded-full border-2 transition-all ${
                selectedLocation === 'My current location'
                  ? 'border-[#00D47C] bg-green-50'
                  : 'border-blue-200 bg-white'
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  selectedLocation === 'My current location'
                    ? 'text-[#00D47C]'
                    : 'text-gray-700'
                }`}
              >
                My current location
              </span>
            </button>
            
            {pickupLocations.map((location) => (
              <button
                key={location}
                onClick={() => handleLocationSelect(location)}
                className={`flex-shrink-0 px-6 py-3 rounded-full border-2 transition-all ${
                  selectedLocation === location
                    ? 'border-[#00D47C] bg-green-50'
                    : 'border-blue-200 bg-white'
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    selectedLocation === location
                      ? 'text-[#00D47C]'
                      : 'text-gray-700'
                  }`}
                >
                  {location}
                </span>
              </button>
            ))}
          </div>

          {/* Next Button - Shows when location is selected */}
          {selectedLocation && (
            <button
              onClick={handleLocationConfirm}
              className="w-full bg-[#00D47C] rounded-xl px-6 py-3 flex items-center justify-center gap-2 shadow-lg hover:bg-[#00bd6e] transition-colors"
            >
              <span className="text-white font-semibold">Next</span>
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}
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
    </div>
  );
}
