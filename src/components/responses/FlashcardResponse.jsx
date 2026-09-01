import React, { useState } from 'react';
import { LucideIcon } from '../LucideIcon';

export function FlashcardResponse({ data, onReadAloud }) {
  const cards = Array.isArray(data?.cards) && data.cards.length > 0
    ? data.cards
    : [{ question: "Key Concept", answer: "Review the explanation details." }];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState(cards);

  const currentCard = deck[currentIndex] || deck[0];
  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  const handleReset = () => {
    setIsFlipped(false);
    setDeck(cards);
    setCurrentIndex(0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Title and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
            Interactive Flashcard Deck
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            {data?.title || "Concept Flashcards"}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Shuffle flashcards"
          >
            <LucideIcon name="shuffle" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Reset deck order"
          >
            <LucideIcon name="rotate-ccw" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Counter */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-400">
          <span>Card {currentIndex + 1} of {deck.length}</span>
          <span className="text-brand-400">{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Flashcard Container */}
      <div
        onClick={handleFlip}
        className="cursor-pointer select-none perspective-1000 group"
      >
        <div
          className={`relative min-h-[260px] md:min-h-[300px] w-full rounded-3xl p-8 transition-all duration-500 transform-style-3d border shadow-xl flex flex-col justify-between ${
            isFlipped
              ? "bg-gradient-to-br from-brand-950/40 to-slate-900 border-brand-500/30 shadow-brand-500/10"
              : "bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-brand-500/5"
          }`}
        >
          {/* Card Top Banner */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                isFlipped
                  ? "bg-brand-500/20 text-brand-300 border-brand-500/30"
                  : "bg-slate-950 text-slate-400 border-slate-800"
              }`}
            >
              {isFlipped ? "💡 Answer" : "❓ Question"}
            </span>

            {onReadAloud && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReadAloud(isFlipped ? currentCard.answer : currentCard.question);
                }}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-850 transition-all"
                title="Read aloud"
              >
                <LucideIcon name="volume-2" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Card Main Text */}
          <div className="my-auto py-6 text-center">
            {isFlipped ? (
              <div className="text-slate-100 text-lg md:text-xl font-medium leading-relaxed animate-fade-in">
                {currentCard.answer}
              </div>
            ) : (
              <div className="text-white text-xl md:text-2xl font-bold font-display leading-relaxed">
                {currentCard.question}
              </div>
            )}
          </div>

          {/* Flip Hint Footer */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-brand-400 transition-colors">
            <LucideIcon name="refresh-cw" className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Click card to {isFlipped ? "view question" : "flip and see answer"}</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          disabled={deck.length <= 1}
          className="flex-1 py-3 px-4 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <LucideIcon name="arrow-left" className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        <div className="text-xs font-bold text-slate-400 px-3">
          {currentIndex + 1} / {deck.length}
        </div>

        <button
          onClick={handleNext}
          disabled={deck.length <= 1}
          className="flex-1 py-3 px-4 rounded-2xl border border-brand-500/30 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Next Card</span>
          <LucideIcon name="arrow-right" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
export default FlashcardResponse;
