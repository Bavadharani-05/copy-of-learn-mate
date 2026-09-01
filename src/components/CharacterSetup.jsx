import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';
import { generateLearnerProfile } from '../services/profile';

export function CharacterSetup({ setView, setUser, setLearnerProfile }) {
  const [step, setStep] = useState(0); // 0: Welcome, 1: Color, 2: Place, 3: Activity, 4: Age, 5: Style, 6: Character Result
  const [selections, setSelections] = useState({
    color: '',
    place: '',
    activity: '',
    ageGroup: '',
    learningPreference: ''
  });

  const [computedProfile, setComputedProfile] = useState(null);

  const colors = [
    { name: "Blue", icon: "droplet", char: "Calm / Focused", class: "bg-blue-600/10 border-blue-500/30 hover:border-blue-500 text-blue-400 bg-blue-500" },
    { name: "Green", icon: "leaf", char: "Natural / Balanced", class: "bg-emerald-600/10 border-emerald-500/30 hover:border-emerald-500 text-emerald-400 bg-emerald-500" },
    { name: "Purple", icon: "sparkles", char: "Creative / Imaginative", class: "bg-purple-600/10 border-purple-500/30 hover:border-purple-500 text-purple-400 bg-purple-500" },
    { name: "Orange", icon: "zap", char: "Energetic / Bold", class: "bg-orange-600/10 border-orange-500/30 hover:border-orange-500 text-orange-400 bg-orange-500" }
  ];

  const places = [
    { name: "Garden", emoji: "🌿", char: "Relaxed / Curious", icon: "tree-pine" },
    { name: "Library", emoji: "📚", char: "Focused / Knowledge-oriented", icon: "library" },
    { name: "Home", emoji: "🏡", char: "Comfortable / Reflective", icon: "home" },
    { name: "Restaurant", emoji: "🍽️", char: "Social / Energetic", icon: "utensils" }
  ];

  const activities = [
    { name: "Playing", emoji: "🎮", char: "Interactive / Playful", icon: "gamepad-2" },
    { name: "Reading", emoji: "📖", char: "Analytical / Thoughtful", icon: "book-open" },
    { name: "Dancing", emoji: "💃", char: "Expressive / Energetic", icon: "activity" },
    { name: "Music", emoji: "🎵", char: "Creative / Emotional", icon: "music" }
  ];

  const ages = [
    { name: "Teen", emoji: "🎒", char: "High School & Youth", icon: "smile" },
    { name: "Adult", emoji: "💼", char: "Professional & Academic", icon: "user" },
    { name: "Elder", emoji: "🎖️", char: "Lifelong Learner", icon: "award" },
    { name: "Older Adult", emoji: "🌟", char: "Golden Age Learner", icon: "heart" }
  ];

  const preferences = [
    { key: "quick-simple", name: "Quick & Simple", emoji: "⚡", char: "Concise summaries & core facts", icon: "zap" },
    { key: "step-by-step", name: "Step-by-Step", emoji: "🪜", char: "Logical structured explanations", icon: "list-ordered" },
    { key: "practice-first", name: "Practice First", emoji: "🎯", char: "Examples & quiz questions first", icon: "target" },
    { key: "detailed-explanation", name: "Detailed Explanation", emoji: "🧠", char: "Deeper scientific background", icon: "book-open" }
  ];

  const handleSelect = (key, value) => {
    setSelections(prev => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    } else {
      setView("landing");
    }
  };

  // Generate learning character profile
  const handleGenerateProfile = () => {
    const profile = generateLearnerProfile(selections);
    setComputedProfile(profile);
    setLearnerProfile(profile);
    localStorage.setItem("learnmateProfile", JSON.stringify(profile));

    // Keep state in sync with App.jsx user state
    setUser(prev => ({
      ...prev,
      ageGroup: selections.ageGroup,
      preferredStyles: [
        selections.learningPreference === "quick-simple" ? "Simple Explanation" :
        selections.learningPreference === "step-by-step" ? "Step-by-Step" :
        selections.learningPreference === "practice-first" ? "Interactive Practice" : "Examples",
        ...prev.preferredStyles.filter(s => s !== selections.learningPreference)
      ]
    }));

    setStep(6);
  };

  const handleFinish = () => {
    setView("dashboard");
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 animate-slide-up">
      
      {/* Step Progress Header */}
      {step > 0 && step < 6 && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Personalization Setup</span>
            <h1 className="text-3xl font-display font-extrabold text-white mt-1">
              {step === 1 && "Which color feels most like you?"}
              {step === 2 && "Where would you rather spend your free time?"}
              {step === 3 && "What activity resonates most with you?"}
              {step === 4 && "Which age category best describes you?"}
              {step === 5 && "How do you prefer to learn?"}
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-brand-500" : i < step ? "w-2 bg-brand-600/40" : "w-2 bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Step 0: Welcome Introduction */}
        {step === 0 && (
          <div className="text-center py-6 space-y-8 animate-fade-in">
            <div className="w-20 h-20 bg-brand-500/10 border border-brand-500/20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner">
              ✨
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white">
                Let's personalize LearnMate for you ✨
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Tell us a little about your preferences so we can tailor the visual atmosphere, explanation styles, and interactive practice around you.
              </p>
            </div>

            <div className="pt-4 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 flex items-center justify-center gap-2 text-sm group"
              >
                <span>Begin Personalization</span>
                <LucideIcon name="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Color Select */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelect('color', c.name.toLowerCase())}
                className={`p-6 rounded-2xl border text-left flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] ${c.class}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${c.class.split(' ')[4]}`}>
                  <LucideIcon name={c.icon} className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{c.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{c.char}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Place Select */}
        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {places.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleSelect('place', p.name.toLowerCase())}
                className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-500 text-left flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-850/50 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {p.emoji}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{p.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.char}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Activity Select */}
        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activities.map((a) => (
              <button
                key={a.name}
                type="button"
                onClick={() => handleSelect('activity', a.name.toLowerCase())}
                className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-500 text-left flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-850/50 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {a.emoji}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{a.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{a.char}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Age Group Select */}
        {step === 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ages.map((a) => (
              <button
                key={a.name}
                type="button"
                onClick={() => handleSelect('ageGroup', a.name)}
                className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-500 text-left flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-850/50 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {a.emoji}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{a.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{a.char}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 5: Learning Preference Select */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {preferences.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => {
                    setSelections(prev => ({ ...prev, learningPreference: p.key }));
                  }}
                  className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all hover:scale-[1.01] ${selections.learningPreference === p.key ? "bg-brand-600/10 border-brand-500" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-2xl">
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-100 text-base truncate">{p.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.char}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-850 flex justify-end">
              <button
                type="button"
                disabled={!selections.learningPreference}
                onClick={handleGenerateProfile}
                className={`py-3.5 px-8 rounded-xl font-bold flex items-center gap-2 text-sm shadow-md transition-all ${selections.learningPreference ? "bg-brand-600 hover:bg-brand-500 text-white hover:shadow-brand-500/20" : "bg-slate-800 text-slate-600 cursor-not-allowed"}`}
              >
                <span>Generate Character</span>
                <LucideIcon name="sparkles" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Character Result Screen */}
        {step === 6 && computedProfile && (
          <div className="py-4 space-y-8 animate-fade-in text-center">
            
            {/* Header badges */}
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide text-brand-300 uppercase shadow-sm">
              <span>Your LearnMate Character ✨</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white">
                {computedProfile.characterTitle}
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                {computedProfile.description}
              </p>
            </div>

            {/* Profile Grid Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-4 text-left">
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">Learning Style</span>
                <span className="text-xs font-semibold text-slate-200 block capitalize">{selections.learningPreference ? selections.learningPreference.replace('-', ' ') : 'Adaptive'}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">Environment</span>
                <span className="text-xs font-semibold text-slate-200 block capitalize">{selections.place}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">Activity Preference</span>
                <span className="text-xs font-semibold text-slate-200 block capitalize">{selections.activity}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">Character Traits</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {computedProfile.traits && computedProfile.traits.slice(0, 2).map(t => (
                    <span key={t} className="text-[9px] bg-brand-500/10 text-brand-400 font-bold px-1.5 py-0.5 rounded border border-brand-500/15 capitalize">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 max-w-xs mx-auto">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 flex items-center justify-center gap-2 text-sm group"
              >
                <span>Start Learning</span>
                <LucideIcon name="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        )}

        {/* Back navigation buttons (Footer of active setup panels) */}
        {step > 0 && step < 6 && (
          <div className="mt-8 pt-4 flex items-center justify-between border-t border-slate-850">
            <button
              type="button"
              onClick={handleBack}
              className="text-slate-400 hover:text-slate-200 font-semibold flex items-center gap-1 text-sm py-2"
            >
              <LucideIcon name="arrow-left" className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default CharacterSetup;
