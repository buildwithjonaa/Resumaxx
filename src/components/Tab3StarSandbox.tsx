import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Award, CheckCircle2, AlertCircle, HelpCircle, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { StarQuestion, StarProgress } from '../types';

interface Tab3StarSandboxProps {
  questions: StarQuestion[];
}

export const Tab3StarSandbox: React.FC<Tab3StarSandboxProps> = ({ questions }) => {
  const [activeQuestionId, setActiveQuestionId] = useState<string>(questions[0]?.id || '');
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hasCompletedTimer, setHasCompletedTimer] = useState<boolean>(false);

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) || questions[0];
  const currentResponseText = responses[activeQuestionId] || '';

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setHasCompletedTimer(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Handle question switch
  const handleSelectQuestion = (qId: string) => {
    setActiveQuestionId(qId);
    setIsTimerRunning(false);
    setTimerSeconds(60);
    setHasCompletedTimer(false);
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    setHasCompletedTimer(false);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(60);
    setHasCompletedTimer(false);
  };

  const handleTextChange = (text: string) => {
    setResponses((prev) => ({
      ...prev,
      [activeQuestionId]: text
    }));
  };

  // Real-time STAR structure detection using keyword heuristics
  const starProgress: StarProgress = useMemo(() => {
    if (!currentResponseText || !activeQuestion) {
      return { situation: false, task: false, action: false, result: false };
    }
    const textLower = currentResponseText.toLowerCase();

    // Heuristics for Situation: mentions context words (when, at company, project, during, outage, scenario, etc.)
    const situationMatch = activeQuestion.situationKeywords.some((kw) => textLower.includes(kw.toLowerCase())) ||
      /\b(when|during|at|faced|project|quarter|incident|challenge|customer|outage|legacy)\b/i.test(textLower);

    // Heuristics for Task: mentions objective words (responsible for, my goal, tasked with, needed to, objective, required)
    const taskMatch = activeQuestion.taskKeywords.some((kw) => textLower.includes(kw.toLowerCase())) ||
      /\b(responsible for|my goal|tasked with|needed to|objective|assigned to|required to|my role)\b/i.test(textLower);

    // Heuristics for Action: active verbs (designed, built, refactored, implemented, isolated, debugged, migrated, created)
    const actionMatch = activeQuestion.actionKeywords.some((kw) => textLower.includes(kw.toLowerCase())) ||
      /\b(designed|built|implemented|architected|refactored|isolated|migrated|optimized|configured|piloted|led|spearheaded)\b/i.test(textLower);

    // Heuristics for Result: numbers, metrics, percentages, timing, currency ($ 100K, 24%, 30ms, saved, reduced, improved)
    const resultMatch = activeQuestion.resultKeywords.some((kw) => textLower.includes(kw.toLowerCase())) ||
      /(\d+%|\$\d+|\d+\s*ms|\d+\s*sec|reduced|increased|saved|improved|boosted|restored|zero downtime)/i.test(textLower);

    return {
      situation: situationMatch,
      task: taskMatch,
      action: actionMatch,
      result: resultMatch
    };
  }, [currentResponseText, activeQuestion]);

  const starCount = [starProgress.situation, starProgress.task, starProgress.action, starProgress.result].filter(Boolean).length;
  const starScorePercent = Math.round((starCount / 4) * 100);

  // Trigger confetti when 100% STAR score reached
  const confettiFired = useRef(false);
  useEffect(() => {
    if (starScorePercent === 100 && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else if (starScorePercent < 100) {
      confettiFired.current = false;
    }
  }, [starScorePercent]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Interview Sandbox Overview */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              STAR Behavioral Evaluation
            </span>
            <span className="text-xs text-slate-400 font-mono">60s Live Countdown</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            STAR Method Interview Sandbox
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            We generated targeted behavioral questions based on structural gaps between your resume and the target position. Practice your response under time pressure.
          </p>
        </div>

        {/* Global STAR Progress Badge */}
        <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-xl flex items-center space-x-4 min-w-[200px]">
          <Award className={`w-8 h-8 ${starScorePercent === 100 ? 'text-emerald-400 animate-bounce' : 'text-slate-400'}`} />
          <div>
            <div className="text-xs text-slate-400 font-medium">STAR Method Score</div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {starScorePercent}%
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">
              {starCount} of 4 Pillars Met
            </div>
          </div>
        </div>
      </div>

      {/* Main Sandbox Layout: Question Selector + Live Answer & Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Question Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            Target Gap Questions ({questions.length})
          </h4>

          <div className="space-y-2.5">
            {questions.map((q, idx) => {
              const isSelected = q.id === activeQuestionId;
              return (
                <div
                  key={q.id}
                  onClick={() => handleSelectQuestion(q.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-800'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isSelected ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      Question #{idx + 1}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      q.difficulty === 'Staff' ? 'bg-purple-100 text-purple-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {q.difficulty} Gap
                    </span>
                  </div>

                  <p className={`text-xs font-medium line-clamp-2 leading-relaxed ${
                    isSelected ? 'text-slate-100' : 'text-slate-800'
                  }`}>
                    "{q.question}"
                  </p>

                  <div className={`text-[11px] pt-1 flex items-center justify-between border-t ${
                    isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span>Target Gap Context</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Practice Workspace & Evaluation Timer (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Question Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Selected Gap Question:</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                "{activeQuestion.question}"
              </p>
              <div className="pt-2 flex items-center space-x-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span><strong className="text-slate-900">Why this was flagged:</strong> {activeQuestion.gapContext}</span>
              </div>
            </div>

            {/* Timer Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 rounded-xl text-white shadow-xs">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-lg font-bold ${
                  timerSeconds <= 10 ? 'bg-red-500 text-white animate-ping' : 'bg-slate-800 text-emerald-400 border border-slate-700'
                }`}>
                  {timerSeconds}s
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    60-Second Evaluation Timer
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isTimerRunning ? 'Timer ticking...' : timerSeconds === 60 ? 'Ready to test' : timerSeconds === 0 ? 'Time expired!' : 'Paused'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!isTimerRunning ? (
                  <button
                    onClick={handleStartTimer}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{timerSeconds === 60 ? 'Start Live Response Test' : 'Resume Timer'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTimer}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Timer</span>
                  </button>
                )}

                <button
                  onClick={handleResetTimer}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                  title="Reset timer to 60s"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Real-Time STAR Progress Tags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live STAR Structure Detection:
                </span>
                <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {starCount} / 4 Satisfied
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Situation Tag */}
                <div className={`p-3 rounded-xl border transition-all text-xs font-semibold flex items-center space-x-2 ${
                  starProgress.situation
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${starProgress.situation ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <div>
                    <div className="font-bold">[Situation]</div>
                    <div className="text-[10px] font-normal opacity-80">Context & Setup</div>
                  </div>
                </div>

                {/* Task Tag */}
                <div className={`p-3 rounded-xl border transition-all text-xs font-semibold flex items-center space-x-2 ${
                  starProgress.task
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${starProgress.task ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <div>
                    <div className="font-bold">[Task]</div>
                    <div className="text-[10px] font-normal opacity-80">Core Objective</div>
                  </div>
                </div>

                {/* Action Tag */}
                <div className={`p-3 rounded-xl border transition-all text-xs font-semibold flex items-center space-x-2 ${
                  starProgress.action
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${starProgress.action ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <div>
                    <div className="font-bold">[Action]</div>
                    <div className="text-[10px] font-normal opacity-80">Active Execution</div>
                  </div>
                </div>

                {/* Result Tag */}
                <div className={`p-3 rounded-xl border transition-all text-xs font-semibold flex items-center space-x-2 ${
                  starProgress.result
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${starProgress.result ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <div>
                    <div className="font-bold">[Result]</div>
                    <div className="text-[10px] font-normal opacity-80">Quantified Impact</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Practice Answer Text Area */}
            <div className="space-y-2">
              <textarea
                value={currentResponseText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Type your practice interview response here... (e.g. 'During the Black Friday peak, I was responsible for restoring SLA uptime. I refactored the caching strategy and reduced latency by 45%...')"
                className="w-full min-h-[160px] p-4 text-xs font-mono text-slate-800 bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Feedback Banner */}
            {starScorePercent === 100 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-900 text-xs font-medium">
                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <strong className="font-bold text-emerald-950">Flawless STAR Response!</strong>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    You satisfied all four structural components ([Situation], [Task], [Action], [Result]) with quantifiable impact metrics!
                  </p>
                </div>
              </div>
            ) : hasCompletedTimer ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-3 text-amber-900 text-xs font-medium">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <strong className="font-bold text-amber-950">Time Expired ({starScorePercent}% STAR Score)</strong>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Make sure to state specific action verbs and clear numbers/metrics in your response.
                  </p>
                </div>
              </div>
            ) : null}

          </div>

        </div>

      </div>

    </div>
  );
};
