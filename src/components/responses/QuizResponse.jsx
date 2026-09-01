import React, { useState } from 'react';
import { LucideIcon } from '../LucideIcon';

export function QuizResponse({ data, onReadAloud }) {
  const rawQuestions = Array.isArray(data?.questions) && data.questions.length > 0
    ? data.questions
    : [
        {
          question: "What is the primary purpose of this concept?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct_answer: 0,
          explanation: "Option A accurately reflects the underlying principles."
        }
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = rawQuestions[currentIndex] || rawQuestions[0];
  const optionLetters = ["A", "B", "C", "D", "E", "F"];

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return; // Prevent changing after selection
    setSelectedOption(idx);
    setShowExplanation(true);
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: idx
    }));
  };

  const handleNext = () => {
    if (currentIndex < rawQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(userAnswers[nextIdx] ?? null);
      setShowExplanation(userAnswers[nextIdx] !== undefined);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setUserAnswers({});
    setQuizFinished(false);
  };

  // Calculate score
  const correctCount = rawQuestions.reduce((acc, q, idx) => {
    return acc + (userAnswers[idx] === q.correct_answer ? 1 : 0);
  }, 0);
  const scorePercent = Math.round((correctCount / rawQuestions.length) * 100);

  if (quizFinished) {
    return (
      <div className="space-y-6 animate-fade-in p-6 bg-slate-900/90 border border-slate-800 rounded-3xl text-center">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-3xl">
          {scorePercent >= 80 ? "🏆" : scorePercent >= 50 ? "🎯" : "📚"}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
            Quiz Completed!
          </span>
          <h3 className="text-2xl font-bold text-white font-display mt-1">
            Your Score: {correctCount} / {rawQuestions.length} ({scorePercent}%)
          </h3>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            {scorePercent >= 80
              ? "Outstanding! You have mastered this concept with high precision."
              : scorePercent >= 50
              ? "Good job! You understand the key ideas. Review the questions to reinforce your learning."
              : "Keep practicing! Review the steps and flashcards to build deeper intuition."}
          </p>
        </div>

        {/* Review Answers Accordion List */}
        <div className="text-left space-y-3 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase text-slate-400">Question Review:</h4>
          {rawQuestions.map((q, idx) => {
            const isCorrect = userAnswers[idx] === q.correct_answer;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  isCorrect
                    ? "bg-emerald-950/20 border-emerald-500/20"
                    : "bg-rose-950/20 border-rose-500/20"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-200">Q{idx + 1}: {q.question}</span>
                  <span className={isCorrect ? "text-emerald-400" : "text-rose-400"}>
                    {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                <p className="text-slate-400">{q.explanation}</p>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 mx-auto shadow-lg shadow-brand-600/20 transition-all"
          >
            <LucideIcon name="rotate-ccw" className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  const isAnswered = selectedOption !== null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Title and Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
            Interactive Concept Quiz
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            {data?.title || "Concept Check Quiz"}
          </h3>
        </div>

        <div className="text-xs font-bold text-slate-400 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
          Question {currentIndex + 1} of {rawQuestions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${Math.round(((currentIndex + 1) / rawQuestions.length) * 100)}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-base md:text-lg font-bold text-white leading-relaxed">
            {currentQ.question}
          </h4>

          {onReadAloud && (
            <button
              onClick={() => onReadAloud(currentQ.question)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-all shrink-0"
              title="Read question aloud"
            >
              <LucideIcon name="volume-2" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correct_answer;

            let optionStyle = "bg-slate-950/60 border-slate-850 text-slate-300 hover:bg-slate-850/50 hover:border-slate-700";

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10";
              } else if (isSelected) {
                optionStyle = "bg-rose-950/40 border-rose-500 text-rose-200 shadow-md shadow-rose-500/10";
              } else {
                optionStyle = "bg-slate-950/30 border-slate-900 text-slate-500 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all duration-200 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 ${
                      isAnswered && isCorrect
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold"
                        : isAnswered && isSelected
                        ? "bg-rose-500 text-white border-rose-400 font-extrabold"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    {optionLetters[idx] || idx + 1}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{option}</span>
                </div>

                {isAnswered && isCorrect && (
                  <LucideIcon name="check-circle" className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <LucideIcon name="x-circle" className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Step */}
        {showExplanation && (
          <div className="border-t border-slate-850 pt-5 space-y-4 animate-fade-in">
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                selectedOption === currentQ.correct_answer
                  ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                  : "bg-amber-950/20 border-amber-500/20 text-amber-300"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <LucideIcon name="info" className="w-4 h-4" />
                <span>
                  {selectedOption === currentQ.correct_answer
                    ? "Correct Answer!"
                    : "Not Quite! Here is the explanation:"}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-normal">
                {currentQ.explanation}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/20 transition-all"
              >
                <span>{currentIndex < rawQuestions.length - 1 ? "Next Question" : "See Final Score"}</span>
                <LucideIcon name="arrow-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default QuizResponse;
