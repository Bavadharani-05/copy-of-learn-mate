import React, { useState } from 'react';
import { LucideIcon } from '../LucideIcon';

export function ChallengeResponse({ data, onReadAloud }) {
  const hints = Array.isArray(data?.hints) && data.hints.length > 0
    ? data.hints
    : ["Reflect on the foundational concept principles."];

  const [revealedHints, setRevealedHints] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const handleRevealNextHint = () => {
    if (revealedHints < hints.length) {
      setRevealedHints(revealedHints + 1);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
            Interactive Problem Challenge
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            {data?.title || "Mini Concept Challenge"}
          </h3>
        </div>

        {onReadAloud && (
          <button
            onClick={() => onReadAloud(`${data?.title || "Challenge"}. ${data?.challenge}`)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all"
            title="Read challenge aloud"
          >
            <LucideIcon name="volume-2" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Challenge Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/20 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 text-brand-400 font-bold text-xs uppercase tracking-wider">
          <span className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20">🎮</span>
          <span>Your Task</span>
        </div>

        <div className="text-base md:text-lg font-medium text-slate-100 leading-relaxed">
          {data?.challenge}
        </div>

        {/* Hints Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcon name="lightbulb" className="w-4 h-4" />
              <span>Need a Hint? ({revealedHints}/{hints.length} revealed)</span>
            </span>

            {revealedHints < hints.length && (
              <button
                onClick={handleRevealNextHint}
                className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Reveal Hint {revealedHints + 1}</span>
                <LucideIcon name="chevron-down" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* List of Revealed Hints */}
          {revealedHints > 0 && (
            <div className="space-y-2 animate-fade-in">
              {hints.slice(0, revealedHints).map((hint, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="font-bold text-amber-400 shrink-0">Hint {idx + 1}:</span>
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Solution & Explanation Area */}
        <div className="border-t border-slate-850 pt-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="px-4 py-2.5 rounded-2xl border border-slate-700 bg-slate-950 hover:bg-slate-850 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <LucideIcon name={showAnswer ? "eye-off" : "eye"} className="w-4 h-4" />
              <span>{showAnswer ? "Hide Solution" : "Reveal Answer & Explanation"}</span>
            </button>

            <button
              onClick={() => setIsSolved(!isSolved)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                isSolved
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <LucideIcon name={isSolved ? "check-circle" : "award"} className="w-4 h-4" />
              <span>{isSolved ? "🎉 Challenge Solved!" : "I Solved It!"}</span>
            </button>
          </div>

          {showAnswer && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <LucideIcon name="check" className="w-4 h-4" />
                <span>Solution</span>
              </div>
              <p className="text-sm font-bold text-white leading-relaxed">
                {data?.answer}
              </p>
              {data?.explanation && (
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-900">
                  {data.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ChallengeResponse;
