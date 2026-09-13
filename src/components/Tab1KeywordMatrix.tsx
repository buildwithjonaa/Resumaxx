import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Zap, Layers, Info, Plus, Minus, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import type { KeywordItem } from '../types';

interface Tab1KeywordMatrixProps {
  keywords: KeywordItem[];
  matchScore: number | null;
  onAutoInsertKeyword: (keyword: string) => void;
  onToggleStageKeyword?: (keywordId: string) => void;
  onUpdateAnalysis?: () => void;
  stagedCount?: number;
}

export const Tab1KeywordMatrix: React.FC<Tab1KeywordMatrixProps> = ({
  keywords,
  matchScore,
  onAutoInsertKeyword,
  onToggleStageKeyword,
  onUpdateAnalysis,
  stagedCount = 0
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const missingKeywords = keywords.filter((k) => !k.added && !k.isStaged);
  const stagedKeywords = keywords.filter((k) => k.isStaged);
  const addedKeywords = keywords.filter((k) => k.added);

  const categories = ['All', 'Cloud & Infra', 'System Architecture', 'Product & Engineering', 'Security & Testing'];

  const filteredMissing = selectedCategory === 'All'
    ? missingKeywords
    : missingKeywords.filter((k) => k.category === selectedCategory);

  const safeScore = matchScore ?? 0;

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="space-y-6">
      
      {/* Pending Staged Optimization Action Banner */}
      {stagedCount > 0 && (
        <div className="p-4 bg-emerald-950 text-white rounded-2xl shadow-md border border-emerald-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-tight text-white">
                {stagedCount} Staged Resume Optimization Suggestions Ready
              </p>
              <p className="text-[11px] text-emerald-200">
                Click "Update Analysis" to confirm your selected skills and recalculate your ATS match score in one single batch.
              </p>
            </div>
          </div>

          {onUpdateAnalysis && (
            <button
              onClick={onUpdateAnalysis}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 flex-shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update Analysis & Recalculate Score</span>
            </button>
          )}
        </div>
      )}

      {/* Top Banner: Prominent Mathematical Match Score & Breakdown */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Gauge & Score */}
        <div className="flex items-center space-x-6">
          <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-emerald-400 transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {safeScore}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                ATS Score
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                safeScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {safeScore >= 80 ? 'High ATS Pass Rate' : 'ATS Rejection Risk'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Simulated Gate Audit</span>
            </div>

            <h3 className="text-lg font-bold text-white mt-1">
              ATS Keyword Alignment Matrix
            </h3>
            <p className="text-xs text-slate-300 max-w-md mt-1 leading-relaxed">
              Stage keyword suggestions below by clicking <Plus className="inline w-3 h-3 text-emerald-400" />. When ready, click <strong>"Update Analysis"</strong> to recalculate your score without leaving the page.
            </p>
          </div>
        </div>

        {/* Right: Sub-Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl min-w-[110px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Added</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-bold font-mono text-white mt-1">
              {addedKeywords.length} / {keywords.length}
            </p>
            <p className="text-[10px] text-slate-400">Confirmed Skills</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl min-w-[110px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Staged</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-bold font-mono text-emerald-300 mt-1">
              {stagedKeywords.length}
            </p>
            <p className="text-[10px] text-emerald-400/80">Pending Update</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl min-w-[110px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Missing</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-xl font-bold font-mono text-white mt-1">
              {missingKeywords.length}
            </p>
            <p className="text-[10px] text-slate-400">Critical Gaps</p>
          </div>
        </div>

      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          <Zap className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>In-Place Staging Active</span>
        </div>
      </div>

      {/* Staged Keywords Section (if any staged) */}
      {stagedKeywords.length > 0 && (
        <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/90 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Staged Resume Optimization Suggestions ({stagedKeywords.length})
              </h4>
            </div>
            {onUpdateAnalysis && (
              <button
                onClick={onUpdateAnalysis}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center space-x-1"
              >
                <span>Click here to update analysis now →</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {stagedKeywords.map((kw) => (
              <div
                key={kw.id}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white text-emerald-900 border border-emerald-300 shadow-2xs text-xs font-bold"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{kw.word}</span>
                <span className="text-[10px] text-emerald-700 font-mono">({kw.category})</span>
                <button
                  onClick={() => onToggleStageKeyword?.(kw.id)}
                  title="Remove staged suggestion"
                  className="ml-1 p-0.5 rounded hover:bg-emerald-100 text-emerald-700 hover:text-red-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-emerald-800/80 italic">
            <strong>Truthfulness Notice:</strong> Staging keywords marks them as optimization suggestions. Clicking <strong>"Update Analysis"</strong> confirms you possess these skills and adds them to your CV.
          </p>
        </div>
      )}

      {/* Main Grid: Missing Keywords vs Confirmed Matched Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Sub-Panel: Missing Critical Keywords */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Missing Critical Keywords ({missingKeywords.length})
              </h4>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Optimization Suggestions
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Click <Plus className="inline w-3.5 h-3.5 text-slate-700 font-bold" /> to stage multiple keywords. Click <strong>"Update Analysis"</strong> above to recalculate your ATS score in one batch.
          </p>

          {filteredMissing.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">All Keywords in this category matched or staged!</p>
              <p className="text-[11px] text-slate-500">Your resume satisfies target ATS keyword filters.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5 pt-1">
              {filteredMissing.map((kw) => (
                <div
                  key={kw.id}
                  className="group relative flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/90 shadow-2xs text-xs font-semibold transition-all hover:border-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{kw.word}</span>
                  <span className="text-[10px] font-normal text-slate-400 ml-1">({kw.category})</span>
                  
                  {/* In-Place Stage Button */}
                  <button
                    onClick={() => {
                      if (onToggleStageKeyword) {
                        onToggleStageKeyword(kw.id);
                      } else {
                        onAutoInsertKeyword(kw.word);
                      }
                    }}
                    title={`Click + to stage "${kw.word}" as an optimization suggestion`}
                    className="ml-1 p-1 rounded bg-slate-200/80 hover:bg-emerald-600 hover:text-white text-slate-700 transition-all font-bold flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sub-Panel: Confirmed Matched Keywords */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Confirmed Matched Skills ({addedKeywords.length})
              </h4>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified in CV
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Target keywords verified in your CV text. Newly confirmed words flash green.
          </p>

          {addedKeywords.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No matched keywords yet</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Stage missing keywords on the left and click <strong className="text-slate-800">"Update Analysis"</strong> to verify them!
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5 pt-1">
              {addedKeywords.map((kw) => (
                <div
                  key={kw.id}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                    kw.isNewFlash
                      ? 'animate-emerald-flash border-2 border-emerald-500'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="line-through decoration-emerald-500/80">{kw.word}</span>
                  <span className="text-[10px] text-emerald-700/80 font-normal">({kw.category})</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
