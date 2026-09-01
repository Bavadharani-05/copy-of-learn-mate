import React from 'react';
import { LucideIcon } from './LucideIcon';

export function ProfilePage({ user, setUser, learnerProfile, setLearnerProfile, setView, triggerToast }) {
  const ages = ["Child", "Teen", "College Student", "Adult"];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const difficulties = ["Easy", "Moderate", "Challenging"];
  const lengths = ["Short", "Medium", "Detailed"];
  const styles = ["Simple Explanation", "Examples", "Step-by-Step", "Visual / Diagram", "Story-based", "Interactive Practice"];

  const handleUpdatePreference = (key, value) => {
    setUser(prev => ({
      ...prev,
      [key]: value
    }));
  };

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

  const handleSave = () => {
    triggerToast("✨ Learning profile updated! Engine recalibrated.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 space-y-8 animate-fade-in">

      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white font-display">Engine Profile & Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your personal adaptation triggers to align the tutoring engine responses.</p>
      </div>

      {/* Top Active Persona Banner */}
      {learnerProfile && (
        <div className="bg-slate-900/90 border border-brand-500/25 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-brand-500/5">
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Active Learning Persona</div>
            <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
              <span>{learnerProfile.characterTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              {learnerProfile.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {learnerProfile.traits && learnerProfile.traits.map(t => (
                <span key={t} className="text-[10px] bg-brand-500/10 text-brand-300 font-bold px-2 py-0.5 rounded-full border border-brand-500/20">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setView("character-setup")}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-brand-500 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2 flex-shrink-0"
          >
            <LucideIcon name="sliders" className="w-3.5 h-3.5 text-brand-400" />
            <span>Retune Personalization</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Input Settings Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">

          {/* Age Group Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Age Group</label>
            <div className="flex flex-wrap gap-2">
              {ages.map((a) => (
                <button
                  key={a}
                  onClick={() => handleUpdatePreference("ageGroup", a)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${user.ageGroup === a ? "bg-brand-600 border-brand-500 text-white" : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-850"}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Level Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Learning Level</label>
            <div className="flex flex-wrap gap-2">
              {levels.map((l) => (
                <button
                  key={l}
                  onClick={() => handleUpdatePreference("learningLevel", l)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${user.learningLevel === l ? "bg-brand-600 border-brand-500 text-white" : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-850"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Details controls: Difficulty / Length */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Explanation Depth</label>
              <div className="flex gap-2">
                {difficulties.map((d) => (
                  <button
                    key={d}
                    onClick={() => handleUpdatePreference("difficulty", d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${user.difficulty === d ? "bg-brand-600 border-brand-500 text-white" : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-850"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Response Length</label>
              <div className="flex gap-2">
                {lengths.map((len) => (
                  <button
                    key={len}
                    onClick={() => handleUpdatePreference("responseLength", len)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${user.responseLength === len ? "bg-brand-600 border-brand-500 text-white" : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-850"}`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Styles checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Preferred Learning Styles</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {styles.map((s) => {
                const isChecked = user.preferredStyles.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => handleToggleStyle(s)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${isChecked ? "bg-brand-600/10 border-brand-500/50 text-brand-300" : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-850"}`}
                  >
                    <span>{s}</span>
                    <span className="flex-shrink-0 ml-3">
                      {isChecked ? (
                        <span className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center text-white text-[8px] font-bold">✓</span>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-800"></div>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-850 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-xl text-xs transition-all shadow-md hover:shadow-brand-500/10"
            >
              Update Preferences
            </button>
            <button
              type="button"
              onClick={() => {
                setView("character-setup");
              }}
              className="bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold py-3 px-6 rounded-xl text-xs transition-all flex items-center gap-1.5"
            >
              <LucideIcon name="refresh-cw" className="w-3.5 h-3.5" />
              <span>Change My Setup</span>
            </button>
          </div>

        </div>

        {/* Right Column: Dynamic Architecture Graphic */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 rounded-xl bg-brand-500/10 text-brand-400">
                <LucideIcon name="sliders" className="w-4 h-4" />
              </span>
              <h4 className="font-display font-bold text-sm text-slate-200">Adaptation Pipeline mapping</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Your configurations direct how LearnMate evaluates generated responses. The values below act as parameters in the AI prompt assembly:
            </p>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tone & Analogy Filter</div>
                <div className="text-xs font-semibold text-slate-200 flex justify-between">
                  <span>Age Constraint:</span>
                  <span className="text-brand-400">"{user.ageGroup}"</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Jargon & Complexity Filter</div>
                <div className="text-xs font-semibold text-slate-200 flex justify-between">
                  <span>Depth constraints:</span>
                  <span className="text-brand-400">"{user.learningLevel} / {user.difficulty}"</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Formatting & Structure Filter</div>
                <div className="text-xs font-semibold text-slate-200 flex justify-between">
                  <span>Layout constraints:</span>
                  <span className="text-brand-400">"{user.preferredStyles.slice(0, 2).join(" + ")}"</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-850 text-center">
            <span className="text-[10px] text-slate-500 block">LearnMate AI Platform Prototype</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ProfilePage;
