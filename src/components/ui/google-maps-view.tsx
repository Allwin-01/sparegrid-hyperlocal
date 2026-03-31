import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search, Navigation, Layers, Map as MapIcon, Store, Star, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

// Default shops data (same as Leaflet version)
const DEFAULT_SHOPS = [
  { id: '1', name: 'Elite Motors Hub', lat: 13.0827, lng: 80.2707, address: 'Anna Salai, Chennai', rating: 4.8, specialty: 'Engine Tuning' },
  { id: '2', name: 'Precision Brakes', lat: 13.0405, lng: 80.2337, address: 'T. Nagar, Chennai', rating: 4.5, specialty: 'Braking Systems' },
  { id: '3', name: 'Spark Electricals', lat: 13.0850, lng: 80.2101, address: 'Anna Nagar, Chennai', rating: 4.2, specialty: 'Electrical Diagnostics' },
  { id: '4', name: 'Smooth Ride Suspension', lat: 12.9716, lng: 80.2452, address: 'Adyar, Chennai', rating: 4.7, specialty: 'Suspension & Steering' },
  { id: '5', name: 'Body Craft Studio', lat: 13.0067, lng: 80.2206, address: 'Guindy, Chennai', rating: 4.6, specialty: 'Body Work & Paint' },
];

interface GoogleMapsViewProps {
  className?: string;
}

export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({ className }) => {
  const [center, setCenter] = useState({ lat: 13.0827, lng: 80.2707 });
  const [zoom, setZoom] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={apiKey || ''} libraries={['places']}>
      <MapContent 
        className={className}
        center={center}
        setCenter={setCenter}
        zoom={zoom}
        setZoom={setZoom}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedShop={selectedShop}
        setSelectedShop={setSelectedShop}
        mapTypeId={mapTypeId}
        setMapTypeId={setMapTypeId}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        searchError={searchError}
        setSearchError={setSearchError}
        showDebug={showDebug}
        setShowDebug={setShowDebug}
        apiKey={apiKey}
      />
    </APIProvider>
  );
};

interface MapContentProps {
  className?: string;
  center: { lat: number; lng: number };
  setCenter: (c: { lat: number; lng: number }) => void;
  zoom: number;
  setZoom: (z: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedShop: any;
  setSelectedShop: (s: any) => void;
  mapTypeId: 'roadmap' | 'satellite';
  setMapTypeId: React.Dispatch<React.SetStateAction<'roadmap' | 'satellite'>>;
  isSearching: boolean;
  setIsSearching: (s: boolean) => void;
  searchError: string | null;
  setSearchError: (e: string | null) => void;
  showDebug: boolean;
  setShowDebug: (s: boolean) => void;
  apiKey?: string;
}

const MapContent: React.FC<MapContentProps> = ({
  className,
  center,
  setCenter,
  zoom,
  setZoom,
  searchQuery,
  setSearchQuery,
  selectedShop,
  setSelectedShop,
  mapTypeId,
  setMapTypeId,
  isSearching,
  setIsSearching,
  searchError,
  setSearchError,
  showDebug,
  setShowDebug,
  apiKey
}) => {
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!placesLibrary || !map) return;
    setPlacesService(new placesLibrary.PlacesService(map));
  }, [placesLibrary, map]);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        setZoom(15);
      });
    }
  };

  const handleSearch = async () => {
    if (!placesService || !searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // Reverting to Legacy textSearch since user enabled the "normal" Places API
      placesService.textSearch({ query: searchQuery }, (results, status) => {
        setIsSearching(false);
        console.log("Google Places Search Status:", status);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0].geometry?.location) {
          const location = results[0].geometry.location;
          setCenter({ lat: location.lat(), lng: location.lng() });
          setZoom(15);
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setSearchError("No results found for your query.");
        } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
          setSearchError("API quota exceeded. This usually means billing is not linked or the free tier limit was hit.");
        } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
          setSearchError("Billing Not Enabled. Google requires a linked billing account to use the Places API.");
        } else {
          setSearchError(`Search failed with status: ${status}. Check console for details.`);
        }
      });
    } catch (error) {
      console.error("Search error:", error);
      setIsSearching(false);
      setSearchError("An unexpected error occurred.");
    }
  };

  const filteredShops = DEFAULT_SHOPS.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!apiKey) {
    return (
      <div className={cn("relative h-[500px] w-full flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md text-center p-8", className)}>
        <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4">
          <MapIcon className="text-brand-orange" size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">Google Maps Integration Required</h3>
        <p className="text-white/40 max-w-md mb-6">
          Please add your Google Maps API key to the <strong>Secrets</strong> tab in the Settings menu to activate the map.
        </p>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-white/60">
          Key Name: VITE_GOOGLE_MAPS_API_KEY
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-[500px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md", className)}>
      {/* Controls Overlay */}
      <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-2">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="flex items-center gap-2 rounded-lg bg-black/60 p-1 backdrop-blur-md border border-white/10"
        >
          <div className="flex h-8 items-center px-2 text-white/50">
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </div>
          <input 
            type="text" 
            placeholder="Search locations or shops..." 
            className="h-8 bg-transparent text-sm text-white outline-none placeholder:text-white/30 w-48 md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-orange hover:bg-brand-orange/10 rounded-md transition-colors"
          >
            Search
          </button>
        </form>
        
        <div className="flex gap-2">
          <button 
            onClick={handleLocate}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/60 text-white border border-white/10 hover:bg-brand-orange hover:text-black transition-colors"
            title="Locate Me"
          >
            <Navigation size={18} />
          </button>

          <button 
            onClick={() => setMapTypeId(prev => prev === 'roadmap' ? 'satellite' : 'roadmap')}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/60 text-white border border-white/10 hover:bg-brand-orange hover:text-black transition-colors"
            title="Toggle Map Type"
          >
            {mapTypeId === 'roadmap' ? <Layers size={18} /> : <MapIcon size={18} />}
          </button>
        </div>

        {searchError && (
          <div className="mt-2 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-md max-w-[320px] shadow-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs text-red-100 font-bold mb-1">Search Error</p>
                <p className="text-[11px] text-red-200/80 leading-relaxed">{searchError}</p>
                
                {searchError.includes("Billing") && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[10px] text-white/60 italic">
                      Note: If you just paid the <strong>₹2 verification fee</strong>, you must manually link the account to this project.
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <a 
                        href="https://console.cloud.google.com/billing/projects" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-brand-orange text-black font-bold px-3 py-1.5 rounded-md text-center hover:bg-white transition-colors"
                      >
                        1. Link Billing to Project →
                      </a>
                      <a 
                        href="https://console.cloud.google.com/google/maps-apis/credentials" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-white/10 text-white font-bold px-3 py-1.5 rounded-md text-center hover:bg-white/20 transition-colors"
                      >
                        2. Add "Places API" to Key →
                      </a>
                      <button 
                        onClick={() => setShowDebug(!showDebug)}
                        className="text-[9px] text-white/40 hover:text-white underline mt-1"
                      >
                        {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {showDebug && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/40 uppercase">Key Loaded:</span>
                  <span className={apiKey ? "text-success" : "text-error"}>{apiKey ? "YES" : "NO"}</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/40 uppercase">Key Prefix:</span>
                  <span className={apiKey?.startsWith("AIza") ? "text-success" : "text-error"}>
                    {apiKey ? (apiKey.startsWith("AIza") ? "VALID (AIza...)" : "INVALID FORMAT") : "N/A"}
                  </span>
                </div>
                <div className="p-2 bg-black/40 rounded text-[8px] text-white/40 break-all font-mono">
                  Current Key: {apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : "None"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Map
        center={center}
        zoom={zoom}
        mapTypeId={mapTypeId}
        disableDefaultUI={true}
        onCenterChanged={(ev) => setCenter(ev.detail.center)}
        onZoomChanged={(ev) => setZoom(ev.detail.zoom)}
        styles={[
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#ffffff" }]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#000000" }, { "lightness": 13 }]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#000000" }, { "lightness": 20 }]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 }]
            },
            {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [{ "color": "#000000" }, { "lightness": 20 }]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{ "color": "#000000" }, { "lightness": 21 }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#000000" }, { "lightness": 17 }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#000000" }, { "lightness": 29 }, { "weight": 0.2 }]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [{ "color": "#000000" }, { "lightness": 18 }]
            },
            {
              "featureType": "road.local",
              "elementType": "geometry",
              "stylers": [{ "color": "#000000" }, { "lightness": 16 }]
            },
            {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [{ "color": "#000000" }, { "lightness": 19 }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#000000" }, { "lightness": 17 }]
            }
          ]}
        >
          {filteredShops.map((shop) => (
            <Marker
              key={shop.id}
              position={{ lat: shop.lat, lng: shop.lng }}
              onClick={() => setSelectedShop(shop)}
            />
          ))}

          {selectedShop && (
            <InfoWindow
              position={{ lat: selectedShop.lat, lng: selectedShop.lng }}
              onCloseClick={() => setSelectedShop(null)}
            >
              <div className="p-2 min-w-[200px] text-brand-charcoal">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                    <Store className="text-brand-orange" size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{selectedShop.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{selectedShop.specialty}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-gray-600">
                    <MapPin size={10} className="text-brand-orange" />
                    <span>{selectedShop.address}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-brand-orange" />
                      <span className="text-xs font-bold">{selectedShop.rating}</span>
                    </div>
                    <button className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
    </div>
  );
};
