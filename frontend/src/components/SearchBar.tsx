import React, { useState } from 'react';
import { Search, SlidersHorizontal, Compass, Utensils, ShoppingBag, Shirt, MapPin } from 'lucide-react';
import { SearchParams } from '../types/hostel';

interface SearchBarProps {
  searchParams: SearchParams;
  onParamsChange: (newParams: SearchParams) => void;
  onKeywordSearch: (keyword: string) => void;
}

export const LOCALITY_PRESETS: Record<string, { lat: number; lon: number; name: string }> = {
  'shivajinagar': { lat: 18.5314, lon: 73.8446, name: 'Shivajinagar' },
  'kothrud': { lat: 18.5074, lon: 73.8077, name: 'Kothrud' },
  'viman_nagar': { lat: 18.5679, lon: 73.9143, name: 'Viman Nagar' },
  'hinjewadi': { lat: 18.5912, lon: 73.7389, name: 'Hinjewadi' },
  'katraj': { lat: 18.4575, lon: 73.8508, name: 'Katraj' },
};

export const SearchBar: React.FC<SearchBarProps> = ({
  searchParams,
  onParamsChange,
  onKeywordSearch,
}) => {
  const [keyword, setKeyword] = useState('');
  const [showAiWeights, setShowAiWeights] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState('shivajinagar');

  const handleLocalitySelect = (key: string) => {
    setSelectedLocality(key);
    const preset = LOCALITY_PRESETS[key];
    if (preset) {
      onParamsChange({
        ...searchParams,
        lat: preset.lat,
        lon: preset.lon,
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onKeywordSearch(keyword.trim());
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 mb-6 border border-slate-800">
      
      {/* Top Search Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        
        {/* Locality Quick Select */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center whitespace-nowrap">
            <MapPin className="h-3.5 w-3.5 mr-1 text-indigo-400" /> Locality:
          </span>
          {Object.entries(LOCALITY_PRESETS).map(([key, loc]) => (
            <button
              key={key}
              onClick={() => handleLocalitySelect(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedLocality === key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center relative">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hostel by name (e.g., Sunshine, Green Stays)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-24 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Find
            </button>
          </div>
        </form>

        {/* AI Preferences Toggle Button */}
        <button
          onClick={() => setShowAiWeights(!showAiWeights)}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
            showAiWeights
              ? 'bg-violet-600/20 text-violet-300 border-violet-500/50'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4 text-violet-400" />
          <span>AI Preferences</span>
        </button>

      </div>

      {/* Radius Slider Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="font-semibold text-slate-400 flex items-center">
            <Compass className="h-3.5 w-3.5 mr-1 text-indigo-400" /> Search Radius:
          </span>
          <input
            type="range"
            min="500"
            max="5000"
            step="250"
            value={searchParams.radius}
            onChange={(e) =>
              onParamsChange({ ...searchParams, radius: Number(e.target.value) })
            }
            className="w-36 accent-indigo-500 cursor-pointer"
          />
          <span className="font-bold text-indigo-400 min-w-[50px]">{searchParams.radius} meters</span>
        </div>

        <div className="text-slate-400">
          Showing smart ranking for <span className="text-white font-medium">{LOCALITY_PRESETS[selectedLocality]?.name || 'Custom Area'}</span>
        </div>
      </div>

      {/* Expandable AI Preference Weight Controls */}
      {showAiWeights && (
        <div className="mt-4 pt-4 border-t border-violet-500/20 bg-violet-950/20 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          
          {/* Distance Weight */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center">
                <Compass className="h-3.5 w-3.5 mr-1.5 text-blue-400" /> Proximity Priority
              </span>
              <span className="font-bold text-blue-400">{Math.round((searchParams.w_dist || 0.5) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={searchParams.w_dist || 0.5}
              onChange={(e) =>
                onParamsChange({ ...searchParams, w_dist: parseFloat(e.target.value) })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Food Weight */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center">
                <Utensils className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Food & Dining
              </span>
              <span className="font-bold text-amber-400">{Math.round((searchParams.w_food || 0.2) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.05"
              value={searchParams.w_food || 0.2}
              onChange={(e) =>
                onParamsChange({ ...searchParams, w_food: parseFloat(e.target.value) })
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Grocery Weight */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center">
                <ShoppingBag className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Grocery Stores
              </span>
              <span className="font-bold text-emerald-400">{Math.round((searchParams.w_grocery || 0.1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.05"
              value={searchParams.w_grocery || 0.1}
              onChange={(e) =>
                onParamsChange({ ...searchParams, w_grocery: parseFloat(e.target.value) })
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Laundry Weight */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center">
                <Shirt className="h-3.5 w-3.5 mr-1.5 text-purple-400" /> Laundry Services
              </span>
              <span className="font-bold text-purple-400">{Math.round((searchParams.w_laundry || 0.1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.05"
              value={searchParams.w_laundry || 0.1}
              onChange={(e) =>
                onParamsChange({ ...searchParams, w_laundry: parseFloat(e.target.value) })
              }
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

        </div>
      )}

    </div>
  );
};
