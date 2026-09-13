import React from 'react';
import { ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import type { PresetProfile } from '../types';

interface HeaderProps {
  currentProfile: PresetProfile | null;
  onSelectProfile: (profileId: string) => void;
  onReset: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  onSelectProfile,
  onReset,
  isAnalyzing
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand logo & Enterprise Badge */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-800">
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  Resumaxx
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                AI Application Coach & ATS Auditor
              </p>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-slate-200 hidden md:block" />

          <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {currentProfile
              ? <span>Target Role: <strong className="text-slate-900">{currentProfile.targetRole}</strong> ({currentProfile.company})</span>
              : <span className="text-slate-400 italic">No target role selected</span>
            }
          </div>
        </div>

        {/* Right: Controls & Demo Presets */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold px-2 py-0.5 text-[11px]">Presets:</span>
            <button
              onClick={() => onSelectProfile('staff-eng')}
              disabled={isAnalyzing}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                currentProfile?.id === 'staff-eng'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Staff Engineer
            </button>
            <button
              onClick={() => onSelectProfile('lead-pm')}
              disabled={isAnalyzing}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                currentProfile?.id === 'lead-pm'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Lead PM
            </button>
          </div>

          <button
            onClick={onReset}
            disabled={isAnalyzing}
            title="Reset text fields to preset initial state"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Workspace</span>
          </button>

          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ATS Engine Ready</span>
          </div>
        </div>

      </div>
    </header>
  );
};
