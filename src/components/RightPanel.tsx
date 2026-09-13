import React, { useState } from 'react';
import { Target, Scissors, MessageSquare, Sparkles, Cpu, RefreshCw, FileText } from 'lucide-react';
import { Tab1KeywordMatrix } from './Tab1KeywordMatrix';
import { Tab2DeFluffAuditor } from './Tab2DeFluffAuditor';
import { Tab3StarSandbox } from './Tab3StarSandbox';
import type { KeywordItem, FluffItem, StarQuestion, AnalysisStep } from '../types';

interface RightPanelProps {
  analysisStep: AnalysisStep;
  loadingProgressText: string;
  loadingProgressPercent: number;
  keywords: KeywordItem[];
  matchScore: number | null;
  resumeText: string;
  fluffDictionary: FluffItem[];
  starQuestions: StarQuestion[];
  onAutoInsertKeyword: (keyword: string) => void;
  onToggleStageKeyword: (keywordId: string) => void;
  onSwapFluff: (oldWord: string, newMetric: string) => void;
  onStartAnalysis: () => void;
  isAiGenerated?: boolean;
  hasValidCV: boolean;
  hasValidJob: boolean;
  isAnalyzed: boolean;
  hasPendingChanges?: boolean;
  stagedCount?: number;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  analysisStep,
  loadingProgressText,
  loadingProgressPercent,
  keywords,
  matchScore,
  resumeText,
  fluffDictionary,
  starQuestions,
  onAutoInsertKeyword,
  onToggleStageKeyword,
  onSwapFluff,
  onStartAnalysis,
  hasValidCV,
  hasValidJob,
  isAnalyzed,
  hasPendingChanges,
  stagedCount = 0
}) => {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2' | 'tab3'>('tab1');

  const missingCount = keywords.filter((k) => !k.added && !k.isStaged).length;

  // Render Loading Bar state
  if (analysisStep !== 'idle' && analysisStep !== 'complete') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs h-full flex flex-col items-center justify-center space-y-6 min-h-[600px]">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg ring-4 ring-slate-100">
          <Cpu className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>

        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-lg font-bold text-slate-900 font-sans">
            Resumaxx Intelligence Core Running
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            {loadingProgressText}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-md space-y-2">
          <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${loadingProgressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Progress: {loadingProgressPercent}%</span>
            <span>Simulating Enterprise Gate</span>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md pt-4">
          <div className={`p-2.5 rounded-lg text-center text-xs font-semibold border ${
            loadingProgressPercent >= 33 ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            1. Token Boundaries
          </div>
          <div className={`p-2.5 rounded-lg text-center text-xs font-semibold border ${
            loadingProgressPercent >= 66 ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            2. Keywords Audit
          </div>
          <div className={`p-2.5 rounded-lg text-center text-xs font-semibold border ${
            loadingProgressPercent >= 100 ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            3. ATS Rejection Gate
          </div>
        </div>
      </div>
    );
  }

  // Render Empty / Unanalyzed State Placeholder
  if (!isAnalyzed || matchScore === null) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs h-full flex flex-col items-center justify-center space-y-6 text-center min-h-[600px]">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
          {!hasValidCV ? (
            <FileText className="w-8 h-8 text-amber-600" />
          ) : (
            <Sparkles className="w-8 h-8 text-slate-900" />
          )}
        </div>

        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
            {!hasValidCV
              ? 'Upload Your CV to Continue'
              : !hasValidJob
              ? 'Select Target Job to Continue'
              : 'Application Ready for Analysis'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {!hasValidCV
              ? 'Please upload or paste your CV/resume in the left panel. Resumaxx requires a CV before calculating an ATS match score or executing analysis.'
              : !hasValidJob
              ? 'Please select or type a target job role. Resumaxx requires a target benchmark to compare your CV against.'
              : 'Your CV and target job are ready! Click "Analyze Application with Resumaxx" on the left panel to run ATS keyword matching, fluff auditing, and calculate your match score.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg w-full pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left space-y-1">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold font-mono">1</div>
            <p className="text-xs font-bold text-slate-900">ATS Keyword Matrix</p>
            <p className="text-[11px] text-slate-500">Live gamified match score & missing pill badges.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left space-y-1">
            <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold font-mono">2</div>
            <p className="text-xs font-bold text-slate-900">De-Fluff Auditor</p>
            <p className="text-[11px] text-slate-500">Soft yellow highlight & 1-click metric swaps.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left space-y-1">
            <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold font-mono">3</div>
            <p className="text-xs font-bold text-slate-900">STAR Sandbox</p>
            <p className="text-[11px] text-slate-500">60s interview timer & live structural tags.</p>
          </div>
        </div>

        {hasValidCV && hasValidJob && (
          <button
            onClick={onStartAnalysis}
            className="mt-4 px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Analyze Application with Resumaxx</span>
          </button>
        )}
      </div>
    );
  }

  // Render Populated Workspace with 3 Interactive Tabs
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs h-full flex flex-col space-y-6">
      
      {/* Workspace Header Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
        <div className="flex items-center space-x-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          
          {/* TAB 1 Button */}
          <button
            onClick={() => setActiveTab('tab1')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tab1'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Target className={`w-4 h-4 ${activeTab === 'tab1' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>TAB 1: Live Keyword Matrix</span>
            {missingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-mono text-[10px] flex items-center justify-center">
                {missingCount}
              </span>
            )}
          </button>

          {/* TAB 2 Button */}
          <button
            onClick={() => setActiveTab('tab2')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tab2'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Scissors className={`w-4 h-4 ${activeTab === 'tab2' ? 'text-amber-500' : 'text-slate-400'}`} />
            <span>TAB 2: De-Fluff Auditor</span>
          </button>

          {/* TAB 3 Button */}
          <button
            onClick={() => setActiveTab('tab3')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tab3'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <MessageSquare className={`w-4 h-4 ${activeTab === 'tab3' ? 'text-purple-600' : 'text-slate-400'}`} />
            <span>TAB 3: STAR Sandbox</span>
          </button>

        </div>

        <div className="flex items-center space-x-3">
          {hasPendingChanges && (
            <button
              onClick={onStartAnalysis}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-all animate-pulse"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update Analysis ({stagedCount > 0 ? `${stagedCount} Staged` : 'Pending Changes'})</span>
            </button>
          )}

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ATS Score: <strong className="text-slate-900 font-mono text-sm">{matchScore}%</strong></span>
          </div>
        </div>
      </div>

      {/* Tab Content Panes */}
      <div className="flex-1">
        {activeTab === 'tab1' && (
          <Tab1KeywordMatrix
            keywords={keywords}
            matchScore={matchScore}
            onAutoInsertKeyword={onAutoInsertKeyword}
            onToggleStageKeyword={onToggleStageKeyword}
            onUpdateAnalysis={onStartAnalysis}
            stagedCount={stagedCount}
          />
        )}

        {activeTab === 'tab2' && (
          <Tab2DeFluffAuditor
            resumeText={resumeText}
            fluffDictionary={fluffDictionary}
            onSwapFluff={onSwapFluff}
          />
        )}

        {activeTab === 'tab3' && (
          <Tab3StarSandbox
            questions={starQuestions}
          />
        )}
      </div>

    </div>
  );
};
