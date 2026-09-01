import React, { useState } from 'react';
import { LucideIcon } from '../LucideIcon';

export function StepsResponse({ data, onReadAloud }) {
  const steps = Array.isArray(data?.steps) && data.steps.length > 0
    ? data.steps
    : [{ number: 1, title: "Process", description: "Review steps." }];

  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (idx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
            Sequential Learning Path
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            {data?.title || "Step-by-Step Breakdown"}
          </h3>
        </div>

        <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <span>{completedCount} / {steps.length} Steps Mastered</span>
          {completedCount === steps.length && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              ✓ All Done!
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps Timeline Cards */}
      <div className="space-y-4 relative">
        {steps.map((step, idx) => {
          const isDone = !!completedSteps[idx];
          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all duration-200 relative ${
                isDone
                  ? "bg-slate-900/50 border-emerald-500/30 shadow-md shadow-emerald-500/5"
                  : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-2xl border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isDone
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold"
                        : "bg-brand-500/10 text-brand-400 border-brand-500/20 font-extrabold"
                    }`}
                  >
                    {isDone ? "✓" : step.number || idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-white font-display">
                    {step.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {onReadAloud && (
                    <button
                      onClick={() => onReadAloud(`${step.title}. ${step.description}`)}
                      className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-all"
                      title="Read step aloud"
                    >
                      <LucideIcon name="volume-2" className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => toggleStep(idx)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isDone
                        ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <LucideIcon name={isDone ? "check-circle" : "circle"} className="w-3.5 h-3.5" />
                    <span>{isDone ? "Completed" : "Mark Done"}</span>
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal pl-11">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default StepsResponse;
