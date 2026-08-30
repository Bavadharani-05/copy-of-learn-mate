import React from 'react';
import { LucideIcon } from './LucideIcon';

export function OnboardingStep1({ setView, user, setUser }) {
  const ages = [
    { name: "Child", desc: "Ages 6-12", icon: "smile", descDetails: "Simple analogies & friendly tone." },
    { name: "Teen", desc: "Ages 13-18", icon: "zap", descDetails: "Relatable language & gaming/social terms." },
    { name: "College Student", desc: "Higher Ed", icon: "book-open", descDetails: "Academic details & concepts." },
    { name: "Adult", desc: "Professional", icon: "briefcase", descDetails: "Career contexts & practical usage." }
  ];

  const levels = [
    { name: "Beginner", desc: "No background knowledge needed.", color: "border-slate-800 hover:border-emerald-500/50" },
    { name: "Intermediate", desc: "Basic concepts are already known.", color: "border-slate-800 hover:border-brand-500/50" },
    { name: "Advanced", desc: "Deep analytical dive into mechanisms.", color: "border-slate-800 hover:border-rose-500/50" }
  ];

  const difficulties = ["Easy", "Moderate", "Challenging"];

  const handleNext = () => {
    setView("onboarding2");
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 animate-slide-up">
      {/* Onboarding Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Step 1 of 2</span>
          <h1 className="text-3xl font-display font-extrabold text-white mt-1">Let's personalize your learning experience</h1>
        </div>
        <div className="w-20 bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div className="bg-brand-500 h-full w-1/2 rounded-full"></div>
        </div>
      </div>

      <div className="space-y-8 bg-slate-900/50 border border-slate-850 p-6 md:p-8 rounded-3xl">
        {/* Age Group Card Grid */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">What is your Age Group?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {ages.map((a) => (
              <button
                key={a.name}
                type="button"
                onClick={() => setUser(prev => ({ ...prev, ageGroup: a.name }))}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all h-36 relative ${user.ageGroup === a.name ? "bg-brand-600/10 border-brand-500 shadow-md ring-1 ring-brand-500/30" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-2.5 rounded-xl ${user.ageGroup === a.name ? "bg-brand-500 text-white" : "bg-slate-900 text-slate-400"}`}>
                    <LucideIcon name={a.icon} className="w-5 h-5" />
                  </div>
                  {user.ageGroup === a.name && (
                    <span className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-100">{a.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Level Card Grid */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">What is your current Learning Level?</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levels.map((l) => (
              <button
                key={l.name}
                type="button"
                onClick={() => setUser(prev => ({ ...prev, learningLevel: l.name }))}
                className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-32 ${user.learningLevel === l.name ? "bg-brand-600/10 border-brand-500 ring-1 ring-brand-500/30" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}
              >
                <div>
                  <div className="font-bold text-slate-100 text-base flex items-center justify-between">
                    <span>{l.name}</span>
                    {user.learningLevel === l.name && (
                      <span className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center text-white text-[9px] font-bold">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{l.desc}</p>
                </div>
                <div className="text-[10px] font-semibold tracking-wider uppercase text-brand-400">
                  {l.name === "Beginner" && "No pre-requisites"}
                  {l.name === "Intermediate" && "Foundational knowledge"}
                  {l.name === "Advanced" && "Deep concepts & details"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Preference Selector */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">Preferred Explanation Difficulty</label>
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setUser(prev => ({ ...prev, difficulty: d }))}
                className={`py-3 rounded-xl border text-center transition-all font-semibold text-sm ${user.difficulty === d ? "bg-brand-600/20 border-brand-500 text-brand-300" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Onboarding Navigation controls */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-850">
          <button
            type="button"
            onClick={() => setView("landing")}
            className="text-slate-400 hover:text-slate-200 font-semibold flex items-center gap-1 text-sm py-2 px-4"
          >
            <LucideIcon name="arrow-left" className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-brand-500/20 flex items-center gap-2 group text-sm"
          >
            <span>Continue</span>
            <LucideIcon name="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingStep1;
