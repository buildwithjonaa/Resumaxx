import React, { useState } from 'react';
import { 
  FileText, Briefcase, Play, Sparkles, CheckCircle2, AlertCircle, 
  UploadCloud, Link as LinkIcon, Trash2, Eye, Globe, FileCheck, Building2, Search, ArrowRight, Compass, RefreshCw, Lock
} from 'lucide-react';
import { PRESET_PROFILES } from '../constants/sampleData';
import type { PresetProfile } from '../types';

interface LeftPanelProps {
  resumeText: string;
  onResumeTextChange: (text: string) => void;
  jobDescriptionText: string;
  onJobDescriptionChange: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  hasAnalyzed: boolean;
  currentProfile: PresetProfile;
  detectedCount: number;
  totalMissingCount: number;
  onSelectProfile: (profileId: string) => void;
  onGenerateProfile?: (query: string) => void;
  aiError?: string | null;
  hasValidCV: boolean;
  hasValidJob: boolean;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  resumeText,
  onResumeTextChange,
  jobDescriptionText,
  onJobDescriptionChange,
  onAnalyze,
  isAnalyzing,
  hasAnalyzed,
  currentProfile,
  detectedCount,
  totalMissingCount,
  onSelectProfile,
  onGenerateProfile,
  aiError,
  hasValidCV,
  hasValidJob
}) => {
  // Resume input mode state: 'upload' | 'paste'
  const [resumeMode, setResumeMode] = useState<'upload' | 'paste'>('upload');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; date: string } | null>(null);
  const [isParsingFile, setIsParsingFile] = useState<boolean>(false);
  const [showExtractedPreview, setShowExtractedPreview] = useState<boolean>(false);

  // Job Description input mode state: 'catalog' | 'url' | 'paste'
  const [jdMode, setJdMode] = useState<'catalog' | 'url' | 'paste'>('catalog');
  const [jobUrl, setJobUrl] = useState<string>('');
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);
  const [urlFetchSuccess, setUrlFetchSuccess] = useState<boolean>(false);

  // Target Job Input Query
  const [targetJobInput, setTargetJobInput] = useState<string>('');
  const [isEditingRole, setIsEditingRole] = useState<boolean>(false);

  const trimmedQuery = targetJobInput.trim().toLowerCase();

  // Pre-built Shortcut Matches (Optional shortcuts for common roles)
  const presetShortcuts = trimmedQuery === ''
    ? PRESET_PROFILES
    : PRESET_PROFILES.filter((profile) => (
        profile.company.toLowerCase().includes(trimmedQuery) ||
        profile.targetRole.toLowerCase().includes(trimmedQuery) ||
        profile.industry.toLowerCase().includes(trimmedQuery)
      ));

  // Handle Drag & Drop / File Select Simulation
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsParsingFile(true);

    let fileName = 'Uploaded_Resume.pdf';
    let fileSize = '150 KB';

    if ('files' in e.target && e.target.files && e.target.files[0]) {
      fileName = e.target.files[0].name;
      fileSize = `${Math.round(e.target.files[0].size / 1024)} KB`;
    }

    setTimeout(() => {
      setUploadedFile({
        name: fileName,
        size: fileSize,
        date: 'Uploaded just now'
      });
      // Mock sample text when drop occurs if text is empty
      if (!resumeText.trim()) {
        onResumeTextChange(`EXPERIENCE
Lead Professional | Apex Solutions (2021 - Present)
- Spearheaded team initiatives and strategic operations.
- Optimized workflows and reduced processing cycle times.`);
      }
      setIsParsingFile(false);
    }, 700);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    onResumeTextChange('');
  };

  // Submit Target Role (Uses AI for ANY role entered by user)
  const handleSetTargetRole = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = targetJobInput.trim();
    if (!query) return;
    
    if (onGenerateProfile) {
      onGenerateProfile(query);
    }
    setIsEditingRole(false);
  };

  // Select Preset Shortcut
  const handleSelectShortcut = (profileId: string) => {
    onSelectProfile(profileId);
    setTargetJobInput('');
    setIsEditingRole(false);
  };

  // Handle URL Auto-Fetch Simulation
  const handleFetchJobUrl = () => {
    if (!jobUrl.trim()) return;
    setIsFetchingUrl(true);
    setUrlFetchSuccess(false);

    setTimeout(() => {
      setIsFetchingUrl(false);
      setUrlFetchSuccess(true);
      if (onGenerateProfile) {
        onGenerateProfile(jobUrl);
      }
    }, 800);
  };

  const resumeWordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const jdWordCount = jobDescriptionText.trim() ? jobDescriptionText.trim().split(/\s+/).length : 0;

  const popularRoleExamples = [
    'Hairdresser', 'Architect', 'Museum Curator', 'Wedding Planner',
    'Marine Biologist', 'Barista', 'UX Researcher', 'Staff Engineer', 'Investment Analyst'
  ];

  const canAnalyze = hasValidCV && hasValidJob && !isAnalyzing;

  return (
    <div className="flex flex-col space-y-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Application Inputs
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          Multi-Modal Analyzer
        </span>
      </div>

      {/* INPUT SECTION 1: RESUME (Upload vs Paste) */}
      <div className="flex-1 flex flex-col space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-slate-700" />
            <span>1. User Resume / CV</span>
            {!hasValidCV && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-mono font-semibold">
                Required
              </span>
            )}
          </label>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
            <button
              onClick={() => setResumeMode('upload')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                resumeMode === 'upload'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Upload Document
            </button>
            <button
              onClick={() => setResumeMode('paste')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                resumeMode === 'paste'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* Resume Content View: Upload Mode vs Paste Mode */}
        {resumeMode === 'upload' ? (
          <div className="space-y-2">
            {!uploadedFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-slate-300 hover:border-slate-800 bg-slate-50/70 hover:bg-slate-50 rounded-xl p-6 text-center transition-all cursor-pointer min-h-[160px] flex flex-col items-center justify-center space-y-2"
              >
                <input
                  type="file"
                  onChange={handleFileDrop}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  id="resume-file-input"
                />
                <label htmlFor="resume-file-input" className="cursor-pointer flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-700 mb-1">
                    {isParsingFile ? (
                      <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UploadCloud className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {isParsingFile ? 'Parsing Document Boundaries...' : 'Click to browse or drag & drop your CV/Resume'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports PDF, DOCX, TXT (Max 10MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Active Uploaded File Card */}
                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white font-mono">
                          {uploadedFile.name}
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                          Parsed
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {uploadedFile.size} • {uploadedFile.date} • {resumeWordCount} words extracted
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{showExtractedPreview ? 'Hide Text' : 'View Text'}</span>
                    </button>
                    <button
                      onClick={handleRemoveFile}
                      className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Optional Expandable Text Drawer */}
                {showExtractedPreview && (
                  <div className="relative min-h-[160px]">
                    <textarea
                      value={resumeText}
                      onChange={(e) => onResumeTextChange(e.target.value)}
                      className="w-full min-h-[160px] p-3 text-xs font-mono text-slate-800 bg-slate-50 rounded-xl border border-slate-200 outline-none leading-relaxed resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex-1 min-h-[180px]">
            <textarea
              value={resumeText}
              onChange={(e) => onResumeTextChange(e.target.value)}
              placeholder="Paste your CV / Resume content here..."
              className="w-full h-full min-h-[180px] p-4 text-xs font-mono text-slate-800 bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all resize-none leading-relaxed"
            />
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            {hasAnalyzed ? (
              <span className="text-emerald-700 font-semibold">
                Live ATS analysis active ({detectedCount}/{totalMissingCount} keywords matched)
              </span>
            ) : hasValidCV ? (
              <span className="text-slate-600 font-medium">CV ready for application analysis.</span>
            ) : (
              <span className="text-amber-700 font-semibold">Please upload or paste your CV to continue.</span>
            )}
          </span>
          <span className="font-mono text-slate-600 font-semibold">{resumeWordCount} words</span>
        </div>
      </div>

      {/* INPUT SECTION 2: TARGET JOB REQUIREMENTS (Role Catalog vs URL vs Paste) */}
      <div className="flex-1 flex flex-col space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-slate-700" />
            <span>2. Target Job Requirements</span>
            {!hasValidJob && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-mono font-semibold">
                Required
              </span>
            )}
          </label>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
            <button
              onClick={() => { setJdMode('catalog'); setIsEditingRole(true); }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                jdMode === 'catalog'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Target Role
            </button>
            <button
              onClick={() => setJdMode('url')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                jdMode === 'url'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Job Link (URL)
            </button>
            <button
              onClick={() => setJdMode('paste')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                jdMode === 'paste'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* View 1: Universal Whitelist-Free Target Role Entry */}
        {jdMode === 'catalog' && (
          <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">

            {/* Active Selected Role Banner */}
            {!isEditingRole && currentProfile ? (
              <div className="p-3.5 bg-slate-900 text-white rounded-xl shadow-xs border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white tracking-tight">
                        {currentProfile.targetRole}
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                        {currentProfile.industry}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Target Company: <strong>{currentProfile.company}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingRole(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-all border border-slate-700 flex-shrink-0"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span>Change Role</span>
                </button>
              </div>
            ) : (
              /* Universal Input Box & AI Benchmark Form */
              <div className="space-y-3">
                <form onSubmit={handleSetTargetRole} className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Enter Any Job Title or Position:
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={targetJobInput}
                        onChange={(e) => setTargetJobInput(e.target.value)}
                        placeholder="Type any job title (e.g. Hairdresser, Architect, Museum Curator, Barista)..."
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono text-slate-800 bg-white rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none shadow-2xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!targetJobInput.trim()}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-all disabled:opacity-40 flex-shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Set Target Role</span>
                    </button>
                  </div>
                </form>

                {/* Primary AI Benchmark Generator Option */}
                {targetJobInput.trim() !== '' && (
                  <button
                    onClick={() => handleSetTargetRole()}
                    className="w-full p-3 bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl transition-all text-left flex items-center justify-between shadow-xs border border-emerald-850"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-tight text-white">
                          Use AI Benchmark for "{targetJobInput.trim()}"
                        </p>
                        <p className="text-[10px] text-emerald-200">
                          Dynamically generates requirements, ATS keywords & STAR interview questions
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </button>
                )}

                {/* Quick Examples */}
                {targetJobInput.trim() === '' && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                      Examples of Any Role Supported:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {popularRoleExamples.map((roleEx, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setTargetJobInput(roleEx);
                            if (onGenerateProfile) onGenerateProfile(roleEx);
                            setIsEditingRole(false);
                          }}
                          className="px-2 py-1 bg-white hover:bg-slate-900 hover:text-white text-slate-700 rounded-lg text-[11px] font-medium border border-slate-200 transition-all shadow-2xs"
                        >
                          + {roleEx}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Pre-built Catalog Shortcuts */}
                {presetShortcuts.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                      Optional Pre-built Shortcuts:
                    </span>
                    <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                      {presetShortcuts.map((profile) => (
                        <button
                          key={profile.id}
                          onClick={() => handleSelectShortcut(profile.id)}
                          className="w-full p-2 bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 text-left transition-all flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span className="font-semibold">{profile.company}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({profile.targetRole})</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* View 2: Job Link URL Mode (Uses exact provided job posting) */}
        {jdMode === 'url' && (
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="Paste LinkedIn, Greenhouse, or Lever job URL..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono text-slate-800 bg-white rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                />
              </div>

              <button
                onClick={handleFetchJobUrl}
                disabled={isFetchingUrl || !jobUrl.trim()}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-all flex-shrink-0 disabled:opacity-50"
              >
                {isFetchingUrl ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                ) : (
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>Auto-Fetch URL</span>
              </button>
            </div>

            {urlFetchSuccess && (
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fetched Job Requirements for <strong>{currentProfile.company}</strong> ({currentProfile.targetRole})</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">{jdWordCount} words</span>
              </div>
            )}
          </div>
        )}

        {/* View 3: Paste Text Mode (Uses exact provided job text directly) */}
        {jdMode === 'paste' && (
          <div className="relative flex-1 min-h-[160px]">
            <textarea
              value={jobDescriptionText}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Paste exact target job description text..."
              className="w-full h-full min-h-[160px] p-4 text-xs font-mono text-slate-800 bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all resize-none leading-relaxed"
            />
          </div>
        )}
      </div>

      {/* Error alert banner */}
      {aiError && (
        <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{aiError}</span>
        </div>
      )}

      {/* Action Button: Dark Navy Button */}
      <div className="pt-2">
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={`w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide transition-all shadow-md flex items-center justify-center space-x-3 ${
            !canAnalyze
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
              : 'bg-slate-950 hover:bg-slate-900 text-white active:scale-[0.99] hover:shadow-lg ring-1 ring-slate-900'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              <span>Analyzing Application...</span>
            </>
          ) : !hasValidCV ? (
            <>
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Upload or Paste CV to Enable Analysis</span>
            </>
          ) : !hasValidJob ? (
            <>
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Select Target Job to Enable Analysis</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Analyze Application with Resumaxx</span>
              <Play className="w-3.5 h-3.5 fill-current opacity-80" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
