import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SearchBar, LOCALITY_PRESETS } from './components/SearchBar';
import { HostelList } from './components/HostelList';
import { MapView } from './components/MapView';
import { NearbyModal } from './components/NearbyModal';
import { Hostel, NearbyResponse, SearchParams } from './types/hostel';
import { fetchRankedHostels, searchHostelsByName, fetchNearbyServices } from './services/api';

export function App() {
  const [city, setCity] = useState('Pune');
  
  // Default search parameters centered on Shivajinagar, Pune
  const [searchParams, setSearchParams] = useState<SearchParams>({
    lat: LOCALITY_PRESETS['shivajinagar'].lat,
    lon: LOCALITY_PRESETS['shivajinagar'].lon,
    radius: 2000,
    w_dist: 0.5,
    w_food: 0.2,
    w_laundry: 0.1,
    w_grocery: 0.1,
  });

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoadingHostels, setIsLoadingHostels] = useState(false);
  
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [nearbyFacilities, setNearbyFacilities] = useState<NearbyResponse | null>(null);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch ranked hostels on parameter change
  useEffect(() => {
    let isMounted = true;
    async function loadRankedHostels() {
      setIsLoadingHostels(true);
      try {
        const data = await fetchRankedHostels(searchParams);
        if (isMounted) {
          setHostels(data);
          // Auto select first hostel if available
          if (data.length > 0) {
            setSelectedHostel(data[0]);
          } else {
            setSelectedHostel(null);
          }
        }
      } catch (err) {
        console.error('Error loading ranked hostels:', err);
      } finally {
        if (isMounted) setIsLoadingHostels(false);
      }
    }

    loadRankedHostels();
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Fetch nearby facilities when a hostel is selected
  useEffect(() => {
    if (!selectedHostel) {
      setNearbyFacilities(null);
      return;
    }

    let isMounted = true;
    async function loadNearby() {
      setIsLoadingNearby(true);
      try {
        const data = await fetchNearbyServices(selectedHostel!.id, 1000);
        if (isMounted) {
          setNearbyFacilities(data);
        }
      } catch (err) {
        console.error('Error loading nearby services:', err);
      } finally {
        if (isMounted) setIsLoadingNearby(false);
      }
    }

    loadNearby();
    return () => {
      isMounted = false;
    };
  }, [selectedHostel]);

  // Handle keyword search
  const handleKeywordSearch = async (query: string) => {
    setIsLoadingHostels(true);
    try {
      const data = await searchHostelsByName(query);
      setHostels(data);
      if (data.length > 0) {
        setSelectedHostel(data[0]);
        setSearchParams((prev) => ({
          ...prev,
          lat: data[0].lat,
          lon: data[0].lon,
        }));
      }
    } catch (err) {
      console.error('Error searching hostels by keyword:', err);
    } finally {
      setIsLoadingHostels(false);
    }
  };

  const handleOpenNearbyModal = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Header Navigation */}
      <Navbar currentCity={city} onCityChange={setCity} />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        
        {/* Search & AI Filter Controls */}
        <SearchBar
          searchParams={searchParams}
          onParamsChange={setSearchParams}
          onKeywordSearch={handleKeywordSearch}
        />

        {/* Dashboard Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          
          {/* Left Column: Hostel List */}
          <div className="lg:col-span-5 flex flex-col h-[650px] lg:h-auto">
            <HostelList
              hostels={hostels}
              isLoading={isLoadingHostels}
              selectedHostelId={selectedHostel?.id ?? null}
              onSelectHostel={setSelectedHostel}
              onViewNearby={handleOpenNearbyModal}
            />
          </div>

          {/* Right Column: Interactive Leaflet Map */}
          <div className="lg:col-span-7 h-[500px] lg:h-auto">
            <MapView
              center={[searchParams.lat, searchParams.lon]}
              radius={searchParams.radius}
              hostels={hostels}
              selectedHostel={selectedHostel}
              nearbyFacilities={nearbyFacilities?.nearby ?? null}
              onSelectHostel={setSelectedHostel}
            />
          </div>

        </div>

      </main>

      {/* Modal for Detailed Nearby Facilities Breakdown */}
      {isModalOpen && (
        <NearbyModal
          hostel={selectedHostel}
          nearbyData={nearbyFacilities}
          isLoading={isLoadingNearby}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        HostelHub &copy; 2026 — Spatial Database Engine powered by PostgreSQL, PostGIS & OpenStreetMap
      </footer>

    </div>
  );
}

export default App;
