import React from 'react';
import { X, Utensils, ShoppingBag, Shirt, MapPin, Building2, ExternalLink } from 'lucide-react';
import { Hostel, NearbyResponse } from '../types/hostel';

interface NearbyModalProps {
  hostel: Hostel | null;
  nearbyData: NearbyResponse | null;
  isLoading: boolean;
  onClose: () => void;
}

export const NearbyModal: React.FC<NearbyModalProps> = ({
  hostel,
  nearbyData,
  isLoading,
  onClose,
}) => {
  if (!hostel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 border border-slate-700 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{hostel.name}</h3>
              <p className="text-xs text-slate-400 flex items-center mt-0.5">
                <MapPin className="h-3.5 w-3.5 mr-1 text-slate-500" />
                Nearby Services Directory within 1000m
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent mb-3"></div>
              <p>Querying PostGIS spatial engine for surrounding facilities...</p>
            </div>
          ) : nearbyData ? (
            <>
              {/* Food Category */}
              <div>
                <div className="flex items-center space-x-2 text-sm font-bold text-amber-400 mb-3">
                  <Utensils className="h-4 w-4" />
                  <span>Restaurants & Cafes ({nearbyData.nearby.food.length})</span>
                </div>
                {nearbyData.nearby.food.length === 0 ? (
                  <p className="text-xs text-slate-500 italic pl-6">No restaurants/cafes found within 1km radius.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nearbyData.nearby.food.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                        <span className="font-medium text-slate-200 truncate">{f.name}</span>
                        <span className="font-semibold text-amber-400 shrink-0 ml-2">{f.distance_m}m</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grocery Category */}
              <div>
                <div className="flex items-center space-x-2 text-sm font-bold text-emerald-400 mb-3">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Grocery Stores & Supermarkets ({nearbyData.nearby.grocery.length})</span>
                </div>
                {nearbyData.nearby.grocery.length === 0 ? (
                  <p className="text-xs text-slate-500 italic pl-6">No grocery stores found within 1km radius.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nearbyData.nearby.grocery.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                        <span className="font-medium text-slate-200 truncate">{f.name}</span>
                        <span className="font-semibold text-emerald-400 shrink-0 ml-2">{f.distance_m}m</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Laundry Category */}
              <div>
                <div className="flex items-center space-x-2 text-sm font-bold text-purple-400 mb-3">
                  <Shirt className="h-4 w-4" />
                  <span>Laundry & Dry Cleaning Services ({nearbyData.nearby.laundry.length})</span>
                </div>
                {nearbyData.nearby.laundry.length === 0 ? (
                  <p className="text-xs text-slate-500 italic pl-6">No laundry services found within 1km radius.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nearbyData.nearby.laundry.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                        <span className="font-medium text-slate-200 truncate">{f.name}</span>
                        <span className="font-semibold text-purple-400 shrink-0 ml-2">{f.distance_m}m</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">Unable to load nearby services.</p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
};
