import React from 'react';
import { LucideIcon } from '../LucideIcon';

export function ExampleResponse({ data, onReadAloud }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
            Real-World Application (for example)
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            {data?.title ? `${data.title} (for example)` : "Everyday Example (for example)"}
          </h3>
        </div>

        {onReadAloud && (
          <button
            onClick={() => onReadAloud(`${data?.title || ""}. Scenario: ${data?.scenario || ""}. Connection: ${data?.connection || ""}`)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all"
            title="Read aloud"
          >
            <LucideIcon name="volume-2" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Scenario Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <span className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">🌍</span>
            <span>The Real-World Scenario (for example)</span>
          </div>
          <p className="text-slate-200 text-base leading-relaxed font-medium">
            {data?.scenario}
          </p>
        </div>

        {/* Connection Box */}
        <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <LucideIcon name="link-2" className="w-4 h-4" />
            <span>How This Maps to the Concept</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {data?.connection}
          </p>
        </div>

        {/* Key Takeaway Banner */}
        {data?.key_takeaway && (
          <div className="bg-gradient-to-r from-brand-950/30 to-slate-900 border border-brand-500/25 rounded-3xl p-6 flex items-start gap-4">
            <span className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 shrink-0 text-lg">
              💡
            </span>
            <div>
              <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">
                Key Insight to Remember
              </h4>
              <p className="text-sm text-white font-medium leading-relaxed">
                {data.key_takeaway}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ExampleResponse;
