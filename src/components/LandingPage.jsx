import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';
import { generateLearnerProfile } from '../services/profile';

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
          An intelligent educational platform that tailors visual themes, explanations, and interactive practice around your unique learner profile.
        </p>
      </div>

      {/* Action Card / Form */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleStart} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              What should we call you?
            </label>
            <div className="relative">
              <input
                type="text"
                value={mockName}
                onChange={(e) => setMockName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors text-sm font-medium"
                required
              />
              <div className="absolute right-3.5 top-3.5 text-slate-500">
                <LucideIcon name="user" className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 flex items-center justify-center gap-2 group"
            >
              <span>Personalize My Experience</span>
              <LucideIcon name="sparkles" className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => {
                setUser(prev => ({ ...prev, name: mockName || "Alex" }));
                const defaultProfile = generateLearnerProfile({
                  color: "purple",
                  place: "library",
                  activity: "reading",
                  ageGroup: "Teen",
                  learningPreference: "step-by-step"
                });
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
          End-to-End Multimodal Adaptation Pipeline
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
            <div className="text-brand-400 font-bold text-xs uppercase mb-1">01. Profile Setup</div>
            <div className="text-sm font-semibold text-slate-200">Color, Place & Style</div>
            <div className="text-xs text-slate-500 mt-1">Multi-trait deterministic persona calculation</div>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
            <div className="text-indigo-400 font-bold text-xs uppercase mb-1">02. Theme Engine</div>
            <div className="text-sm font-semibold text-slate-200">Dynamic Atmosphere</div>
            <div className="text-xs text-slate-500 mt-1">Live backgrounds, mesh gradients & CSS variables</div>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
            <div className="text-emerald-400 font-bold text-xs uppercase mb-1">03. AI Explanations</div>
            <div className="text-sm font-semibold text-slate-200">Dual Model Pipeline</div>
            <div className="text-xs text-slate-500 mt-1">SmolLM2 content + Qwen 2.5 response transformer</div>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
            <div className="text-amber-400 font-bold text-xs uppercase mb-1">04. Interactive Modes</div>
            <div className="text-sm font-semibold text-slate-200">8 Learning Formats</div>
            <div className="text-xs text-slate-500 mt-1">3D Flashcards, live Quiz, timeline Steps, and Challenges</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default LandingPage;
