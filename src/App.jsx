import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from './components/LucideIcon';
import LandingPage from './components/LandingPage';
import CharacterSetup from './components/CharacterSetup';
import BackgroundLayer from './components/BackgroundLayer';
import { applyLearnerTheme } from './services/profile';
import DashboardPage from './components/DashboardPage';
import AIProcessingPage from './components/AIProcessingPage';
import AnswerDisplayPage from './components/AnswerDisplayPage';
import PracticePage from './components/PracticePage';
import ProgressPage from './components/ProgressPage';
import ProfilePage from './components/ProfilePage';

import { MOCK_TOPICS, generateDynamicExplanation } from './constants/mockData';
import { getStreakData, recordDailyActivity } from './services/streakService';

export function App() {
  // On mount, check if there is a saved learner profile
  const [learnerProfile, setLearnerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("learnmateProfile");
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed) {
        applyLearnerTheme(parsed);
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });

  // Navigation & Screen routing state
  const [view, setView] = useState(() => {
    try {
      const saved = localStorage.getItem("learnmateProfile");
      return saved ? "dashboard" : "landing";
    } catch (e) {
      return "landing";
    }
  });

  // User profile settings
  const [user, setUser] = useState(() => {
    const defaultUser = {
      name: "Alex",
      ageGroup: "College Student", // Child, Teen, College Student, Adult
      learningLevel: "Intermediate", // Beginner, Intermediate, Advanced
      difficulty: "Moderate", // Easy, Moderate, Challenging
      responseLength: "Medium", // Short, Medium, Detailed
      preferredStyles: ["Simple Explanation", "Examples", "Step-by-Step"],
      hfSpaceUrl: "https://huggingface.co/spaces/Bavadharani05/learn-mate"
    };
    try {
      const saved = localStorage.getItem("learnmateProfile");
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed) {
        return {
          ...defaultUser,
          ageGroup: parsed.ageGroup,
          preferredStyles: [
            parsed.learningPreference === "quick-simple" ? "Simple Explanation" :
            parsed.learningPreference === "step-by-step" ? "Step-by-Step" :
            parsed.learningPreference === "practice-first" ? "Interactive Practice" : "Examples",
            ...defaultUser.preferredStyles.filter(s => s !== parsed.learningPreference)
          ]
        };
      }
    } catch (e) {}
    return defaultUser;
  });

  useEffect(() => {
    if (learnerProfile) {
      applyLearnerTheme(learnerProfile);
    }
  }, [learnerProfile]);

  // User input states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConcept, setActiveConcept] = useState(null); // holds parsed explanation object
  const [currentPracticeQIndex, setCurrentPracticeQIndex] = useState(0);
  const [practiceAnswerFeedback, setPracticeAnswerFeedback] = useState(null); // { selected, isCorrect }
  const [userSearchHistory, setUserSearchHistory] = useState([
    { query: "Explain recursion in Python", date: "Today", topicId: "recursion" },
    { query: "What is photosynthesis?", date: "Yesterday", topicId: "photosynthesis" }
  ]);

  // Statistics
  const [stats, setStats] = useState(() => {
    const streakInfo = getStreakData();
    return {
      conceptsLearned: 3,
      questionsAsked: 12,
      practiceAccuracy: 85,
      streakDays: streakInfo.streakDays
    };
  });

  // Sound and notifications states
  const [showToast, setShowToast] = useState(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const speechUtteranceRef = useRef(null);

  // Sync streak on mount (checks if streak was broken due to inactivity)
  useEffect(() => {
    const streakInfo = getStreakData();
    setStats(prev => ({
      ...prev,
      streakDays: streakInfo.streakDays
    }));
  }, []);

  // Record daily activity helper
  const handleRecordDailyActivity = () => {
    const res = recordDailyActivity();
    setStats(prev => ({
      ...prev,
      streakDays: res.streakDays
    }));
    if (res.isNewIncrement) {
      triggerToast(res.message);
    }
    return res;
  };

  // Show customized feedback toast
  const triggerToast = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  // TTS Reader
  const handleReadAloud = (text) => {
    if ('speechSynthesis' in window) {
      if (isReadingAloud) {
        window.speechSynthesis.cancel();
        setIsReadingAloud(false);
      } else {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/`{1,3}[\s\S]*?`{1,3}/g, ''); // strip code
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsReadingAloud(false);
        utterance.onerror = () => setIsReadingAloud(false);
        speechUtteranceRef.current = utterance;
        setIsReadingAloud(true);
        window.speechSynthesis.speak(utterance);
        triggerToast("🔊 Playing voice synthesis...");
      }
    } else {
      triggerToast("❌ Text-to-Speech not supported on this browser.");
    }
  };

  // Run generation pipeline and navigate
  const triggerPipelineSearch = (query) => {
    if (!query || query.trim() === "") return;

    // Stop any speech playing
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
    }

    setSearchQuery(query);
    setView("processing");
  };

  // Complete processing simulation and fetch explanation
  const finalizePipelineSearch = (query, apiResults = null) => {
    let conceptData;
    const lowerQuery = query.toLowerCase();

    if (apiResults) {
      conceptData = {
        title: query,
        category: "AI Model Response",
        icon: "cpu",
        color: "from-brand-600 to-indigo-500",
        remember: "This explanation was generated live by your SmolLM2 model.",
        code: apiResults.answer_a,
        ageContent: {
          child: apiResults.answer_a,
          teen: apiResults.answer_a,
          college: apiResults.answer_a,
          adult: apiResults.answer_a
        },
        styleContent: {
          "Simple Explanation": apiResults.answer_a,
          "Examples": apiResults.answer_b,
          "Step-by-Step": apiResults.answer_a,
          "Visual / Diagram": apiResults.answer_b,
          "Story-based": apiResults.answer_b,
          "Interactive Practice": apiResults.answer_a
        },
        analogy: {
          child: apiResults.answer_b,
          teen: apiResults.answer_b,
          college: apiResults.answer_b,
          adult: apiResults.answer_b
        },
        practice: [
          {
            question: `Which generated answer approach did you find more helpful for "${query}"?`,
            options: [
              "Answer A (Direct / Direct tutor explanations)",
              "Answer B (Creative / Analogy & story elements)",
              "Both templates were helpful",
              "Neither template was helpful"
            ],
            correct: 0,
            explanation: "Answer A focuses on direct, simple syntax, whereas Answer B leverages creative examples and real-world analogies."
          }
        ]
      };
    } else if (lowerQuery.includes("recursion")) {
      conceptData = MOCK_TOPICS.recursion;
    } else if (lowerQuery.includes("photosynthesis") || lowerQuery.includes("photo")) {
      conceptData = MOCK_TOPICS.photosynthesis;
    } else if (lowerQuery.includes("binary") || lowerQuery.includes("base-2")) {
      conceptData = MOCK_TOPICS.binary;
    } else {
      conceptData = generateDynamicExplanation(query, user);
    }

    setActiveConcept(conceptData);

    // Save to history
    const exists = userSearchHistory.some(h => h.query.toLowerCase() === query.toLowerCase());
    if (!exists) {
      setUserSearchHistory([
        { query: query, date: "Just now", topicId: lowerQuery.includes("recursion") ? "recursion" : lowerQuery.includes("photo") ? "photosynthesis" : lowerQuery.includes("binary") ? "binary" : "custom" },
        ...userSearchHistory
      ]);
      setStats(prev => ({
        ...prev,
        questionsAsked: prev.questionsAsked + 1,
        conceptsLearned: prev.conceptsLearned + 1
      }));
    }

    // Record daily activity for streak
    handleRecordDailyActivity();

    setView("answer");
  };

  // Clean up SpeechSynthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const isAccessibleText = learnerProfile?.ageGroup?.toLowerCase()?.includes("elder") || 
                           learnerProfile?.ageGroup?.toLowerCase()?.includes("older");

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-sans relative ${isAccessibleText ? 'theme-accessible-text' : ''}`}>
      <BackgroundLayer profile={learnerProfile} />

      {/* Toast Alert Banner */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-brand-600 text-white font-medium px-4 py-3 rounded-xl shadow-2xl border border-brand-400 animate-slide-up">
          <LucideIcon name="info" className="w-5 h-5" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col md:flex-row">

        {/* Navigation Sidebar (Hidden on landing page & onboarding) */}
        {view !== "landing" && !view.startsWith("onboarding") && (
          <aside className="w-full md:w-64 bg-slate-900/90 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col flex-shrink-0 z-30">
            {/* Logo area */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <LucideIcon name="graduation-cap" className="text-white w-6 h-6" />
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-wide text-white">LearnMate</span>
                <span className="text-brand-400 font-bold ml-1">AI</span>
              </div>
            </div>

            {/* Profile badge summary */}
            <div className="px-6 py-4 border-b border-slate-800/40 bg-slate-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-brand-300">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-semibold text-slate-200 truncate">{user.name}</div>
                  <div className="text-xs text-brand-400 font-medium truncate flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {user.learningLevel} • {user.ageGroup}
                  </div>
                </div>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 p-4 space-y-1.5">
              <button
                onClick={() => setView("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${view === "dashboard" ? "bg-brand-600/25 text-brand-300 border border-brand-500/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}
              >
                <LucideIcon name="layout-dashboard" className="w-4 h-4" />
                <span>Home / Dashboard</span>
              </button>

              <button
                onClick={() => {
                  if (activeConcept) {
                    setView("answer");
                  } else {
                    triggerToast("💡 Ask a question first to view explanations!");
                    setView("dashboard");
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${view === "answer" || view === "processing" ? "bg-brand-600/25 text-brand-300 border border-brand-500/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}
              >
                <LucideIcon name="sparkles" className="w-4 h-4" />
                <span>Ask AI</span>
              </button>

              <button
                onClick={() => {
                  if (!activeConcept) {
                    setActiveConcept(MOCK_TOPICS.recursion); // default selection
                  }
                  setCurrentPracticeQIndex(0);
                  setPracticeAnswerFeedback(null);
                  setView("practice");
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${view === "practice" ? "bg-brand-600/25 text-brand-300 border border-brand-500/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}
              >
                <LucideIcon name="target" className="w-4 h-4" />
                <span>Practice Suite</span>
              </button>

              <button
                onClick={() => setView("progress")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${view === "progress" ? "bg-brand-600/25 text-brand-300 border border-brand-500/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}
              >
                <LucideIcon name="trending-up" className="w-4 h-4" />
                <span>Progress Tracking</span>
              </button>

              <button
                onClick={() => setView("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${view === "profile" ? "bg-brand-600/25 text-brand-300 border border-brand-500/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}
              >
                <LucideIcon name="settings" className="w-4 h-4" />
                <span>Profile & Styles</span>
              </button>
            </nav>

            {/* Sidebar Footer Badge */}
            <div className="p-4 border-t border-slate-800/50 text-center">
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Daily Streak</div>
                <div className="text-xl font-bold font-display text-orange-400 mt-1 flex items-center justify-center gap-1.5">
                  <span>🔥</span> {stats.streakDays} {stats.streakDays === 1 ? 'Day' : 'Days'}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/60">
                  {getStreakData().isActiveToday ? (
                    <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active Today
                    </div>
                  ) : (
                    <button
                      onClick={handleRecordDailyActivity}
                      className="text-[11px] text-brand-400 hover:text-brand-300 font-medium underline transition-colors cursor-pointer"
                      title="Click to check in today"
                    >
                      Check in today 🔥
                    </button>
                  )}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Dynamic View Panel content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

          {/* Top Navbar Header (Visible once logged in) */}
          {view !== "landing" && !view.startsWith("onboarding") && (
            <header className="h-16 border-b border-slate-800/60 bg-slate-900/40 px-6 flex items-center justify-between z-10">
              <h2 className="font-display font-semibold text-lg text-slate-200">
                {view === "dashboard" && "Workspace Dashboard"}
                {view === "answer" && "Personalized Explanation"}
                {view === "processing" && "Adaptive Generation Pipeline"}
                {view === "practice" && "Interactive Practice Suite"}
                {view === "progress" && "Your Learning Progress"}
                {view === "profile" && "Adaptive Engine Settings"}
              </h2>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 bg-slate-800/60 border border-slate-700 px-3 py-1 rounded-full text-xs font-medium text-slate-300">
                  <span className="text-brand-400">Level:</span>
                  <span>{user.learningLevel}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 bg-slate-800/60 border border-slate-700 px-3 py-1 rounded-full text-xs font-medium text-slate-300">
                  <span className="text-brand-400">Style:</span>
                  <span>{user.preferredStyles[0] || "Adaptive"}</span>
                </div>
                <button
                  onClick={() => {
                    setView("landing");
                    triggerToast("👋 Logged out of profile.");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all text-xs font-medium"
                >
                  Log Out
                </button>
              </div>
            </header>
          )}

          {/* Render individual components based on state */}
          <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            {view === "landing" && (
              <LandingPage setView={setView} user={user} setUser={setUser} setLearnerProfile={setLearnerProfile} />
            )}

            {view === "character-setup" && (
              <CharacterSetup
                setView={setView}
                setUser={setUser}
                setLearnerProfile={setLearnerProfile}
              />
            )}

            {view === "dashboard" && (
              <DashboardPage
                user={user}
                learnerProfile={learnerProfile}
                triggerPipelineSearch={triggerPipelineSearch}
                userSearchHistory={userSearchHistory}
                setView={setView}
                setActiveConcept={setActiveConcept}
                stats={stats}
                onRecordDailyActivity={handleRecordDailyActivity}
              />
            )}

            {view === "processing" && (
              <AIProcessingPage
                searchQuery={searchQuery}
                user={user}
                learnerProfile={learnerProfile}
                onFinished={(results) => finalizePipelineSearch(searchQuery, results)}
              />
            )}

            {view === "answer" && activeConcept && (
              <AnswerDisplayPage
                activeConcept={activeConcept}
                user={user}
                setUser={setUser}
                learnerProfile={learnerProfile}
                handleReadAloud={handleReadAloud}
                isReadingAloud={isReadingAloud}
                triggerPipelineSearch={triggerPipelineSearch}
                setView={setView}
                setCurrentPracticeQIndex={setCurrentPracticeQIndex}
                setPracticeAnswerFeedback={setPracticeAnswerFeedback}
                triggerToast={triggerToast}
              />
            )}

            {view === "practice" && activeConcept && (
              <PracticePage
                activeConcept={activeConcept}
                currentPracticeQIndex={currentPracticeQIndex}
                setCurrentPracticeQIndex={setCurrentPracticeQIndex}
                practiceAnswerFeedback={practiceAnswerFeedback}
                setPracticeAnswerFeedback={setPracticeAnswerFeedback}
                stats={stats}
                setStats={setStats}
                setView={setView}
                triggerToast={triggerToast}
              />
            )}

            {view === "progress" && (
              <ProgressPage
                stats={stats}
                userSearchHistory={userSearchHistory}
                setView={setView}
                setActiveConcept={setActiveConcept}
                triggerPipelineSearch={triggerPipelineSearch}
              />
            )}

            {view === "profile" && (
              <ProfilePage
                user={user}
                setUser={setUser}
                learnerProfile={learnerProfile}
                setLearnerProfile={setLearnerProfile}
                setView={setView}
                triggerToast={triggerToast}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

