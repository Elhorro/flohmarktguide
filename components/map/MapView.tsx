'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Popup, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Flohmarkt } from '@/lib/types';
import Link from 'next/link';
import TypeBadge from '../TypeBadge';
import { formatDateRange, formatTime as fmtTime } from '@/lib/format';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createCustomIcon() {
  return L.divIcon({
    html: `<div style="
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: '',
  });
}

const formatTime = fmtTime;

interface MapViewProps {
  märkte: Flohmarkt[];
  selectedId?: string | null;
}

function FlyToSelected({ märkte, selectedId }: { märkte: Flohmarkt[]; selectedId?: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const markt = märkte.find((m) => m.id === selectedId);
      if (markt && markt.lat && markt.lng) {
        map.flyTo([markt.lat, markt.lng], 14, { duration: 1.2 });
      }
    }
  }, [selectedId, märkte, map]);

  return null;
}

export default function MapView({ märkte, selectedId }: MapViewProps) {
  const customIcon = createCustomIcon();

  return (
    <MapContainer
      center={[47.07, 15.44]}
      zoom={9}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected märkte={märkte} selectedId={selectedId} />
      {märkte.map((markt) => {
        if (!markt.lat || !markt.lng) return null;
        return (
          <Marker
            key={markt.id}
            position={[markt.lat, markt.lng]}
            icon={customIcon}
          >
            <Popup className="flohmarkt-popup" maxWidth={280}>
              <div className="p-1">
                <div className="mb-1">
                  <TypeBadge typ={markt.market_type} size="sm" />
                </div>
                <h3 className="font-semibold text-stone-800 text-sm leading-snug mb-1">
                  {markt.title}
                </h3>
                <p className="text-xs text-stone-500 mb-0.5">
                  {formatDateRange(markt.date, markt.date_end, { withYear: true, weekday: true })}
                </p>
                <p className="text-xs text-stone-500 mb-0.5">
                  {formatTime(markt.time_start)} – {formatTime(markt.time_end)} Uhr
                </p>
                <p className="text-xs text-stone-500 mb-2">
                  {markt.address}{markt.plz ? ` ${markt.plz}` : ''} {markt.location_name}
                </p>
                <Link
                  href={`/markt/${markt.id}`}
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Details ansehen
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
