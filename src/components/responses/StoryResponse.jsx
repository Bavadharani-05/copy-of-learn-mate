import React from 'react';
import { LucideIcon } from '../LucideIcon';

export function StoryResponse({ data, onReadAloud }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
            Narrative Learning Adventure
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            {data?.title || "Story Explanation"}
          </h3>
        </div>

        {onReadAloud && (
          <button
            onClick={() => onReadAloud(`${data?.title || ""}. ${data?.story || ""}. Lesson: ${data?.lesson || ""}`)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all"
            title="Read aloud"
          >
            <LucideIcon name="volume-2" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Story Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
          <span className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20">📚</span>
          <span>Chapter Journey</span>
        </div>

        <div className="text-slate-200 text-base md:text-lg leading-relaxed font-serif italic whitespace-pre-line border-l-2 border-brand-500/40 pl-6 py-2">
          "{data?.story}"
        </div>

        {/* Moral & Core Lesson Box */}
        {data?.lesson && (
          <div className="border-t border-slate-850 pt-6">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-brand-500/20 space-y-2">
              <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <LucideIcon name="bookmark" className="w-4 h-4" />
                <span>The Core Scientific / Moral Lesson</span>
              </h4>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {data.lesson}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default StoryResponse;
