import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LucideIcon } from '../LucideIcon';
import { DynamicSceneCanvas } from './DynamicSceneCanvas';
import { parseAnimationPlan, generateDynamicAnimationPlanLocally } from '../../utils/animationPlanParser';

/**
 * DynamicAnimatedLearningVideo
 * 
 * Reusable AI-Driven Dynamic Educational Animation Player for LearnMate.
 * 
 * Accepts:
 * <DynamicAnimatedLearningVideo
 *     animationPlan={activeConcept?.animation}
 *     answer={explanationText}
 *     user={user}
 * />
 * 
 * Capabilities:
 * - Interprets AI-generated or dynamic local animation plans with zero hardcoding.
 * - Dynamic scene manager with sequential autoplay, timeline scrubber, and chapter ticks.
 * - Synchronized in-video subtitles with word pacing and Web Speech API narration.
 * - Speed controls (0.75x, 1x, 1.25x, 1.5x), Fullscreen, Mute/Voice toggles.
 * - Adaptive layout, personalization scaling (Child/Teen/College), and instant cleanup.
 */
export function DynamicAnimatedLearningVideo({
  animationPlan = null,
  answer = "",
  user = null,
  learnerProfile = null,
  title = "Concept Explanation",
  onClose = null
}) {
  // Resolve or dynamically synthesize the animation plan
  const plan = useMemo(() => {
    if (animationPlan && Array.isArray(animationPlan.scenes) && animationPlan.scenes.length > 0) {
      return animationPlan;
    }
    return parseAnimationPlan(animationPlan, answer, title);
  }, [animationPlan, answer, title]);

  const scenes = plan.scenes || [];
  const environment = plan.environment || "generic";

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hasFinished, setHasFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time tracking for timeline scrubber
  const [currentVideoTime, setCurrentVideoTime] = useState(0); // in seconds

  const playerContainerRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const activeUtteranceRef = useRef(null);
  const timeTickerRef = useRef(null);

  // Calculate durations for each scene
  const sceneDurations = useMemo(() => {
    return scenes.map((s) => {
      const words = (s.caption || "").split(" ").length;
      const baseDuration = Math.max(s.duration || 4, Math.round(words * 0.38));
      return Math.max(3.5, Math.round(baseDuration / playbackSpeed));
    });
  }, [scenes, playbackSpeed]);

  const totalVideoDuration = useMemo(() => {
    return sceneDurations.reduce((acc, curr) => acc + curr, 0);
  }, [sceneDurations]);

  // Compute accumulated start times for each scene
  const sceneStartTimes = useMemo(() => {
    const starts = [0];
    for (let i = 0; i < sceneDurations.length - 1; i++) {
      starts.push(starts[i] + sceneDurations[i]);
    }
    return starts;
  }, [sceneDurations]);

  const activeScene = scenes[currentSceneIndex] || scenes[0] || {
    caption: "Generating animated explanation...",
    objects: ["concept"],
    actions: ["pulse"],
    duration: 4
  };

  // Compute progress of the active scene (0 to 1)
  const currentSceneStartTime = sceneStartTimes[currentSceneIndex] || 0;
  const currentSceneDuration = sceneDurations[currentSceneIndex] || 4;
  const sceneProgress = Math.max(
    0,
    Math.min(1, (currentVideoTime - currentSceneStartTime) / currentSceneDuration)
  );

  // Cancel any active speech synthesis
  const stopSpeech = () => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Play narration for current scene
  const playSceneNarration = (sceneIndex) => {
    stopSpeech();

    const targetScene = scenes[sceneIndex];
    if (!targetScene) return;

    if (!isMuted && 'speechSynthesis' in window) {
      const cleanNarration = (targetScene.caption || "").replace(/`{1,3}[\s\S]*?`{1,3}/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanNarration);
      utterance.rate = playbackSpeed;
      utterance.pitch = user?.ageGroup?.toLowerCase()?.includes("child") ? 1.15 : 1.0;

      utterance.onend = () => {
        handleSceneEnd(sceneIndex);
      };

      utterance.onerror = () => {
        handleSceneEnd(sceneIndex);
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer when muted
      const durationMs = (sceneDurations[sceneIndex] || 4) * 1000;
      fallbackTimerRef.current = setTimeout(() => {
        handleSceneEnd(sceneIndex);
      }, durationMs);
    }
  };

  const handleSceneEnd = (sceneIndex) => {
    if (sceneIndex < scenes.length - 1) {
      const nextIdx = sceneIndex + 1;
      setCurrentSceneIndex(nextIdx);
      setCurrentVideoTime(sceneStartTimes[nextIdx]);
    } else {
      setIsPlaying(false);
      setHasFinished(true);
      setCurrentVideoTime(totalVideoDuration);
    }
  };

  // Synchronize speech whenever currentSceneIndex, isPlaying, isMuted, or playbackSpeed changes
  useEffect(() => {
    if (isPlaying && !hasFinished) {
      playSceneNarration(currentSceneIndex);
    } else {
      stopSpeech();
    }

    return () => {
      stopSpeech();
    };
  }, [currentSceneIndex, isPlaying, isMuted, playbackSpeed, hasFinished]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (timeTickerRef.current) clearInterval(timeTickerRef.current);
    };
  }, []);

  // Smooth continuous video timer
  useEffect(() => {
    if (timeTickerRef.current) clearInterval(timeTickerRef.current);

    if (isPlaying && !hasFinished) {
      timeTickerRef.current = setInterval(() => {
        setCurrentVideoTime((prev) => {
          const next = prev + 0.1 * playbackSpeed;
          if (next >= totalVideoDuration) {
            clearInterval(timeTickerRef.current);
            setIsPlaying(false);
            setHasFinished(true);
            return totalVideoDuration;
          }

          // Check if current time has crossed into the next scene
          const nextSceneIndex = sceneStartTimes.findIndex((start, i) => {
            const nextStart = sceneStartTimes[i + 1] ?? totalVideoDuration;
            return next >= start && next < nextStart;
          });

          if (nextSceneIndex !== -1 && nextSceneIndex !== currentSceneIndex) {
            setCurrentSceneIndex(nextSceneIndex);
          }

          return next;
        });
      }, 100);
    }

    return () => {
      if (timeTickerRef.current) clearInterval(timeTickerRef.current);
    };
  }, [isPlaying, hasFinished, playbackSpeed, totalVideoDuration, sceneStartTimes, currentSceneIndex]);

  // Scrubber jump to time
  const handleSeek = (targetTime) => {
    const clamped = Math.max(0, Math.min(totalVideoDuration, targetTime));
    setCurrentVideoTime(clamped);

    // Find which scene this belongs to
    let foundIndex = 0;
    for (let i = 0; i < sceneStartTimes.length; i++) {
      if (clamped >= sceneStartTimes[i]) {
        foundIndex = i;
      }
    }
    setCurrentSceneIndex(foundIndex);

    if (hasFinished && clamped < totalVideoDuration) {
      setHasFinished(false);
      setIsPlaying(true);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      const next = currentSceneIndex + 1;
      setCurrentSceneIndex(next);
      setCurrentVideoTime(sceneStartTimes[next]);
      setHasFinished(false);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      const prev = currentSceneIndex - 1;
      setCurrentSceneIndex(prev);
      setCurrentVideoTime(sceneStartTimes[prev]);
      setHasFinished(false);
    }
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setCurrentVideoTime(0);
    setHasFinished(false);
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const ageGroupText = learnerProfile?.ageGroup || user?.ageGroup || "Adult";
  const isChild = ageGroupText.toLowerCase().includes("child");

  return (
    <div
      ref={playerContainerRef}
      className={`relative w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none max-h-screen' : 'my-4'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 text-xs">
            🎬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white leading-tight">
                {plan.title || title}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {environment}
              </span>
              {isChild && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Junior Mode
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Scene {currentSceneIndex + 1} of {scenes.length}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
              isMuted
                ? 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-300 hover:text-white'
            }`}
            title={isMuted ? "Unmute Voice Narration" : "Mute Voice Narration"}
          >
            <LucideIcon name={isMuted ? "volume-x" : "volume-2"} className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-xs bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            <LucideIcon name={isFullscreen ? "minimize" : "maximize"} className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-2 rounded-xl text-xs bg-slate-850 hover:bg-rose-950/40 border border-slate-750 hover:border-rose-800/50 text-slate-400 hover:text-rose-300 transition-colors ml-1"
              title="Close Player"
            >
              <LucideIcon name="x" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Video Viewport */}
      <div className="relative w-full overflow-hidden bg-slate-950 group">
        <DynamicSceneCanvas
          scene={activeScene}
          sceneIndex={currentSceneIndex}
          sceneProgress={sceneProgress}
          isPlaying={isPlaying}
          speed={playbackSpeed}
          environment={environment}
          user={user}
        />

        {/* In-Video Synchronized Subtitles (YouTube/Netflix Style) */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center px-4 pointer-events-none z-10">
          <div className="max-w-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 px-5 py-2.5 rounded-2xl shadow-2xl text-center transition-all duration-300">
            <p className="text-xs sm:text-sm md:text-base font-semibold text-white tracking-wide leading-relaxed">
              {activeScene.caption}
            </p>
          </div>
        </div>

        {/* Video Overlay Center Play Button when paused */}
        {!isPlaying && !hasFinished && (
          <div
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs cursor-pointer z-20"
          >
            <div className="w-16 h-16 rounded-full bg-brand-600/90 hover:bg-brand-500 text-white flex items-center justify-center shadow-2xl shadow-brand-500/40 transform hover:scale-110 transition-all">
              <LucideIcon name="play" className="w-8 h-8 ml-1" />
            </div>
          </div>
        )}

        {/* Replay Overlay on Completion */}
        {hasFinished && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm z-20 space-y-4 p-6 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <LucideIcon name="check-circle" className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Lesson Completed!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                You've finished the animated explanation for "{plan.title || title}".
              </p>
            </div>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <LucideIcon name="rotate-ccw" className="w-4 h-4" />
              <span>Watch Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Chaptered Timeline Scrubber */}
      <div className="px-5 pt-3 pb-1 bg-slate-900/95 border-t border-slate-800">
        <div className="relative w-full h-2 bg-slate-800/90 rounded-full cursor-pointer overflow-hidden flex"
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const clickX = e.clientX - rect.left;
               const ratio = clickX / rect.width;
               handleSeek(ratio * totalVideoDuration);
             }}
        >
          {/* Chapter Slices */}
          {scenes.map((sc, idx) => {
            const start = sceneStartTimes[idx];
            const dur = sceneDurations[idx];
            const widthPct = (dur / totalVideoDuration) * 100;
            const isCompleted = currentVideoTime >= start + dur;
            const isActive = currentSceneIndex === idx;

            let fillWidth = 0;
            if (isCompleted) {
              fillWidth = 100;
            } else if (isActive) {
              fillWidth = ((currentVideoTime - start) / dur) * 100;
            }

            return (
              <div
                key={idx}
                style={{ width: `${widthPct}%` }}
                className="relative h-full border-r border-slate-950/60 last:border-r-0 bg-slate-800"
              >
                <div
                  style={{ width: `${fillWidth}%` }}
                  className={`h-full transition-all duration-75 ${
                    isActive
                      ? "bg-gradient-to-r from-brand-500 to-indigo-400"
                      : "bg-brand-600"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-slate-900/95">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevScene}
            disabled={currentSceneIndex === 0}
            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Scene"
          >
            <LucideIcon name="skip-back" className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (hasFinished) {
                handleRestart();
              } else {
                setIsPlaying(!isPlaying);
              }
            }}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-md shadow-brand-600/20"
            title={isPlaying ? "Pause" : "Play"}
          >
            <LucideIcon name={isPlaying ? "pause" : "play"} className="w-4 h-4" />
          </button>

          <button
            onClick={handleNextScene}
            disabled={currentSceneIndex >= scenes.length - 1}
            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Scene"
          >
            <LucideIcon name="skip-forward" className="w-4 h-4" />
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-400 hover:text-slate-200 transition-colors"
            title="Restart Video"
          >
            <LucideIcon name="rotate-ccw" className="w-3.5 h-3.5" />
          </button>

          {/* Time Display */}
          <div className="text-[11px] font-mono text-slate-400 font-medium ml-2">
            <span className="text-slate-200">{formatTime(currentVideoTime)}</span> / {formatTime(totalVideoDuration)}
          </div>
        </div>

        {/* Right: Chapter Ticker & Speed Selector */}
        <div className="flex items-center gap-3">
          {/* Active scene indicators */}
          <div className="flex items-center gap-1.5">
            {scenes.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSceneIndex(i);
                  setCurrentVideoTime(sceneStartTimes[i]);
                  setHasFinished(false);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSceneIndex
                    ? "w-6 bg-brand-500 shadow-sm shadow-brand-500/50"
                    : i < currentSceneIndex
                    ? "w-2 bg-slate-600"
                    : "w-2 bg-slate-800"
                }`}
                title={`Jump to Scene ${i + 1}`}
              />
            ))}
          </div>

          {/* Playback Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-850 border border-slate-750 p-0.5 rounded-xl">
            {[0.75, 1, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  playbackSpeed === spd
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DynamicAnimatedLearningVideo;
