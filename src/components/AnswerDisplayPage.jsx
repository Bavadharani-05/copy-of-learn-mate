import React, { useState, useEffect } from 'react';
import { LucideIcon } from './LucideIcon';
import { transformResponse, responseFormats } from '../services/api';
import { ResponseRenderer } from './responses/ResponseRenderer';
import { parseTransformerResponse } from '../utils/jsonParser';
import { AnimatedExplanationPlayer } from './animated/AnimatedExplanationPlayer';

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
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [transformedData, setTransformedData] = useState(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformError, setTransformError] = useState("");
  const [transformationCache, setTransformationCache] = useState({});
  const [showAnimatedExplanation, setShowAnimatedExplanation] = useState(false);

  // Get active text based on settings
  const ageGroupKey = learnerProfile?.ageGroup?.toLowerCase()?.includes("child") ? "child" :
    learnerProfile?.ageGroup?.toLowerCase()?.includes("teen") ? "teen" :
      learnerProfile?.ageGroup?.toLowerCase()?.includes("college") ? "college" : "adult";

  const ageContent = activeConcept?.ageContent || {};
  const explanationText = ageContent[ageGroupKey] || Object.values(ageContent)[0] || "";

  const analogyContent = activeConcept?.analogy || {};
  const analogyText = analogyContent[ageGroupKey] || Object.values(analogyContent)[0] || "";

  // Reset cache if active concept or explanation changes
  useEffect(() => {
    setTransformationCache({});
    setSelectedFormat(null);
    setTransformedData(null);
    setTransformError("");
    setShowAnimatedExplanation(false);
  }, [activeConcept?.title, explanationText]);

  const handleFormatSelect = async (formatKey) => {
    // 1. Guard against double-clicks while transforming
    if (isTransforming) {
      console.log("⚠️ [Transformer Guard] Request ignored: already transforming.");
      return;
    }

    // 2. If already viewing this format with data, no-op
    if (selectedFormat === formatKey && transformedData) {
      return;
    }

    setSelectedFormat(formatKey);
    setTransformError("");

    // 3. Instant Cache Hit Check
    if (transformationCache[formatKey]) {
      console.log("⚡ [Cache HIT] Instant recall for format:", formatKey);
      setTransformedData(transformationCache[formatKey]);
      setIsTransforming(false);
      return;
    }

    // 4. Cache Miss -> Make API Request
    setIsTransforming(true);
    setTransformedData(null);

    try {
      const learnerProfileText = `
Age Group: ${learnerProfile?.ageGroup || user?.ageGroup || "College Student"}
Learning Style Preference: ${learnerProfile?.learningPreference || user?.learningLevel || "Intermediate"}
Visual Theme Color: ${learnerProfile?.color || user?.color || "Blue"}
Preferred Study Place: ${learnerProfile?.environment || "Library"}
Study Activity: ${learnerProfile?.activity || "Reading"}
Character Traits: ${(learnerProfile?.traits || []).join(", ")}
`;

      const response = await transformResponse(
        explanationText,
        formatKey,
        learnerProfileText
      );

      const parsed = parseTransformerResponse(response, formatKey);
      console.log("Parsed structured data:", parsed);

      if (!parsed) {
        throw new Error("Unable to structure response data from transformer model.");
      }

      setTransformedData(parsed);
      // Save to cache for instant future retrieval
      setTransformationCache((prev) => ({
        ...prev,
        [formatKey]: parsed
      }));
    } catch (err) {
      console.error("Failed to transform response:", err);
      setTransformError(`Unable to transform. ${err.message || err}`);
    } finally {
      setIsTransforming(false);
    }
  };

  const formatsList = [
    { key: "simple", label: "Simple Explanation", icon: "book-open", emoji: "📖" },
    { key: "steps", label: "Step-by-Step", icon: "list", emoji: "🪜" },
    { key: "flashcards", label: "Flashcards", icon: "layers", emoji: "🃏" },
    { key: "quiz", label: "Quiz", icon: "help-circle", emoji: "🎯" },
    { key: "example", label: "Real-World Example", icon: "globe", emoji: "🌍" },
    { key: "challenge", label: "Mini Challenge", icon: "gamepad-2", emoji: "🎮" },
    { key: "story", label: "Story", icon: "book", emoji: "📚" },
    { key: "keypoints", label: "Key Points", icon: "check-circle", emoji: "💡" }
  ];

  const handleExplainDifferently = (styleName, ageGroup = null) => {
    setShowExplainMenu(false);

    setUser(prev => ({
      ...prev,
      preferredStyles: [styleName, ...prev.preferredStyles.filter(s => s !== styleName)],
      ...(ageGroup && { ageGroup: ageGroup })
    }));

    triggerToast(`✨ Recalibrating explanation for "${styleName}"...`);
    triggerPipelineSearch(activeConcept.title);
  };

  const explainMenuOptions = [
    { name: "👶 Like I'm a Child", style: "Simple Explanation", age: "Child" },
    { name: "📖 Using a Story", style: "Story-based", age: null },
    { name: "💻 With a Coding Example", style: "Examples", age: null },
    { name: "📊 Using a Diagram", style: "Visual / Diagram", age: null },
    { name: "🪜 Step-by-Step Explanation", style: "Step-by-Step", age: null },
    { name: "🌍 With a Real-world Example", style: "Examples", age: "Adult" }
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
            <span>📖</span>
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

        {/* Left Column: Personalized Text & Interactive Transformations */}
        <div className="lg:col-span-2 space-y-6">

          {/* Main customized explanation box */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-md shadow-2xl">
            <div className="bg-slate-950/80 border border-slate-800/80 p-5 md:p-6 rounded-2xl shadow-inner backdrop-blur-sm space-y-3">
              <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                Customized Explanation for you!
              </h3>
              <p className="text-slate-100 text-base md:text-lg leading-relaxed font-medium">
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

            {/* 🎬 Animated Explanation Launch Section */}
            <div className="border-t border-slate-850 pt-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span>Prefer visual learning & audio?</span>
                  <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-medium">New</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Break this answer into 3–5 animated scenes with voice narration and interactive diagrams.
                </p>
              </div>

              <button
                id="animated-explanation-btn"
                onClick={() => {
                  if (!showAnimatedExplanation && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setShowAnimatedExplanation((prev) => !prev);
                }}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-300 shadow-xl ${showAnimatedExplanation
                  ? "bg-slate-800 text-brand-300 border border-brand-500/40 hover:bg-slate-750"
                  : "bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-95"
                  }`}
              >
                <span className="text-base">🎬</span>
                <span>{showAnimatedExplanation ? "Close Animated Explanation" : "🎬 Animated Explanation"}</span>
                <LucideIcon name={showAnimatedExplanation ? "chevron-up" : "play"} className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

          {/* 🎬 Animated Explanation Player Stage */}
          {showAnimatedExplanation && (
            <AnimatedExplanationPlayer
              title={activeConcept?.title || "Concept Explanation"}
              explanationText={explanationText}
              onClose={() => {
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setShowAnimatedExplanation(false);
              }}
            />
          )}

          {/* Response Transformation Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                  How would you like to learn this? ✨
                </h3>
                {Object.keys(transformationCache).length > 0 && (
                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/20">
                    ⚡ {Object.keys(transformationCache).length} cached
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Choose an interactive format to transform the explanation above into custom learning experiences.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {formatsList.map((format) => {
                  const isCached = !!transformationCache[format.key];
                  const isSelected = selectedFormat === format.key;

                  return (
                    <button
                      key={format.key}
                      disabled={isTransforming}
                      onClick={() => handleFormatSelect(format.key)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all duration-200 relative ${isSelected
                        ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/20 scale-[1.02]"
                        : "bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-850/50 hover:text-slate-200 hover:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl">{format.emoji}</span>
                        <div className="flex items-center gap-1.5">
                          {isCached && !isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Cached for instant view" />
                          )}
                          <LucideIcon name={format.icon} className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-600"}`} />
                        </div>
                      </div>
                      <span className="text-xs font-bold leading-tight">{format.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transform Loading State */}
            {isTransforming && (
              <div className="bg-slate-950/95 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[160px] text-center space-y-4 animate-pulse shadow-2xl backdrop-blur-md">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center text-xs">🧠</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Creating your personalized {responseFormats[selectedFormat]} experience...
                  </p>
                </div>
              </div>
            )}

            {/* Transform Error State */}
            {transformError && (
              <div className="bg-rose-950/15 border border-rose-500/20 rounded-2xl p-5 text-center space-y-2">
                <div className="text-rose-400 font-bold text-xs flex items-center justify-center gap-2">
                  <LucideIcon name="alert-triangle" className="w-4 h-4" />
                  <span>Transformation Failed</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {transformError}
                </p>
              </div>
            )}

            {/* Transformed Interactive Component Display */}
            {!isTransforming && !transformError && transformedData && (
              <div className="bg-slate-950/60 border border-brand-500/25 rounded-2xl p-6 space-y-4 animate-fade-in shadow-lg shadow-brand-500/5">
                <ResponseRenderer data={transformedData} onReadAloud={handleReadAloud} />
              </div>
            )}
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

          Example / Code Box
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 space-y-4">
            {/* <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <LucideIcon name="code" className="w-4 h-4" />
              </span>
              <h4 className="font-display font-bold text-sm text-slate-200">💻 Example Reference</h4>
            </div> */}
            <pre className="code-block-pre text-xs text-brand-300 p-4 rounded-xl overflow-x-auto leading-relaxed">
              <code>{activeConcept.code}</code>
            </pre>
          </div>



        </div>

      </div>

    </div>
  );
}

export default AnswerDisplayPage;
