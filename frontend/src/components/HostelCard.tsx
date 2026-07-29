import React from 'react';
import { Building2, Navigation, Utensils, ShoppingBag, Shirt, Sparkles, MapPin } from 'lucide-react';
import { Hostel } from '../types/hostel';

interface HostelCardProps {
  hostel: Hostel;
  isSelected: boolean;
  onSelect: (hostel: Hostel) => void;
  onViewNearby: (hostel: Hostel) => void;
}

export const HostelCard: React.FC<HostelCardProps> = ({
  hostel,
  isSelected,
  onSelect,
  onViewNearby,
}) => {
  const scorePercentage = Math.round((hostel.score || 0.5) * 100);

  const getScoreBadgeColor = (score: number = 0) => {
    if (score >= 0.75) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score >= 0.5) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  };

  return (
    <div
      onClick={() => onSelect(hostel)}
      className={`glass-card glass-card-hover rounded-2xl p-4 sm:p-5 cursor-pointer relative overflow-hidden transition-all ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-slate-900/90 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
          : 'border-slate-800/80'
      }`}
    >
      {/* Top Banner Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/90 ring-1 ring-slate-700 text-indigo-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-white tracking-tight line-clamp-1">
              {hostel.name}
            </h3>
            <p className="text-xs text-slate-400 flex items-center mt-0.5">
              <Navigation className="h-3 w-3 mr-1 text-slate-500" />
              {hostel.distance_m >= 1000
                ? `${(hostel.distance_m / 1000).toFixed(1)} km away`
                : `${hostel.distance_m}m away`}
            </p>
          </div>
        </div>

        {/* AI Score Pill */}
        {hostel.score !== undefined && (
          <div className={`shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreBadgeColor(hostel.score)}`}>
            <Sparkles className="h-3 w-3" />
            <span>{scorePercentage}% AI Match</span>
          </div>
        )}
      </div>

      {/* Facility Counters */}
      <div className="grid grid-cols-3 gap-2 py-3 my-2 border-y border-slate-800/60 text-xs">
        <div className="flex items-center justify-center space-x-1.5 py-1 rounded-lg bg-amber-500/5 text-amber-300 ring-1 ring-amber-500/10">
          <Utensils className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-medium">{hostel.food_count ?? 0} Food</span>
        </div>

        <div className="flex items-center justify-center space-x-1.5 py-1 rounded-lg bg-emerald-500/5 text-emerald-300 ring-1 ring-emerald-500/10">
          <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-medium">{hostel.grocery_count ?? 0} Grocery</span>
        </div>

        <div className="flex items-center justify-center space-x-1.5 py-1 rounded-lg bg-purple-500/5 text-purple-300 ring-1 ring-purple-500/10">
          <Shirt className="h-3.5 w-3.5 text-purple-400" />
          <span className="font-medium">{hostel.laundry_count ?? 0} Laundry</span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewNearby(hostel);
          }}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors"
        >
          <span>Explore Nearby Amenities</span>
        </button>
      </div>

    </div>
  );
};
