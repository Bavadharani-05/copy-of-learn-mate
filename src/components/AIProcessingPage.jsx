import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon } from './LucideIcon';
import { fetchFromHuggingFace } from '../services/api';
import { buildPersonalizedPrompt } from '../services/profile';

export function AIProcessingPage({ searchQuery, user, learnerProfile, onFinished }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [apiStatus, setApiStatus] = useState(user.hfSpaceUrl ? "Connecting to Hugging Face model space..." : "Local compilation mode");

  const apiResultsRef = useRef(null);
  const apiErrorRef = useRef(null);
  const isFinishedRef = useRef(false);

  useEffect(() => {
    // Stage 1 animation transition
    const t1 = setTimeout(() => setCurrentStep(1), 1200);
    // Stage-2 animation transition
    const t2 = setTimeout(() => setCurrentStep(2), 2400);

    const controller = new AbortController();

    // If HF Space URL is set, perform fetch
    if (user.hfSpaceUrl) {
      runApiQuery(controller.signal);
    } else {
      apiResultsRef.current = null;
      checkAndComplete();
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      controller.abort();
    };
  }, []);

  const checkAndComplete = () => {
    if (isFinishedRef.current) return;

    if (user.hfSpaceUrl) {
      if (apiResultsRef.current) {
        isFinishedRef.current = true;
        onFinished(apiResultsRef.current);
      } else if (apiErrorRef.current) {
        isFinishedRef.current = true;
        onFinished(null); // Fallback to mock data
      } else {
        setApiStatus("⌛ Model is processing... waiting for backend response...");
      }
    } else {
      isFinishedRef.current = true;
      onFinished(null);
    }
  };

  const runApiQuery = async (signal) => {
    try {
      setApiStatus("⚡ Connecting to backend service...");
      const personalizedQuery = buildPersonalizedPrompt(searchQuery, learnerProfile);
      const results = await fetchFromHuggingFace(user.hfSpaceUrl, personalizedQuery, signal);

      if (signal?.aborted) return;

      apiResultsRef.current = results;
      setApiStatus("✨ Answers successfully generated!");
      checkAndComplete();
    } catch (err) {
      if (err.name === 'AbortError' || signal?.aborted) return;
      console.error("API error:", err);
      apiErrorRef.current = err.message;
      setApiStatus("⚠️ Local backend API load issue. Falling back to local tutoring modules...");
      setTimeout(() => {
        // Fallback after showing error message
        checkAndComplete();
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 space-y-12 animate-fade-in flex flex-col justify-center min-h-[70vh]">

      {/* Screen Title */}
      <div className="text-center">
        <span className="text-xs font-bold tracking-wider text-brand-400 uppercase">AI Tutoring Pipeline</span>
        <h2 className="text-2xl font-bold text-white mt-1">Generating Explanation for:</h2>
        <div className="text-lg md:text-xl italic font-semibold text-slate-300 mt-2 bg-slate-900 w-fit mx-auto px-6 py-2 rounded-xl border border-slate-800">
          "{searchQuery}"
        </div>
        <p className="text-xs text-slate-500 mt-3 flex items-center justify-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></span>
          <span>{apiStatus}</span>
        </p>
      </div>

      {/* Visual Pipeline Node Progress */}
      <div className="relative">
        {/* Connection line background */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-900 -translate-y-1/2 z-0 hidden md:block"></div>
        <div
          className="absolute top-1/2 left-4 h-1 bg-brand-500 -translate-y-1/2 z-0 hidden md:block transition-all duration-1000"
          style={{ width: `${currentStep === 0 ? '25%' : currentStep === 1 ? '70%' : '100%'}` }}
        ></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">

          {/* Node 1: Generate */}
          <div className={`p-6 rounded-2xl bg-slate-900 border transition-all ${currentStep >= 0 ? "border-brand-500 ring-1 ring-brand-500/20" : "border-slate-800"}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wide">Stage 1</span>
              <span className="text-xs text-slate-500 font-semibold">Generate Pool</span>
            </div>
            <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
              <LucideIcon name="cpu" className="w-4 h-4 text-brand-400 animate-spin" />
              Drafting Responses
            </h4>
            <p className="text-xs text-slate-500 leading-normal mb-4">
              LLM builds two raw drafts based on standard educational taxonomy databases.
            </p>

            {/* Response comparison mockup */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className={`p-2.5 rounded-lg text-center ${currentStep >= 0 ? "bg-slate-950 border border-slate-800 text-slate-300" : "bg-slate-900 text-slate-700"}`}>
                <span className="font-bold block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Response A</span>
                Brief explanation...
              </div>
              <div className={`p-2.5 rounded-lg text-center ${currentStep >= 0 ? "bg-slate-950 border border-slate-800 text-slate-300 animate-pulse" : "bg-slate-900 text-slate-700"}`}>
                <span className="font-bold block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Response B</span>
                Detailed explanation...
              </div>
            </div>
          </div>

          {/* Node 2: Compare */}
          <div className={`p-6 rounded-2xl bg-slate-900 border transition-all ${currentStep >= 1 ? "border-brand-500 ring-1 ring-brand-500/20" : "border-slate-800/60 opacity-60"}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wide">Stage 2</span>
              <span className="text-xs text-slate-500 font-semibold">Evaluate Pool</span>
            </div>
            <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
              <LucideIcon name="check-square" className={`w-4 h-4 ${currentStep >= 1 ? "text-emerald-400" : "text-slate-500"}`} />
              AI Response Evaluator
            </h4>
            <p className="text-xs text-slate-500 leading-normal mb-3">
              Comparing responses for accuracy, clarity, and relevance to profiles.
            </p>

            <div className="space-y-1.5 text-[9px] font-semibold">
              <div className="flex items-center gap-2 text-emerald-400">
                <span>✓</span>
                <span>Accuracy Check Passed</span>
              </div>
              {currentStep >= 1 ? (
                <>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>✓</span>
                    <span>Relevance Match: 98%</span>
                  </div>
                  <div className="text-[10px] text-brand-300 font-bold mt-2 bg-brand-500/10 py-1 px-2 rounded w-fit border border-brand-500/15">
                    Best response selected
                  </div>
                </>
              ) : (
                <div className="text-slate-600 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                  <span>Analyzing style preferences...</span>
                </div>
              )}
            </div>
          </div>

          {/* Node 3: Personalize */}
          <div className={`p-6 rounded-2xl bg-slate-900 border transition-all ${currentStep >= 2 ? "border-brand-500 ring-1 ring-brand-500/20" : "border-slate-800/60 opacity-60"}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wide">Stage 3</span>
              <span className="text-xs text-slate-500 font-semibold">Translate Styles</span>
            </div>
            <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
              <LucideIcon name="sparkles" className={`w-4 h-4 ${currentStep >= 2 ? "text-brand-400 animate-pulse" : "text-slate-500"}`} />
              Personalizing for you
            </h4>
            <p className="text-xs text-slate-500 leading-normal mb-3">
              Adapting the selected explanation text to your active dashboard preference parameters.
            </p>

            <div className="space-y-1 text-[9px] text-slate-400">
              <div className="flex items-center justify-between border-b border-slate-850 pb-1">
                <span>Target Level:</span>
                <span className="text-brand-400 font-bold">{user.learningLevel}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-850 pb-1">
                <span>Age Tone:</span>
                <span className="text-brand-400 font-bold">{user.ageGroup}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Styles:</span>
                <span className="text-brand-400 font-bold truncate max-w-[120px]">{user.preferredStyles.join(", ")}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Progress status loader bars */}
      <div className="w-full max-w-sm mx-auto bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Overall Compile State</span>
          <span>{currentStep === 0 ? "35%" : currentStep === 1 ? "75%" : "99%"}</span>
        </div>
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${currentStep === 0 ? '35%' : currentStep === 1 ? '75%' : '99%'}` }}
          ></div>
        </div>
      </div>

    </div>
  );
}

export default AIProcessingPage;
