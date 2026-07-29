import React, { useState } from 'react';
import { Hostel } from '../types/hostel';
import { HostelCard } from './HostelCard';
import { Sliders, Frown, Sparkles } from 'lucide-react';

interface HostelListProps {
  hostels: Hostel[];
  isLoading: boolean;
  selectedHostelId: number | null;
  onSelectHostel: (hostel: Hostel) => void;
  onViewNearby: (hostel: Hostel) => void;
}

export const HostelList: React.FC<HostelListProps> = ({
  hostels,
  isLoading,
  selectedHostelId,
  onSelectHostel,
  onViewNearby,
}) => {
  const [sortBy, setSortBy] = useState<'score' | 'distance' | 'facilities'>('score');

  const sortedHostels = [...hostels].sort((a, b) => {
    if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
    if (sortBy === 'distance') return a.distance_m - b.distance_m;
    if (sortBy === 'facilities') return (b.facility_count || 0) - (a.facility_count || 0);
    return 0;
  });

  return (
    <div className="flex flex-col h-full">
      
      {/* Header & Sort Controls */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center">
            Discover Accommodations
            <span className="ml-2.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
              {hostels.length} Found
            </span>
          </h2>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <Sliders className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="score">Sort by AI Score</option>
            <option value="distance">Sort by Distance</option>
            <option value="facilities">Sort by Nearby Amenities</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {isLoading ? (
          // Loading Skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 border border-slate-800/60 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-800"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-800/60 rounded w-1/3"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/40">
                <div className="h-6 bg-slate-800/40 rounded"></div>
                <div className="h-6 bg-slate-800/40 rounded"></div>
                <div className="h-6 bg-slate-800/40 rounded"></div>
              </div>
            </div>
          ))
        ) : sortedHostels.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-card rounded-2xl border border-slate-800 my-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mb-3">
              <Frown className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">No Hostels Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Try increasing the search radius or choosing a different locality.
            </p>
          </div>
        ) : (
          // Hostel Cards
          sortedHostels.map((hostel) => (
            <HostelCard
              key={hostel.id}
              hostel={hostel}
              isSelected={selectedHostelId === hostel.id}
              onSelect={onSelectHostel}
              onViewNearby={onViewNearby}
            />
          ))
        )}
      </div>

    </div>
  );
};
