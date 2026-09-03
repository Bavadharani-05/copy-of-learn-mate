import React from 'react';
import { LucideIcon } from './LucideIcon';
import { recordDailyActivity } from '../services/streakService';

export function PracticePage({
  activeConcept,
  currentPracticeQIndex,
  setCurrentPracticeQIndex,
  practiceAnswerFeedback,
  setPracticeAnswerFeedback,
  stats,
  setStats,
  setView,
  triggerToast
}) {

  const questionPool = activeConcept.practice || [];
  const currentQuestion = questionPool[currentPracticeQIndex];

  if (!currentQuestion) {
    return (
      <div className="text-center py-10 space-y-4">
        <h2 className="text-xl font-bold text-slate-200">No practice questions available for this concept.</h2>
        <button onClick={() => setView("dashboard")} className="bg-brand-600 py-2 px-5 rounded-xl text-xs font-semibold">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleSelectOption = (optionIndex) => {
    if (practiceAnswerFeedback !== null) return; // already answered

    const isCorrect = optionIndex === currentQuestion.correct;
    setPracticeAnswerFeedback({
      selected: optionIndex,
      isCorrect: isCorrect
    });

    // Record daily activity for streak
    const streakResult = recordDailyActivity();
    if (streakResult.isNewIncrement) {
      triggerToast(streakResult.message);
    }

    // Update stats
    setStats(prev => {
      const newAsked = prev.questionsAsked + 1;
      const newAccuracy = Math.round(
        ((prev.questionsAsked * (prev.practiceAccuracy / 100)) + (isCorrect ? 1 : 0)) / newAsked * 100
      );
      return {
        ...prev,
        questionsAsked: newAsked,
        practiceAccuracy: newAccuracy,
        streakDays: streakResult.streakDays
      };
    });

    if (isCorrect) {
      triggerToast("🎉 Correct answer! Great job.");
    } else {
      triggerToast("❌ Incorrect. Read the explanation below!");
    }
  };

  const handleNextQuestion = () => {
    setPracticeAnswerFeedback(null);
    if (currentPracticeQIndex + 1 < questionPool.length) {
      setCurrentPracticeQIndex(currentPracticeQIndex + 1);
    } else {
      triggerToast("🎓 Practice completed! Review your progress.");
      setView("progress");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 space-y-8 animate-slide-up">

      {/* Title Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/20 px-3.5 py-1 rounded-full text-xs font-bold text-brand-300 mb-2">
          <LucideIcon name="target" className="w-3.5 h-3.5 text-brand-400" />
          <span>Let's Practice 🎯</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display">Concept Assessment</h1>
        <p className="text-slate-400 text-xs mt-1">Topic: {activeConcept.title}</p>
      </div>

      {/* Quiz Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">

        {/* Question Text */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Question {currentPracticeQIndex + 1} of {questionPool.length}</span>
          <h3 className="text-lg md:text-xl font-bold text-slate-100 leading-normal">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = practiceAnswerFeedback?.selected === idx;
            const isCorrectAnswer = currentQuestion.correct === idx;
            const isGraded = practiceAnswerFeedback !== null;

            let btnClass = "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700 hover:bg-slate-900";
            if (isGraded) {
              if (isCorrectAnswer) {
                btnClass = "bg-emerald-950/25 border-emerald-500 text-emerald-300 shadow-md";
              } else if (isSelected) {
                btnClass = "bg-rose-950/25 border-rose-500 text-rose-300 shadow-md";
              } else {
                btnClass = "bg-slate-950 border-slate-850 text-slate-600 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isGraded}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between group ${btnClass}`}
              >
                <span>{opt}</span>
                <span className="flex-shrink-0 ml-3">
                  {!isGraded && (
                    <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-bold group-hover:border-slate-500">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  )}
                  {isGraded && isCorrectAnswer && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                  )}
                  {isGraded && isSelected && !isCorrectAnswer && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold">✗</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Section (Visible only after selected) */}
        {practiceAnswerFeedback && (
          <div className="border-t border-slate-850 pt-6 space-y-4 animate-fade-in">
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${practiceAnswerFeedback.isCorrect ? "bg-emerald-950/15 border-emerald-500/10 text-slate-300" : "bg-rose-950/15 border-rose-500/10 text-slate-300"}`}>
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <LucideIcon name="info" className="w-3.5 h-3.5" />
                {practiceAnswerFeedback.isCorrect ? "Correct Explanation" : "Incorrect. Here's why:"}
              </div>
              <p>{currentQuestion.explanation}</p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-md hover:shadow-brand-500/10 flex items-center gap-2 group"
              >
                <span>{currentPracticeQIndex + 1 < questionPool.length ? "Next Question" : "View Results"}</span>
                <LucideIcon name="arrow-right" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default PracticePage;
