'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Loader2, MapPin, CheckCircle } from 'lucide-react';

// Fix default Leaflet marker icons (webpack strips the default url resolution)
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface LatLng {
  lat: number;
  lng: number;
}

export interface LocationPickerProps {
  onChange: (loc: LatLng) => void;
  adresse?: string;
  stadt?: string;
}

// Austria geographic center
const AUSTRIA_CENTER: [number, number] = [47.5, 14.0];
const AUSTRIA_ZOOM = 7;
const DETAIL_ZOOM = 15;

/** Flies the map to a new position whenever `position` changes. */
function MapFlyTo({ position }: { position: LatLng | null }) {
  const map = useMap();
  const prevRef = useRef<LatLng | null>(null);

  useEffect(() => {
    if (!position) return;
    if (
      prevRef.current?.lat === position.lat &&
      prevRef.current?.lng === position.lng
    )
      return;
    prevRef.current = position;
    map.flyTo([position.lat, position.lng], DETAIL_ZOOM, { duration: 0.8 });
  }, [position, map]);

  return null;
}

/** Fires `onMapClick` whenever the user clicks on the map. */
function MapClickHandler({ onMapClick }: { onMapClick: (ll: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ onChange, adresse, stadt }: LocationPickerProps) {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeStatus, setGeocodeStatus] = useState<'idle' | 'found' | 'notfound'>('idle');

  const handleMapClick = useCallback(
    (ll: LatLng) => {
      setPosition(ll);
      setGeocodeStatus('idle');
      onChange(ll);
    },
    [onChange],
  );

  const geocodeAddress = useCallback(async () => {
    const q = [adresse, stadt, 'Austria'].filter(Boolean).join(' ');
    if (!q.trim()) return;

    setGeocoding(true);
    setGeocodeStatus('idle');
    try {
      const encoded = encodeURIComponent(q);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=at`,
        { headers: { 'User-Agent': 'FlohmarktKalender/1.0 (leopold.kumpusch@gmail.com)' } },
      );
      const results: Array<{ lat: string; lon: string }> = await res.json();
      if (results.length > 0) {
        const ll = { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
        setPosition(ll);
        setGeocodeStatus('found');
        onChange(ll);
      } else {
        setGeocodeStatus('notfound');
      }
    } catch {
      setGeocodeStatus('notfound');
    } finally {
      setGeocoding(false);
    }
  }, [adresse, stadt, onChange]);

  const canGeocode = Boolean(adresse || stadt);

  return (
    <div className="space-y-3">
      {/* Geocode button + status */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={geocodeAddress}
          disabled={geocoding || !canGeocode}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {geocoding ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Search size={14} />
          )}
          Adresse auf Karte finden
        </button>

        {geocodeStatus === 'found' && (
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <CheckCircle size={14} />
            Standort gefunden
          </span>
        )}
        {geocodeStatus === 'notfound' && (
          <span className="text-red-500 text-sm">
            Adresse nicht gefunden – auf Karte klicken
          </span>
        )}
      </div>

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden border border-stone-200" style={{ height: 260 }}>
        <MapContainer
          center={AUSTRIA_CENTER}
          zoom={AUSTRIA_ZOOM}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapFlyTo position={position} />
          <MapClickHandler onMapClick={handleMapClick} />
          {position && <Marker position={[position.lat, position.lng]} />}
        </MapContainer>

        {/* Hint overlay when no position set */}
        {!position && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-[1000]">
            <span className="bg-white/90 backdrop-blur-sm text-stone-500 text-xs px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-stone-100">
              <MapPin size={12} className="text-orange-400" />
              Auf Karte klicken, um Standort zu setzen
            </span>
          </div>
        )}
      </div>

      {/* Coordinates hint */}
      {position && (
        <p className="text-xs text-stone-400">
          📍 {position.lat.toFixed(5)}, {position.lng.toFixed(5)} &mdash; Erneut klicken zum Korrigieren.
        </p>
      )}
    </div>
  );
}
