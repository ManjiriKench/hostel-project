import React from 'react';
import { Building2, Sparkles, MapPin, Layers } from 'lucide-react';

interface NavbarProps {
  currentCity: string;
  onCityChange: (city: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentCity, onCityChange }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/25">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">Hostel<span className="text-indigo-400">Hub</span></span>
              <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
                <Sparkles className="mr-1 h-3 w-3 text-indigo-400" /> AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Smart Accommodation & Local Service Discovery</p>
          </div>
        </div>

        {/* City Selector & Controls */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center rounded-xl bg-slate-900/90 px-3 py-1.5 ring-1 ring-slate-800">
            <MapPin className="mr-2 h-4 w-4 text-indigo-400" />
            <select
              value={currentCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Pune" className="bg-slate-900 text-slate-200">Pune, MH</option>
              <option value="Mumbai" className="bg-slate-900 text-slate-200">Mumbai, MH</option>
              <option value="Bengaluru" className="bg-slate-900 text-slate-200">Bengaluru, KA</option>
              <option value="Delhi" className="bg-slate-900 text-slate-200">Delhi, DL</option>
            </select>
          </div>

          <div className="hidden md:flex items-center space-x-2 rounded-xl bg-emerald-500/10 px-3 py-1.5 ring-1 ring-emerald-500/20 text-xs text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PostGIS Engine Ready</span>
          </div>
        </div>

      </div>
    </header>
  );
};
