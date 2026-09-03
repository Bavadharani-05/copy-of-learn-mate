import React from 'react';
import { LucideIcon } from './LucideIcon';
import { MOCK_TOPICS } from '../constants/mockData';
import { getStreakData } from '../services/streakService';

export function ProgressPage({ stats, userSearchHistory, setView, setActiveConcept, triggerPipelineSearch }) {

  // Custom mock interactive SVG Line Chart
  const lineChartData = [
    { label: "Mon", val: 3 },
    { label: "Tue", val: 5 },
    { label: "Wed", val: 2 },
    { label: "Thu", val: 8 },
    { label: "Fri", val: 6 },
    { label: "Sat", val: 9 },
    { label: "Sun", val: 12 }
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in py-2">

      {/* Dashboard Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-brand-500/10 text-brand-400 border border-brand-500/10 rounded-2xl flex-shrink-0">
            <LucideIcon name="book-open" className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold font-display text-white">{stats.conceptsLearned}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Concepts Learned</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 rounded-2xl flex-shrink-0">
            <LucideIcon name="message-square" className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold font-display text-white">{stats.questionsAsked}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Questions Asked</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 rounded-2xl flex-shrink-0">
            <LucideIcon name="target" className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-xl md:text-2xl font-bold font-display text-white">{stats.practiceAccuracy}%</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Practice Accuracy</div>
            {/* simple meter */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.practiceAccuracy}%` }}></div>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-orange-500/10 text-orange-400 border border-orange-500/10 rounded-2xl flex-shrink-0">
            <LucideIcon name="zap" className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold font-display text-orange-400">
              {stats.streakDays} {stats.streakDays === 1 ? 'Day' : 'Days'} 🔥
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              {getStreakData().isActiveToday ? "Streak Active Today ✓" : "Learning Streak"}
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Chart Column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-200">Study Frequency Chart</h3>
            <p className="text-xs text-slate-500 mt-0.5">Total tutoring requests processed per day</p>
          </div>

          {/* Graphical representation */}
          <div className="relative pt-4 flex flex-col justify-end min-h-[220px]">
            <div className="flex items-end justify-between gap-4 h-40 border-b border-slate-800 pb-2">
              {lineChartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-bold text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{d.val} asks</div>
                  <div
                    className="w-full bg-gradient-to-t from-brand-700 to-brand-500 rounded-lg group-hover:from-brand-500 group-hover:to-brand-400 transition-all duration-500"
                    style={{ height: `${(d.val / 12) * 100}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-3">
              {lineChartData.map((d, i) => (
                <span key={i} className="flex-1 text-center">{d.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Recently Learned Concept List Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-200">Recently Learned</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click a concept to review explanation</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setActiveConcept(MOCK_TOPICS.recursion);
                setView("answer");
              }}
              className="w-full flex items-center justify-between p-4 bg-slate-950 hover:bg-slate-850 rounded-2xl text-left border border-slate-850 hover:border-slate-700 transition-all group"
            >
              <div className="space-y-1 overflow-hidden">
                <span className="font-bold text-sm text-slate-200 group-hover:text-white block truncate">Python Recursion</span>
                <span className="text-[10px] text-slate-500 block">Category: Programming</span>
              </div>
              <span className="text-xs text-brand-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>Review</span>
                <LucideIcon name="chevron-right" className="w-3 h-3" />
              </span>
            </button>

            <button
              onClick={() => {
                setActiveConcept(MOCK_TOPICS.binary);
                setView("answer");
              }}
              className="w-full flex items-center justify-between p-4 bg-slate-950 hover:bg-slate-850 rounded-2xl text-left border border-slate-850 hover:border-slate-700 transition-all group"
            >
              <div className="space-y-1 overflow-hidden">
                <span className="font-bold text-sm text-slate-200 group-hover:text-white block truncate">Binary Numbers</span>
                <span className="text-[10px] text-slate-500 block">Category: Mathematics</span>
              </div>
              <span className="text-xs text-brand-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>Review</span>
                <LucideIcon name="chevron-right" className="w-3 h-3" />
              </span>
            </button>

            <button
              onClick={() => triggerPipelineSearch("Explain Linear Regression")}
              className="w-full flex items-center justify-between p-4 bg-slate-950 hover:bg-slate-850 rounded-2xl text-left border border-slate-850 hover:border-slate-700 transition-all group"
            >
              <div className="space-y-1 overflow-hidden">
                <span className="font-bold text-sm text-slate-200 group-hover:text-white block truncate">Linear Regression</span>
                <span className="text-[10px] text-slate-500 block">Category: Artificial Intelligence</span>
              </div>
              <span className="text-xs text-brand-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>Review</span>
                <LucideIcon name="chevron-right" className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ProgressPage;
