import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';

export function OnboardingStep2({ setView, user, setUser }) {
  const styles = [
    { name: "Simple Explanation", icon: "book-open", desc: "Clear, straight-to-the-point explanation." },
    { name: "Examples", icon: "code", desc: "Code, maths, and physical usage scenarios." },
    { name: "Step-by-Step", icon: "list", desc: "Logical, numbered structural sequences." },
    { name: "Visual / Diagram", icon: "image", desc: "ASCII structures and connection flowcharts." },
    { name: "Story-based", icon: "message-square", desc: "Tutoring via creative narrative analogies." },
    { name: "Interactive Practice", icon: "check-square", desc: "Practice questions mapping knowledge." }
  ];

  const lengths = ["Short", "Medium", "Detailed"];
  const subjectsList = ["Mathematics", "Science", "Programming", "Artificial Intelligence", "Languages", "General Knowledge"];
  const [selectedSubjects, setSelectedSubjects] = useState(["Science", "Programming"]);

  const handleToggleStyle = (styleName) => {
    if (user.preferredStyles.includes(styleName)) {
      if (user.preferredStyles.length > 1) {
        setUser(prev => ({
          ...prev,
          preferredStyles: prev.preferredStyles.filter(s => s !== styleName)
        }));
      }
    } else {
      setUser(prev => ({
        ...prev,
        preferredStyles: [...prev.preferredStyles, styleName]
      }));
    }
  };

  const handleToggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(prev => prev.filter(s => s !== subject));
    } else {
      setSelectedSubjects(prev => [...prev, subject]);
    }
  };

  const handleFinish = () => {
    setView("dashboard");
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 animate-slide-up">
      {/* Onboarding Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Step 2 of 2</span>
          <h1 className="text-3xl font-display font-extrabold text-white mt-1">Select your preferred learning styles</h1>
        </div>
        <div className="w-20 bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div className="bg-brand-500 h-full w-full rounded-full"></div>
        </div>
      </div>

      <div className="space-y-8 bg-slate-900/50 border border-slate-850 p-6 md:p-8 rounded-3xl">
        {/* Style Selection Cards (Multi-select) */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-1">
            Learning Styles
          </label>
          <p className="text-xs text-slate-500 mb-4">Select one or more options. We will combine these to structure responses.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {styles.map((s) => {
              const isSelected = user.preferredStyles.includes(s.name);
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => handleToggleStyle(s.name)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-28 relative ${isSelected ? "bg-brand-600/10 border-brand-500 ring-1 ring-brand-500/20" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-200 truncate pr-6">{s.name}</span>
                    {isSelected ? (
                      <span className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center text-white text-[9px] font-bold">✓</span>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700"></div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal mt-2">{s.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Response Length Preferences */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">Preferred Response Length</label>
          <div className="grid grid-cols-3 gap-4">
            {lengths.map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => setUser(prev => ({ ...prev, responseLength: len }))}
                className={`py-3 rounded-xl border text-center transition-all font-semibold text-sm ${user.responseLength === len ? "bg-brand-600/20 border-brand-500 text-brand-300" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"}`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Interest Badges */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-2">Topics of Interest</label>
          <p className="text-xs text-slate-500 mb-3">We will populate your dashboard questions based on these selections.</p>
          <div className="flex flex-wrap gap-2.5">
            {subjectsList.map((sub) => {
              const isSel = selectedSubjects.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleToggleSubject(sub)}
                  className={`px-4 py-2 rounded-full border text-xs font-medium transition-all ${isSel ? "bg-brand-600 text-white border-brand-500" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"}`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        {/* Onboarding Navigation controls */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-850">
          <button
            type="button"
            onClick={() => setView("onboarding1")}
            className="text-slate-400 hover:text-slate-200 font-semibold flex items-center gap-1 text-sm py-2 px-4"
          >
            <LucideIcon name="arrow-left" className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-brand-500/20 flex items-center gap-2 group text-sm"
          >
            <span>Finish Customization</span>
            <LucideIcon name="check" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingStep2;
