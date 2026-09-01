import React from 'react';
import { LucideIcon } from '../LucideIcon';

export function KeyPointsResponse({ data, onReadAloud }) {
  const points = Array.isArray(data?.points) ? data.points : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
            Essential Takeaways
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            {data?.title || "Key Points Overview"}
          </h3>
        </div>

        {onReadAloud && (
          <button
            onClick={() => onReadAloud(points.join(". "))}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all"
            title="Read aloud"
          >
            <LucideIcon name="volume-2" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point, idx) => (
          <div
            key={idx}
            className="bg-slate-900/90 border border-slate-800 hover:border-brand-500/30 rounded-3xl p-6 flex items-start gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/5 group"
          >
            <span className="w-8 h-8 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
              #{idx + 1}
            </span>
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default KeyPointsResponse;
