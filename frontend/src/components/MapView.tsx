import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Hostel, Facility } from '../types/hostel';

// Custom Marker Icons using SVG Data URLs
const createCustomIcon = (color: string, label: string = '') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -36],
  });
};

const hostelIcon = createCustomIcon('#6366f1'); // Indigo
const selectedHostelIcon = createCustomIcon('#ec4899'); // Pink
const groceryIcon = createCustomIcon('#10b981'); // Emerald
const foodIcon = createCustomIcon('#f59e0b'); // Amber
const laundryIcon = createCustomIcon('#a855f7'); // Purple

// Helper component to handle dynamic map pan & zoom
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

interface MapViewProps {
  center: [number, number];
  radius: number;
  hostels: Hostel[];
  selectedHostel: Hostel | null;
  nearbyFacilities: {
    grocery: Facility[];
    food: Facility[];
    laundry: Facility[];
  } | null;
  onSelectHostel: (hostel: Hostel) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  center,
  radius,
  hostels,
  selectedHostel,
  nearbyFacilities,
  onSelectHostel,
}) => {
  const mapCenter: [number, number] = selectedHostel
    ? [selectedHostel.lat, selectedHostel.lon]
    : center;

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      
      {/* Map Legend Floating Widget */}
      <div className="absolute top-3 right-3 z-[1000] glass-card px-3 py-2 rounded-xl text-xs flex items-center space-x-3 text-slate-200 border border-slate-800 shadow-lg">
        <div className="flex items-center space-x-1">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
          <span>Hostel</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
          <span>Food</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span>Grocery</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
          <span>Laundry</span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapRecenter center={mapCenter} />

        {/* Dark Tile Layer (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Radius Circle Overlay */}
        <Circle
          center={center}
          radius={radius}
          pathOptions={{
            color: '#6366f1',
            fillColor: '#6366f1',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '4, 8',
          }}
        />

        {/* Render Hostel Markers */}
        {hostels.map((hostel) => {
          const isSelected = selectedHostel?.id === hostel.id;
          return (
            <Marker
              key={hostel.id}
              position={[hostel.lat, hostel.lon]}
              icon={isSelected ? selectedHostelIcon : hostelIcon}
              eventHandlers={{
                click: () => onSelectHostel(hostel),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[160px]">
                  <h4 className="font-bold text-sm text-slate-100">{hostel.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    📍 {hostel.distance_m}m from search center
                  </p>
                  {hostel.score !== undefined && (
                    <div className="mt-2 text-xs font-semibold text-indigo-400">
                      AI Score: {Math.round(hostel.score * 100)}% Match
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Render Nearby Facilities for Selected Hostel */}
        {nearbyFacilities?.food.map((facility) => (
          <Marker
            key={`food-${facility.id}`}
            position={[facility.lat, facility.lon]}
            icon={foodIcon}
          >
            <Popup>
              <div className="p-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Food & Cafe</span>
                <h4 className="font-bold text-xs text-slate-100">{facility.name}</h4>
                <p className="text-xs text-slate-400">{facility.distance_m}m from hostel</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {nearbyFacilities?.grocery.map((facility) => (
          <Marker
            key={`grocery-${facility.id}`}
            position={[facility.lat, facility.lon]}
            icon={groceryIcon}
          >
            <Popup>
              <div className="p-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Grocery</span>
                <h4 className="font-bold text-xs text-slate-100">{facility.name}</h4>
                <p className="text-xs text-slate-400">{facility.distance_m}m from hostel</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {nearbyFacilities?.laundry.map((facility) => (
          <Marker
            key={`laundry-${facility.id}`}
            position={[facility.lat, facility.lon]}
            icon={laundryIcon}
          >
            <Popup>
              <div className="p-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Laundry</span>
                <h4 className="font-bold text-xs text-slate-100">{facility.name}</h4>
                <p className="text-xs text-slate-400">{facility.distance_m}m from hostel</p>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
};
