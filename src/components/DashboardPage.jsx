import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';

export function DashboardPage({ user, learnerProfile, triggerPipelineSearch, userSearchHistory, setView, setActiveConcept }) {
  const [typedInput, setTypedInput] = useState("");
  const [showMicAlert, setShowMicAlert] = useState(false);
  const [showClipAlert, setShowClipAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typedInput.trim()) {
      triggerPipelineSearch(typedInput);
    }
  };

  const categories = [
    { name: "Mathematics", icon: "hash", color: "text-amber-400 bg-amber-400/10 border-amber-400/20", tag: "binary numbers" },
    { name: "Science", icon: "droplet", color: "text-green-400 bg-green-400/10 border-green-400/20", tag: "photosynthesis" },
    { name: "Programming", icon: "code", color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20", tag: "recursion" },
    { name: "Artificial Intelligence", icon: "cpu", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", tag: "machine learning" },
    { name: "Languages", icon: "globe", color: "text-pink-400 bg-pink-400/10 border-pink-400/20", tag: "language translation" },
    { name: "General Knowledge", icon: "help-circle", color: "text-blue-400 bg-blue-400/10 border-blue-400/20", tag: "black holes" }
  ];

  const suggestedQuestions = [
    "Explain recursion simply",
    "What is photosynthesis?",
    "Teach me binary numbers",
    "Explain machine learning"
  ];

  return (
    <div className="w-full space-y-10 animate-fade-in py-2">

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-display">Hi, {user.name} 👋</h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">What would you like to learn today? Your AI tutor is loaded and ready.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Settings Status:</span>
            <span className="text-xs bg-brand-500/20 text-brand-300 font-bold px-2 py-0.5 rounded-full border border-brand-500/20">Active</span>
          </div>
        </div>
      </div>

      {/* Large AI Search Box Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden glow-indigo">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-500">
              <LucideIcon name="sparkles" className="w-5 h-5 text-brand-400 animate-pulse-slow" />
            </div>

            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Ask anything... e.g., Explain photosynthesis"
              className="w-full bg-slate-950 border border-slate-850 rounded-2xl py-4 pl-12 pr-28 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 text-base md:text-lg transition-all"
            />

            {/* Action Buttons within Search bar */}
            <div className="absolute right-3 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowMicAlert(true)}
                title="Voice input (disabled in demo)"
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LucideIcon name="mic" className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowClipAlert(true)}
                title="Attach document (disabled in demo)"
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LucideIcon name="paperclip" className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!typedInput.trim()}
                className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all ${typedInput.trim() ? "bg-brand-600 hover:bg-brand-500 text-white" : "bg-slate-800 text-slate-600 cursor-not-allowed"}`}
              >
                <LucideIcon name="arrow-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Suggestion tags under input */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Try asking:</span>
          {suggestedQuestions.map((q, idx) => {
            let displayQ = q;
            const pref = learnerProfile?.learningPreference;
            if (pref === "step-by-step") {
              displayQ = `${idx + 1}. ${q}`;
            } else if (pref === "practice-first") {
              displayQ = `🎯 Quiz: ${q}`;
            } else if (pref === "detailed-explanation") {
              displayQ = `💡 Deep Dive: ${q}`;
            }
            return (
              <button
                key={q}
                onClick={() => triggerPipelineSearch(q)}
                className="px-3 py-1 rounded-full bg-slate-950 border border-slate-850 hover:bg-slate-850 hover:text-brand-300 text-slate-400 transition-colors cursor-pointer"
              >
                "{displayQ}"
              </button>
            );
          })}
        </div>
      </div>

      {/* Mock Mic / Clip Popups */}
      {showMicAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 animate-slide-up">
            <div className="w-14 h-14 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto text-brand-400 border border-brand-500/20">
              <LucideIcon name="mic" className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-bold text-lg text-slate-100">Speech-to-Text Listening</h3>
            <p className="text-xs text-slate-400">Speak now... "Explain machine learning simply." Voice capture is simulating transcript in prototype mode.</p>
            <button
              onClick={() => {
                setTypedInput("Explain machine learning simply");
                setShowMicAlert(false);
              }}
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-5 rounded-xl text-xs w-full transition-all"
            >
              Simulate speech capture
            </button>
          </div>
        </div>
      )}

      {showClipAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 animate-slide-up">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400 border border-indigo-500/20">
              <LucideIcon name="file-text" className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-100">Upload Learning Notes</h3>
            <p className="text-xs text-slate-400">Upload a PDF or text file for the AI to ingest and summarize. Mock uploading is fully functional in development sandboxes.</p>
            <div className="border-2 border-dashed border-slate-800 hover:border-brand-500 p-4 rounded-xl cursor-pointer bg-slate-950/50 transition-colors">
              <div className="text-[10px] text-slate-500">Drag & drop files or click to choose</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTypedInput("Summarize my notes on photosynthesis");
                  setShowClipAlert(false);
                }}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex-1 transition-all"
              >
                Ingest mock note
              </button>
              <button
                onClick={() => setShowClipAlert(false)}
                className="bg-slate-850 hover:bg-slate-800 text-slate-400 py-2 px-4 rounded-xl text-xs border border-slate-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Learning Categories Grid */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-xl text-slate-200">Explore Subjects</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => triggerPipelineSearch(`Explain ${c.tag}`)}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-850 text-left hover:border-slate-700 hover:bg-slate-900 transition-all group flex flex-col justify-between h-36"
            >
              <div className={`p-2.5 rounded-xl border w-fit ${c.color} transition-transform group-hover:scale-105 duration-200`}>
                <LucideIcon name={c.icon} className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-200 group-hover:text-white block mt-3">{c.name}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Quick lesson</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search History & Streak Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recents list */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-900 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-lg text-slate-300">Your Learning Logs</h4>
            <LucideIcon name="history" className="w-4 h-4 text-slate-600" />
          </div>

          <div className="space-y-2">
            {userSearchHistory.length > 0 ? (
              userSearchHistory.map((h, i) => (
                <button
                  key={i}
                  onClick={() => triggerPipelineSearch(h.query)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 text-left group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-slate-800 text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <LucideIcon name="sparkles" className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-slate-300 group-hover:text-slate-100 transition-colors">{h.query}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{h.date}</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-600 p-4 text-center">No queries searched yet.</p>
            )}
          </div>
        </div>

        {/* Pipeline banner card */}
        <div className="bg-gradient-to-br from-brand-900/40 to-slate-900 border border-brand-500/10 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl"></div>
          <div>
            <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center text-brand-300 mb-4">
              <LucideIcon name="cog" className="w-5 h-5 animate-spin" />
            </div>
            <h4 className="font-display font-bold text-lg text-white">How Engine Adapts</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              When you ask questions, LearnMate's pipeline generates multiple drafts, evaluates them against your style requirements, selects the best draft, and translates it for your learning profile.
            </p>
          </div>
          <button
            onClick={() => setView("profile")}
            className="text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1 mt-6 group w-fit"
          >
            <span>Configure Engine Preferences</span>
            <LucideIcon name="chevron-right" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
}

export default DashboardPage;
