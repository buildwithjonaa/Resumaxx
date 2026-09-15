import { useState, useEffect, useMemo, useRef } from 'react';

import { Header } from './components/Header';

import { LeftPanel } from './components/LeftPanel';

import { RightPanel } from './components/RightPanel';

import { PRESET_PROFILES } from './constants/sampleData';

import { generateJobProfile } from './services/gemini';

import type { KeywordItem, AnalysisStep, PresetProfile } from './types';

export default function App() {

  // currentProfile state for AI-generated and preset profiles — null on fresh load
  const [currentProfile, setCurrentProfile] = useState<PresetProfile | null>(null);

  // Form input states — both start EMPTY on fresh load
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('');

  // Track exact resume text analyzed during the last successful analysis run
  const [analyzedResumeText, setAnalyzedResumeText] = useState<string>('');

  // Analysis workflow state
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>('idle');
  const [loadingProgressText, setLoadingProgressText] = useState<string>('');
  const [loadingProgressPercent, setLoadingProgressPercent] = useState<number>(0);

  // AI generation / validation error state
  const [aiError, setAiError] = useState<string | null>(null);

  // Keywords state — empty on fresh load; populated when user selects/generates a profile
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);

  // Strict Validation Helpers
  const hasValidCV = resumeText.trim().length >= 20;
  const hasValidJob = jobDescriptionText.trim().length >= 20;

  // Analysis is active if step is complete AND a valid CV was analyzed
  const isAnalyzed =
    analysisStep === 'complete' &&
    hasValidCV &&
    analyzedResumeText.length > 0;

  // Pending changes check: staged keywords or manual text edits pending re-analysis
  const stagedCount = keywords.filter(k => k.isStaged).length;

  const hasPendingChanges =
    isAnalyzed &&
    (stagedCount > 0 || analyzedResumeText !== resumeText);

  // ─── Profile preset selection ──────────────────────────────────────────────

  const handleSelectProfile = (profileId: string) => {
    const profile =
      PRESET_PROFILES.find((p) => p.id === profileId) ||
      PRESET_PROFILES[0];

    setCurrentProfile(profile);
    setJobDescriptionText(profile.defaultJobDescription);

    setKeywords(
      profile.missingKeywords.map(k => ({
        ...k,
        added: false,
        isStaged: false,
        isNewFlash: false
      }))
    );

    // Selecting a profile resets analysis state
    setAnalysisStep('idle');
    setAnalyzedResumeText('');
    setAiError(null);
  };

  // ─── AI Profile Generator ──────────────────────────────────────────────────

  const aiProgressTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleGenerateProfile = async (query: string) => {
    setAiError(null);

    let role = query.trim();
    let company = 'a Leading Company';

    const separators = [' at ', ' @ ', ' - ', ' for '];

    for (const sep of separators) {
      const idx = query.toLowerCase().indexOf(sep);

      if (idx !== -1) {
        role = query.slice(0, idx).trim();
        company = query.slice(idx + sep.length).trim();
        break;
      }
    }

    if (!role) return;

    aiProgressTimers.current.forEach(clearTimeout);
    aiProgressTimers.current = [];

    setAnalysisStep('parsing');
    setLoadingProgressText('Connecting to Resumaxx AI Engine...');
    setLoadingProgressPercent(25);

    aiProgressTimers.current.push(
      setTimeout(() => {
        setLoadingProgressText(
          `Analysing industry requirements for "${role}"...`
        );
        setLoadingProgressPercent(60);
      }, 600)
    );

    try {
      const profile = await generateJobProfile(role, company);

      aiProgressTimers.current.forEach(clearTimeout);
      aiProgressTimers.current = [];

      setLoadingProgressPercent(100);
      setCurrentProfile(profile);

      setKeywords(
        profile.missingKeywords.map(k => ({
          ...k,
          added: false,
          isStaged: false,
          isNewFlash: false
        }))
      );

      setJobDescriptionText(profile.defaultJobDescription);
      setAnalysisStep('idle');
      setAnalyzedResumeText('');

    } catch (err) {

      aiProgressTimers.current.forEach(clearTimeout);
      aiProgressTimers.current = [];

      setAnalysisStep('idle');

      setAiError(
        err instanceof Error
          ? err.message
          : 'AI generation failed. Please try again.'
      );
    }
  };

  // ─── Real-time resume keyword listener ─────────────────────────────────────
  // Checks whether keywords from the current job description exist in the CV.

  useEffect(() => {
    if (!hasValidCV) return;

    const lowerResume = resumeText.toLowerCase();

    setKeywords((prevKeywords) => {
      let updated = false;

      const nextKeywords = prevKeywords.map((item) => {
        const wordLower = item.word.toLowerCase();
        const isPresentInText = lowerResume.includes(wordLower);

        // If present in text, mark added
        if (isPresentInText && !item.added) {
          updated = true;

          return {
            ...item,
            added: true,
            isStaged: false,
            isNewFlash: true
          };
        }

        return item;
      });

      return updated ? nextKeywords : prevKeywords;
    });
  }, [resumeText, hasValidCV]);

  // ─── Flash timer removal ───────────────────────────────────────────────────

  useEffect(() => {
    const hasFlashing = keywords.some(k => k.isNewFlash);

    if (hasFlashing) {
      const timer = setTimeout(() => {
        setKeywords(prev =>
          prev.map(k => ({
            ...k,
            isNewFlash: false
          }))
        );
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [keywords]);

  // ─── In-Place Keyword Staging Handler (+ / -) ──────────────────────────────
  // Toggles staging without resetting or closing the current analysis view!

  const handleToggleStageKeyword = (keywordId: string) => {
    setKeywords((prev) =>
      prev.map((k) => {
        if (k.id === keywordId) {
          const nextStaged = !k.isStaged;

          return {
            ...k,
            isStaged: nextStaged
          };
        }

        return k;
      })
    );
  };

  // ─── Strict Dynamic Match Score ───────────────────────────────────────────
  // Calculated only when isAnalyzed is true!

  const matchScore = useMemo(() => {
    if (!isAnalyzed || !hasValidCV) return null;

    // Preset / AI-generated profiles have their own baseline.
    // Pasted job descriptions use a neutral baseline.
    const baseline = currentProfile?.matchScoreBaseline ?? 58;

    const totalKeywords = keywords.length;

    if (totalKeywords === 0) return baseline;

    const addedCount = keywords.filter(
      (k) => k.added || k.isStaged
    ).length;

    const bonusPerKeyword = Math.round(
      (100 - baseline) / totalKeywords
    );

    return Math.min(
      100,
      baseline + addedCount * bonusPerKeyword
    );
  }, [
    isAnalyzed,
    hasValidCV,
    currentProfile,
    keywords
  ]);

  // ─── Job Description Keyword Extraction ────────────────────────────────────
  // Used when the user pastes an arbitrary job description instead of
  // selecting one of the preset profiles.

  const extractJobKeywords = (jobText: string): KeywordItem[] => {

    const keywordPatterns = [
      { word: 'SEO', category: 'Technical Skills' },
      { word: 'SEM', category: 'Technical Skills' },
      { word: 'Google Ads', category: 'Tools & Platforms' },
      { word: 'GA4', category: 'Tools & Platforms' },
      { word: 'Google Analytics', category: 'Tools & Platforms' },
      { word: 'email marketing', category: 'Technical Skills' },
      { word: 'email campaigns', category: 'Technical Skills' },
      { word: 'keyword research', category: 'Domain Knowledge' },
      { word: 'competitor analysis', category: 'Domain Knowledge' },
      {
        word: 'conversion rate optimization',
        category: 'Technical Skills'
      },
      { word: 'CRO', category: 'Technical Skills' },
      { word: 'A/B testing', category: 'Technical Skills' },
      { word: 'HubSpot', category: 'Tools & Platforms' },
      { word: 'HTML/CSS', category: 'Technical Skills' },
      { word: 'social media', category: 'Domain Knowledge' },
      { word: 'content marketing', category: 'Domain Knowledge' },
      {
        word: 'campaign management',
        category: 'Leadership & Strategy'
      },
      { word: 'analytics', category: 'Technical Skills' },
      { word: 'KPIs', category: 'Leadership & Strategy' },
      { word: 'ROI', category: 'Leadership & Strategy' },
      { word: 'reporting', category: 'Leadership & Strategy' },
      { word: 'lead generation', category: 'Domain Knowledge' },
      { word: 'paid search', category: 'Technical Skills' },
      {
        word: 'content strategy',
        category: 'Leadership & Strategy'
      },
      {
        word: 'project management',
        category: 'Leadership & Strategy'
      },
      { word: 'digital marketing', category: 'Domain Knowledge' },
      {
        word: 'performance marketing',
        category: 'Domain Knowledge'
      },
      {
        word: 'marketing automation',
        category: 'Tools & Platforms'
      },
      { word: 'paid media', category: 'Domain Knowledge' }
    ];

    const lowerJob = jobText.toLowerCase();

    return keywordPatterns
      .filter(({ word }) =>
        lowerJob.includes(word.toLowerCase())
      )
      .map((item, index) => ({
        id: `jd-kw-${index}`,
        word: item.word,
        category: item.category,
        added: false,
        isStaged: false,
        isNewFlash: false
      }));
  };

  // ─── Initial & Single-Batch Re-Analysis Handler ───────────────────────────

  const handleStartAnalysis = (isUpdateRun: boolean = false) => {

    if (!hasValidCV || !hasValidJob) {
      setAiError(
        !hasValidCV
          ? 'Please upload or paste your CV/resume before running analysis.'
          : 'Please select or enter a target job before running analysis.'
      );

      return;
    }

    setAiError(null);

    // ─── NEW: Handle arbitrary pasted job descriptions ────────────────
    // If there is no preset/AI profile, extract relevant keywords
    // directly from the job description the user pasted.

    if (!currentProfile && jobDescriptionText.trim()) {
      const extractedKeywords =
        extractJobKeywords(jobDescriptionText);

      setKeywords(extractedKeywords);
    }

    // If updating, first commit all staged keywords to resume text
    let updatedResumeText = resumeText;

    const stagedKeywords = keywords.filter(
      k => k.isStaged
    );

    if (stagedKeywords.length > 0) {

      const bulletsToAdd = stagedKeywords
        .filter(
          k =>
            !updatedResumeText
              .toLowerCase()
              .includes(k.word.toLowerCase())
        )
        .map(
          k =>
            `- Demonstrated proficiency in ${k.word} for key deliverables.`
        )
        .join('\n');

      if (bulletsToAdd) {

        updatedResumeText =
          `${updatedResumeText.trim()}\n\nKEYWORD OPTIMIZATIONS:\n${bulletsToAdd}`;

        setResumeText(updatedResumeText);
      }
    }

    // ─── Analysis animation ──────────────────────────────────────────

    setAnalysisStep('parsing');

    setLoadingProgressText(
      isUpdateRun
        ? 'Updating analysis with accumulated keyword optimizations...'
        : 'Parsing resume token boundaries & AST structure...'
    );

    setLoadingProgressPercent(30);

    setTimeout(() => {

      setAnalysisStep('keywords');

      setLoadingProgressText(
        'Extracting core missing keywords & calculating updated match score...'
      );

      setLoadingProgressPercent(70);

      setTimeout(() => {

        setAnalysisStep('ats');

        setLoadingProgressText(
          'Finalizing ATS gate verification & recommendations...'
        );

        setLoadingProgressPercent(100);

        setTimeout(() => {

          // Mark staged keywords as added
          setKeywords(prev =>
            prev.map(k =>
              k.isStaged
                ? {
                    ...k,
                    added: true,
                    isStaged: false
                  }
                : k
            )
          );

          setAnalyzedResumeText(updatedResumeText);

          setAnalysisStep('complete');

        }, 600);

      }, 700);

    }, 700);
  };

  // ─── Reset workspace ───────────────────────────────────────────────────────

  const handleReset = () => {

    setResumeText('');
    setJobDescriptionText('');
    setAnalyzedResumeText('');
    setCurrentProfile(null);
    setKeywords([]);
    setAnalysisStep('idle');
    setAiError(null);
  };

  // ─── Direct Auto-insert keyword helper (Tab 1 direct insertion) ───────────

  const handleAutoInsertKeyword = (word: string) => {

    const targetKw = keywords.find(
      k =>
        k.word.toLowerCase() === word.toLowerCase()
    );

    if (targetKw) {
      handleToggleStageKeyword(targetKw.id);
    }
  };

  // ─── Fluff swap handler (Tab 2) ───────────────────────────────────────────

  const handleSwapFluff = (
    oldWord: string,
    newMetric: string
  ) => {

    const regex = new RegExp(
      oldWord.replace(
        /[-[\]{}()*+?.,\\^$|#\s]/g,
        '\\$&'
      ),
      'gi'
    );

    setResumeText((prev) =>
      prev.replace(regex, newMetric)
    );
  };

  const detectedCount = keywords.filter(
    k => k.added || k.isStaged
  ).length;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (

    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">

      {/* SaaS Global Header */}

      <Header
        currentProfile={currentProfile}
        onSelectProfile={handleSelectProfile}
        onReset={handleReset}
        isAnalyzing={
          analysisStep !== 'idle' &&
          analysisStep !== 'complete'
        }
      />

      {/* Main Workspace Grid Container */}

      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">

          {/* LEFT PANEL: Dual Text Inputs & Navy Action Button */}

          <div className="lg:col-span-5 h-full">

            <LeftPanel
              resumeText={resumeText}
              onResumeTextChange={setResumeText}

              jobDescriptionText={jobDescriptionText}
              onJobDescriptionChange={setJobDescriptionText}

              onAnalyze={() =>
                handleStartAnalysis(isAnalyzed)
              }

              isAnalyzing={
                analysisStep !== 'idle' &&
                analysisStep !== 'complete'
              }

              hasAnalyzed={isAnalyzed}

              currentProfile={currentProfile}

              detectedCount={detectedCount}
              totalMissingCount={keywords.length}

              onSelectProfile={handleSelectProfile}
              onGenerateProfile={handleGenerateProfile}

              aiError={aiError}

              hasValidCV={hasValidCV}
              hasValidJob={hasValidJob}
            />

          </div>

          {/* RIGHT PANEL: Loading Bar / Interactive 3 Tabs */}

          <div className="lg:col-span-7 h-full">

            <RightPanel
              analysisStep={analysisStep}

              loadingProgressText={loadingProgressText}
              loadingProgressPercent={loadingProgressPercent}

              keywords={keywords}
              matchScore={matchScore}

              resumeText={resumeText}

              fluffDictionary={
                currentProfile?.fluffDictionary ?? []
              }

              starQuestions={
                currentProfile?.starQuestions ?? []
              }

              onAutoInsertKeyword={handleAutoInsertKeyword}
              onToggleStageKeyword={handleToggleStageKeyword}
              onSwapFluff={handleSwapFluff}

              onStartAnalysis={() =>
                handleStartAnalysis(isAnalyzed)
              }

              isAiGenerated={
                currentProfile?.isAiGenerated
              }

              hasValidCV={hasValidCV}
              hasValidJob={hasValidJob}

              isAnalyzed={isAnalyzed}

              hasPendingChanges={hasPendingChanges}
              stagedCount={stagedCount}
            />

          </div>

        </div>

      </main>

      {/* SaaS Footer */}

      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500 font-medium">

        <div className="max-w-[1700px] mx-auto px-4 flex items-center justify-between">

          <span>
            Resumaxx Enterprise AI Application Coach © 2026
          </span>

          <span className="font-mono text-[11px] text-slate-400">
            Production SaaS Architecture • Modern UI
          </span>

        </div>

      </footer>

    </div>
  );
}