import React, { useEffect, useState } from 'react';
// @ts-ignore
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// @ts-ignore
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Search, Navigation, Layers, Map as MapIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

const MapContainerAny = MapContainer as any;
const TileLayerAny = TileLayer as any;
const MarkerAny = Marker as any;
const MarkerClusterGroupAny = MarkerClusterGroup as any;

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Shop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  rating: number;
  specialty: string;
}

const DEFAULT_SHOPS: Shop[] = [
  { id: '1', name: 'Elite Motors Hub', lat: 13.0827, lng: 80.2707, address: 'Anna Salai, Chennai', rating: 4.8, specialty: 'Engine Tuning' },
  { id: '2', name: 'Precision Brakes', lat: 13.0405, lng: 80.2337, address: 'T. Nagar, Chennai', rating: 4.5, specialty: 'Braking Systems' },
  { id: '3', name: 'Spark Electricals', lat: 13.0850, lng: 80.2101, address: 'Anna Nagar, Chennai', rating: 4.2, specialty: 'Electrical Diagnostics' },
  { id: '4', name: 'Smooth Ride Suspension', lat: 12.9716, lng: 80.2452, address: 'Adyar, Chennai', rating: 4.7, specialty: 'Suspension & Steering' },
  { id: '5', name: 'Body Craft Studio', lat: 13.0067, lng: 80.2206, address: 'Guindy, Chennai', rating: 4.6, specialty: 'Body Work & Paint' },
];

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const InteractiveMap: React.FC<{ className?: string }> = ({ className }) => {
  const [center, setCenter] = useState<[number, number]>([13.0827, 80.2707]);
  const [zoom, setZoom] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
        setZoom(15);
      });
    }
  };

  const filteredShops = DEFAULT_SHOPS.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className={cn("relative h-[500px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md", className)}>
      {/* Controls Overlay */}
      <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-black/60 p-1 backdrop-blur-md border border-white/10">
          <div className="flex h-8 items-center px-2 text-white/50">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search shops..." 
            className="h-8 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          onClick={handleLocate}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/60 text-white border border-white/10 hover:bg-primary hover:text-black transition-colors"
          title="Locate Me"
        >
          <Navigation size={18} />
        </button>

        <button 
          onClick={() => setMapType(prev => prev === 'streets' ? 'satellite' : 'streets')}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/60 text-white border border-white/10 hover:bg-primary hover:text-black transition-colors"
          title="Toggle Map Type"
        >
          {mapType === 'streets' ? <Layers size={18} /> : <MapIcon size={18} />}
        </button>
      </div>

      <MapContainerAny 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        dragging={!isMobile}
        touchZoom={true}
        scrollWheelZoom={false}
        tap={false}
      >
        <TileLayerAny
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={mapType === 'streets' 
            ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          }
        />
        <ZoomControl position="bottomright" />
        <MapController center={center} zoom={zoom} />
        
        <MarkerClusterGroupAny>
          {filteredShops.map((shop: any) => (
            <MarkerAny 
              key={shop.id} 
              position={[shop.lat, shop.lng]} 
              icon={selectedShop === shop.id ? activeIcon : customIcon}
              eventHandlers={{
                click: () => setSelectedShop(shop.id),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-gray-900">{shop.name}</h3>
                  <p className="text-xs text-gray-600">{shop.address}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary-dark">{shop.specialty}</span>
                    <span className="text-xs font-bold">⭐ {shop.rating}</span>
                  </div>
                </div>
              </Popup>
            </MarkerAny>
          ))}
        </MarkerClusterGroupAny>
      </MapContainerAny>
    </div>
  );
};
