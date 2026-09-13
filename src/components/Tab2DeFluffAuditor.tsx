import React, { useMemo } from 'react';
import { Sparkles, Check, Lightbulb, Edit3 } from 'lucide-react';
import type { FluffItem, FluffMatch } from '../types';

interface Tab2DeFluffAuditorProps {
  resumeText: string;
  fluffDictionary: FluffItem[];
  onSwapFluff: (oldWord: string, newMetric: string) => void;
}

export const Tab2DeFluffAuditor: React.FC<Tab2DeFluffAuditorProps> = ({
  resumeText,
  fluffDictionary,
  onSwapFluff
}) => {
  // Detect matches in resume text
  const matches: FluffMatch[] = useMemo(() => {
    if (!resumeText) return [];
    const lowerText = resumeText.toLowerCase();
    const result: FluffMatch[] = [];

    fluffDictionary.forEach((item, index) => {
      const targetLower = item.word.toLowerCase();
      if (lowerText.includes(targetLower)) {
        // Count occurrences
        const regex = new RegExp(targetLower.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi');
        const matchCount = (resumeText.match(regex) || []).length;
        if (matchCount > 0) {
          result.push({
            ...item,
            id: `match-${index}-${item.word}`,
            count: matchCount
          });
        }
      }
    });

    return result;
  }, [resumeText, fluffDictionary]);

  const totalWeakWords = matches.reduce((sum, m) => sum + m.count, 0);

  // Function to render text with highlighted fluff
  const renderHighlightedResume = () => {
    if (!resumeText) return null;
    
    // Sort words by length descending so longer phrases match first
    const sortedWords = fluffDictionary.map(f => f.word).sort((a, b) => b.length - a.length);
    if (sortedWords.length === 0) return resumeText;

    const pattern = new RegExp(`(${sortedWords.map(w => w.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')).join('|')})`, 'gi');
    const parts = resumeText.split(pattern);

    return parts.map((part, idx) => {
      const matchedFluff = fluffDictionary.find(f => f.word.toLowerCase() === part.toLowerCase());
      if (matchedFluff) {
        return (
          <mark
            key={idx}
            className="bg-amber-100/90 text-amber-950 font-semibold px-1 rounded border-b-2 border-amber-400 shadow-2xs group relative cursor-help inline-block my-0.5"
            title={`${matchedFluff.word}: ${matchedFluff.explanation}`}
          >
            {part}
            <span className="ml-1 text-[10px] font-mono text-amber-700 bg-amber-200/70 px-1 rounded">
              [Weak Word]
            </span>
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Fluff Counter & Severity Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold font-mono text-lg shadow-inner ${
            totalWeakWords > 4 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}>
            {totalWeakWords}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                Fluff Counter: <span className="text-amber-600 font-mono">{totalWeakWords} Weak Words Detected</span>
              </h3>
              <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                Audit Status
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lazy corporate jargon weakens ATS authority scores. Swap highlighted fluff for quantitative metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Text Quality:</span>
          <span className={`px-3 py-1 rounded-full font-bold ${
            totalWeakWords === 0
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : totalWeakWords <= 3
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {totalWeakWords === 0 ? 'Enterprise Grade' : totalWeakWords <= 3 ? 'Moderate Fluff' : 'High Fluff Density'}
          </span>
        </div>
      </div>

      {/* Main Split View: Text Highlighter vs Actionable Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Formatted Resume Text Viewer with Yellow Highlight (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-slate-700" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Audited Resume Text (Live Highlighting)
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Yellow = Weak Buzzwords
            </span>
          </div>

          <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/80 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
            {renderHighlightedResume()}
          </div>
        </div>

        {/* Right Column: Floating Actionable Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Actionable Metric Swaps ({matches.length})
              </h4>
            </div>
            <span className="text-[10px] text-slate-400">1-Click Auto Replace</span>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center shadow-xs">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">Zero Fluff Detected!</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Your resume text is crisp and metrics-focused.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {matches.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                          "{item.word}"
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          ({item.category})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-normal">
                        {item.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Suggestion Box */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700">
                      <span className="flex items-center space-x-1">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Recommended Metric Replacement:</span>
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-800 bg-white p-2 rounded border border-slate-200 leading-relaxed">
                      "{item.suggestedMetricSwap}"
                    </p>

                    <button
                      onClick={() => onSwapFluff(item.word, item.suggestedMetricSwap)}
                      className="w-full py-1.5 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-2xs transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>One-Click Swap in Resume</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
