import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';

export function AnswerDisplayPage({
  activeConcept,
  user,
  setUser,
  learnerProfile,
  handleReadAloud,
  isReadingAloud,
  triggerPipelineSearch,
  setView,
  setCurrentPracticeQIndex,
  setPracticeAnswerFeedback,
  triggerToast
}) {
  const [showExplainMenu, setShowExplainMenu] = useState(false);

  // Get active text based on settings
  const ageGroupKey = learnerProfile?.ageGroup?.toLowerCase()?.includes("child") ? "child" :
                      learnerProfile?.ageGroup?.toLowerCase()?.includes("teen") ? "teen" :
                      learnerProfile?.ageGroup?.toLowerCase()?.includes("college") ? "college" : "adult";

  const ageContent = activeConcept?.ageContent || {};
  const explanationText = ageContent[ageGroupKey] || Object.values(ageContent)[0] || "";

  const analogyContent = activeConcept?.analogy || {};
  const analogyText = analogyContent[ageGroupKey] || Object.values(analogyContent)[0] || "";

  const handleExplainDifferently = (styleName, ageGroup = null) => {
    setShowExplainMenu(false);

    // Update preferences dynamically
    setUser(prev => ({
      ...prev,
      preferredStyles: [styleName, ...prev.preferredStyles.filter(s => s !== styleName)],
      ...(ageGroup && { ageGroup: ageGroup })
    }));

    // Trigger toast and run pipeline animation again
    triggerToast(`✨ Recalibrating explanation for "${styleName}"...`);
    triggerPipelineSearch(activeConcept.title);
  };

  const explainMenuOptions = [
    { name: "🧑 Like I'm a Child", style: "Simple Explanation", age: "Child" },
    { name: "📖 Using a Story", style: "Story-based", age: null },
    { name: "💻 With a Coding Example", style: "Examples", age: null },
    { name: "📊 Using a Diagram", style: "Visual / Diagram", age: null },
    { name: "🔢 Step-by-Step Explanation", style: "Step-by-Step", age: null },
    { name: "🎯 With a Real-world Example", style: "Examples", age: "Adult" }
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in py-2">

      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase mb-1">
            <span>Subject Category: {activeConcept.category}</span>
            <span>•</span>
            <span className="bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/10">Personalized</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display flex items-center gap-2.5">
            <span>🔄</span>
            <span>{activeConcept.title}</span>
          </h1>
        </div>

        {/* Top Control Toolbar */}
        <div className="flex flex-wrap items-center gap-2 relative">

          {/* Explain Differently Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExplainMenu(!showExplainMenu)}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-brand-600/10 border border-brand-500/20"
            >
              <LucideIcon name="refresh-cw" className="w-3.5 h-3.5" />
              <span>Explain differently</span>
              <LucideIcon name="chevron-down" className="w-3 h-3" />
            </button>

            {showExplainMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-slide-up">
                <div className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1.5 border-b border-slate-850">
                  Select Custom Method
                </div>
                {explainMenuOptions.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => handleExplainDifferently(opt.style, opt.age)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-850 transition-colors text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <span>{opt.name}</span>
                    <LucideIcon name="chevron-right" className="w-3 h-3 text-slate-600" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleReadAloud(explanationText)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${isReadingAloud ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850"}`}
            title="Read explanation aloud"
          >
            <LucideIcon name={isReadingAloud ? "volume-x" : "volume-2"} className="w-4 h-4" />
          </button>

          <button
            onClick={() => triggerToast("⭐ Saved concept to your bookmarks!")}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition-all"
            title="Bookmark concept"
          >
            <LucideIcon name="star" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Answer View Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Personalized Text */}
        <div className="lg:col-span-2 space-y-6">

          {/* Main customized explanation box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">
                Customized Explanation for {user.name} ({learnerProfile?.characterTitle || `${user.ageGroup} level`})
              </h3>
              <p className="text-slate-200 text-base md:text-lg leading-relaxed font-medium">
                {explanationText}
              </p>
            </div>

            {/* Render dynamic styles based on user selections */}
            <div className="border-t border-slate-850 pt-6 space-y-4">
              <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                Style Adaptation: {user.preferredStyles[0] || "Standard Explanation"}
              </h4>
              <div className="bg-slate-950/60 border border-slate-900 p-5 rounded-2xl">
                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                  {activeConcept?.styleContent?.[user?.preferredStyles?.[0]] || activeConcept?.styleContent?.["Simple Explanation"] || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer Button Links */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setCurrentPracticeQIndex(0);
                setPracticeAnswerFeedback(null);
                setView("practice");
              }}
              className={`bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all flex items-center gap-2 shadow-lg hover:shadow-brand-600/10 ${learnerProfile?.learningPreference === "practice-first" ? "pulse-glow-effect ring-2 ring-brand-500/30" : ""}`}
            >
              <LucideIcon name="target" className="w-4 h-4" />
              <span>Practice this concept</span>
            </button>

            <button
              onClick={() => triggerToast("👍 Thanks! Feedback helps train the adaptation engine.")}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 font-semibold py-3.5 px-4 rounded-2xl text-sm transition-all flex items-center gap-1.5"
            >
              <LucideIcon name="thumbs-up" className="w-4 h-4" />
              <span>Helpful</span>
            </button>

            <button
              onClick={() => triggerToast("👎 Feedback logged. We will adjust future generated draft selectors.")}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 font-semibold py-3.5 px-4 rounded-2xl text-sm transition-all flex items-center gap-1.5"
            >
              <LucideIcon name="thumbs-down" className="w-4 h-4" />
              <span>Not helpful</span>
            </button>
          </div>

        </div>

        {/* Right Column: Code, Analogy, Quick Card */}
        <div className="space-y-6">

          {/* Analogy Box */}
          {learnerProfile?.learningPreference !== "quick-simple" && (
            <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-brand-500/10 rounded-3xl p-6 glow-indigo">
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 rounded-xl bg-brand-500/10 text-brand-400">
                  <LucideIcon name="brain" className="w-4 h-4" />
                </span>
                <h4 className="font-display font-bold text-sm text-slate-200">Think of it like this</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "{analogyText}"
              </p>
            </div>
          )}

          {/* Example / Code Box */}
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <LucideIcon name="code" className="w-4 h-4" />
              </span>
              <h4 className="font-display font-bold text-sm text-slate-200">💡 Example Reference</h4>
            </div>
            <pre className="code-block-pre text-xs text-brand-300 p-4 rounded-xl overflow-x-auto leading-relaxed">
              <code>{activeConcept.code}</code>
            </pre>
          </div>

          {/* Key Remember box */}
          <div className="bg-emerald-950/10 border border-emerald-500/10 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <LucideIcon name="bookmark" className="w-4 h-4" />
              </span>
              <h4 className="font-display font-bold text-sm text-emerald-300">📌 Remember</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeConcept.remember}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AnswerDisplayPage;
