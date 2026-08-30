import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';

export function LandingPage({ setView, user, setUser, setLearnerProfile }) {
  const [mockName, setMockName] = useState(user.name || "Alex");

  const handleStart = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, name: mockName || "Alex" }));
    setView("character-setup");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[80vh] animate-fade-in py-10">

      {/* Top Tagline Badges */}
      <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-brand-300 uppercase mb-8 shadow-sm">
        <LucideIcon name="sparkles" className="w-3.5 h-3.5" />
        <span>Adaptive AI Platform</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-display text-white mb-6 leading-tight">
          LearnMate <span className="text-gradient-indigo">AI</span>
        </h1>
        <p className="text-2xl md:text-3xl font-display font-medium text-slate-300 italic mb-6">
          "Learning that adapts to you."
        </p>
        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
          An AI-powered personalized learning platform that explains concepts in a way that works best for you.
          No static answers—only dynamically generated tutoring mapped to your age, learning style, and level.
        </p>
      </div>

      {/* Action Form Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden glow-indigo">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl"></div>

        <form onSubmit={handleStart} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              What is your name?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <LucideIcon name="user" className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="text"
                required
                value={mockName}
                onChange={(e) => setMockName(e.target.value)}
                placeholder="Enter your name... e.g. Alex"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 flex items-center justify-center gap-2 group text-base"
            >
              <span>Get Started</span>
              <LucideIcon name="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => {
                setUser(prev => ({ ...prev, name: mockName || "Alex" }));
                const defaultProfile = {
                  color: "purple",
                  environment: "library",
                  activity: "reading",
                  ageGroup: "Teen",
                  learningPreference: "step-by-step",
                  characterTitle: "The Focused Scholar 📚",
                  traits: ["creative", "focused", "thoughtful", "structured"],
                  responseStyle: "creative and structured",
                  uiTheme: "purple-library",
                  description: "You thrive on creative, imaginative inputs. Mapped to the library and reading, your LearnMate experience will balance focus with expression."
                };
                setLearnerProfile(defaultProfile);
                localStorage.setItem("learnmateProfile", JSON.stringify(defaultProfile));
                setView("dashboard");
              }}
              className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Skip Login / View Demo</span>
            </button>
          </div>
        </form>
      </div>

      {/* Visual Pipeline Flow Chart for Landing Page */}
      <div className="mt-16 w-full max-w-4xl bg-slate-900/40 border border-slate-900 rounded-3xl p-6 glass-panel-light text-center">
        <h4 className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-6">
          The Personalized Learning Pipeline
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-4 text-xs font-semibold text-slate-400">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-brand-400 font-bold border border-slate-800">1</div>
            <span>User Question</span>
          </div>
          <div className="hidden sm:block text-slate-700"><LucideIcon name="arrow-right" className="mx-auto w-5 h-5" /></div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-brand-400 font-bold border border-slate-800">2</div>
            <span>AI Response Pool</span>
          </div>
          <div className="hidden sm:block text-slate-700"><LucideIcon name="arrow-right" className="mx-auto w-5 h-5" /></div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-brand-400 font-bold border border-slate-800">3</div>
            <span>Evaluation & Optimization</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
