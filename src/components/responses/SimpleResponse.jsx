import React from 'react';
import { LucideIcon } from '../LucideIcon';

export function SimpleResponse({ data, onReadAloud }) {
  const keyPoints = Array.isArray(data?.key_points) ? data.key_points : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
            Simplified Learning Breakdown
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            {data?.title || "Simple Explanation"}
          </h3>
        </div>

        {onReadAloud && (
          <button
            onClick={() => onReadAloud(`${data?.title || ""}. ${data?.content || ""}`)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all"
            title="Read aloud"
          >
            <LucideIcon name="volume-2" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Explanation Body */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <p className="text-slate-200 text-base md:text-lg leading-relaxed font-medium whitespace-pre-line">
          {data?.content}
        </p>

        {/* Key Takeaways Highlight Cards */}
        {keyPoints.length > 0 && (
          <div className="border-t border-slate-850 pt-6 space-y-4">
            <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-2">
              <LucideIcon name="sparkles" className="w-4 h-4" />
              <span>Key Takeaways</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-850 hover:border-brand-500/30 flex items-start gap-3 transition-all"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-xs text-slate-300 font-medium leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default SimpleResponse;
