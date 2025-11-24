import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, useMapEvents } from 'react-leaflet';
import type { LatLngTuple, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from './i18n';

const KARACHI_CENTER: LatLngTuple = [24.8607, 67.0011];
const DEFAULT_DROPOFF: LatLngTuple = [24.8715, 67.0498];

type MapInteractionProps = {
  onSelectDropoff: (coordinates: LatLngTuple) => void;
};

function MapInteractions({ onSelectDropoff }: MapInteractionProps) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      onSelectDropoff([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}

export function MapView() {
  const { t } = useTranslation();
  const [userPosition, setUserPosition] = useState<LatLngTuple>(KARACHI_CENTER);
  const [dropoffPosition, setDropoffPosition] = useState<LatLngTuple>(DEFAULT_DROPOFF);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: LatLngTuple = [position.coords.latitude, position.coords.longitude];
        setUserPosition(coords);
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

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={userPosition}
        zoom={14}
        scrollWheelZoom
        className="h-full w-full"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <MapInteractions onSelectDropoff={setDropoffPosition} />

        <Polyline
          positions={[userPosition, dropoffPosition]}
          pathOptions={{ color: '#00D47C', weight: 4, opacity: 0.6, dashArray: '6 6' }}
        />

        <CircleMarker
          center={userPosition}
          radius={12}
          pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.9 }}
        >
          <div className="sr-only">Pickup</div>
        </CircleMarker>

        <CircleMarker
          center={dropoffPosition}
          radius={10}
          pathOptions={{ color: '#16a34a', fillColor: '#16a34a', fillOpacity: 0.9 }}
        />
      </MapContainer>

      <button
        onClick={handleLocateMe}
        className="absolute bottom-36 right-4 z-[1000] rounded-full bg-white px-4 py-2 shadow-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {t('home.locateMe')}
      </button>
    </div>
  );
}