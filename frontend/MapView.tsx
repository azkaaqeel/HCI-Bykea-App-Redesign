import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, useMapEvents, useMap, Marker } from 'react-leaflet';
import type { LatLngTuple, LeafletMouseEvent, DivIcon } from 'leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from './i18n';

const KARACHI_CENTER: LatLngTuple = [24.8607, 67.0011];
const DEFAULT_DROPOFF: LatLngTuple = [24.8715, 67.0498];

type MapInteractionProps = {
  onSelectDropoff: (coordinates: LatLngTuple) => void;
  onMapClick?: (coordinates: LatLngTuple) => void;
};

function MapInteractions({ onSelectDropoff, onMapClick }: MapInteractionProps) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      const coords: LatLngTuple = [event.latlng.lat, event.latlng.lng];
      onSelectDropoff(coords);
      onMapClick?.(coords);
    },
  });

  return null;
}

function RecenterOnUser({ position }: { position: LatLngTuple }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [map, position]);

  return null;
}

type MapViewProps = {
  onUserLocationChange?: (coords: LatLngTuple) => void;
  onMapClick?: (coords: LatLngTuple) => void;
  selectionType?: 'pickup' | 'dropoff';
  showRoute?: boolean;
  homeLabel?: string;
  onLocateRequest?: () => void;
  showCurrentLocationPin?: boolean;
  currentLocationPin?: LatLngTuple | null;
};

export function MapView({
  onUserLocationChange,
  onMapClick,
  selectionType,
  showRoute = true,
  homeLabel,
  onLocateRequest,
  showCurrentLocationPin = false,
  currentLocationPin = null,
}: MapViewProps) {
  const { t } = useTranslation();
  const [userPosition, setUserPosition] = useState<LatLngTuple>(KARACHI_CENTER);
  const [dropoffPosition, setDropoffPosition] = useState<LatLngTuple>(DEFAULT_DROPOFF);
  const [isClient, setIsClient] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LatLngTuple | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: LatLngTuple = [position.coords.latitude, position.coords.longitude];
        setUserPosition(coords);
        setCurrentLocation(coords);
        onUserLocationChange?.(coords);
      },
      () => {
        // swallow error – user may have denied access
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };


  if (!isClient) {
    return <div className="absolute inset-0 bg-gray-100 animate-pulse" />;
  }

  // Simple fake nearby vehicles for home view
  // Visual position for the user chip. Nudge slightly up in home view so it clears mid-screen banners.
  const visualUserPosition: LatLngTuple =
    !showRoute && !selectionType ? [userPosition[0] + 0.002, userPosition[1]] : userPosition;

  const nearbyVehicles: { position: LatLngTuple; type: 'car' | 'rickshaw' }[] = showRoute
    ? []
    : [
        { position: [visualUserPosition[0] + 0.002, visualUserPosition[1] + 0.001], type: 'car' },
        { position: [visualUserPosition[0] - 0.0015, visualUserPosition[1] - 0.001], type: 'rickshaw' },
        { position: [visualUserPosition[0] + 0.001, visualUserPosition[1] - 0.0015], type: 'car' },
      ];

  const getVehicleIcon = (type: 'car' | 'rickshaw'): DivIcon =>
    divIcon({
      html: `<div style="
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: white;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 2px 4px rgba(0,0,0,0.25);
        font-size:18px;
      ">${type === 'car' ? '🚗' : '🛺'}</div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

  const getCurrentLocationPinIcon = (): DivIcon => {
    return divIcon({
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: #2563eb;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
        <div style="
          position: absolute;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid #2563eb;
        "></div>
      `,
      className: 'current-location-pin',
      iconSize: [24, 36],
      iconAnchor: [12, 36],
    });
  };

  const getPinIcon = (color: string): DivIcon =>
    divIcon({
      html: `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        style="transform: translateY(-4px);"
      >
        <path
          d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"
          fill="${color}"
        />
        <circle cx="12" cy="9" r="3" fill="white" />
      </svg>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 24],
    });

  const userHomeIcon: DivIcon = divIcon({
    html: `<div style="
      display:flex;
      align-items:center;
      justify-content:center;
      gap:6px;
      padding:4px 12px;
      border-radius:999px;
      background:white;
      box-shadow:0 2px 4px rgba(0,0,0,0.25);
      font-size:11px;
      color:#111827;
      white-space:nowrap;
    ">
      <span>Your current</span>
      <span style="font-size:14px;">📍</span>
    </div>`,
    className: '',
    iconSize: [100, 28],
    iconAnchor: [50, 14],
  });

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={userPosition}
        zoom={showRoute ? 14 : 16}
        scrollWheelZoom
        className="h-full w-full"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />

        <MapInteractions onSelectDropoff={setDropoffPosition} onMapClick={onMapClick} />

        {/* Keep the map centered on the user's latest position */}
        <RecenterOnUser position={currentLocationPin || currentLocation || userPosition} />

        {showRoute && !selectionType && (
          <Polyline
            positions={[userPosition, dropoffPosition]}
            pathOptions={{ color: '#00D47C', weight: 4, opacity: 0.6, dashArray: '6 6' }}
          />
        )}

        {/* User / pickup marker for route screens only */}
        {showRoute && !selectionType && (
          <CircleMarker
            center={userPosition}
            radius={12}
            pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.9 }}
          >
            <div className="sr-only">Pickup</div>
          </CircleMarker>
        )}

        {/* Home view chip */}
        {!showRoute && !selectionType && (
          <Marker position={visualUserPosition} icon={userHomeIcon} />
        )}

        {/* Single selection pin when choosing pickup/dropoff */}
        {selectionType && (
          <Marker
            position={dropoffPosition}
            icon={getPinIcon(selectionType === 'pickup' ? '#16a34a' : '#ef4444')}
          />
        )}

        {/* Nearby vehicles for simple home view */}
        {!showRoute &&
          nearbyVehicles.map((vehicle, idx) => (
            <Marker
              key={idx}
              position={vehicle.position}
              icon={getVehicleIcon(vehicle.type)}
            />
          ))}

        {/* Current location pin when LOCATE button is clicked */}
        {(showCurrentLocationPin || currentLocationPin) && (currentLocationPin || currentLocation) && (
          <Marker
            position={currentLocationPin || currentLocation!}
            icon={getCurrentLocationPinIcon()}
          />
        )}
      </MapContainer>

      <button
        aria-label={t('home.locateMe')}
        onClick={handleLocateMe}
        className="absolute top-32 right-4 lg:right-6 z-[1000] rounded-full w-10 h-10 flex items-center justify-center bg-white/90 text-gray-700 border border-gray-200 shadow-sm hover:bg-[#00D47C] hover:text-white hover:border-[#00D47C] transition-colors"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
        </svg>
      </button>
    </div>
  );
}