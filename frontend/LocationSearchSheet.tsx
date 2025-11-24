import { Search, MapPin, Clock, X } from './ui/icons';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

interface LocationSearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSelectLocation: (location: string) => void;
}

const recentLocations = [
  'King Tower, Johar Chowrangi Road, Rufi Foundation, Gulshan-e-Iqbal Town',
  'Karachi Clinic & Maternity Home, Gulshan-e-Iqbal',
  'Jamia Darul Khair, Gulistan-e-Johar',
  'Bahadurabad Chowrangi, Karachi',
];

const popularLocations = [
  'Dolmen Mall Clifton',
  'Lucky One Mall',
  'Jinnah International Airport',
  'Sea View Beach',
  'Port Grand Food Street',
  'Nueplex Cinemas DHA',
];

export function LocationSearchSheet({ isOpen, onClose, title, onSelectLocation }: LocationSearchSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecent = recentLocations.filter(loc => 
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPopular = popularLocations.filter(loc => 
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 pb-2 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>{title}</SheetTitle>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </SheetHeader>

          {/* Search Input */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
            </div>
          </div>

          {/* Location Lists */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {/* Recent Locations */}
            {filteredRecent.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <h3 className="text-gray-500">Recent</h3>
                </div>
                <div className="space-y-1">
                  {filteredRecent.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => onSelectLocation(location)}
                      className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                    >
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-black">{location}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Locations */}
            {filteredPopular.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <h3 className="text-gray-500">Popular Places</h3>
                </div>
                <div className="space-y-1">
                  {filteredPopular.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => onSelectLocation(location)}
                      className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                    >
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-black">{location}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery && filteredRecent.length === 0 && filteredPopular.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No locations found</p>
                <p className="text-sm text-gray-400 mt-1">Try searching for a different location</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}