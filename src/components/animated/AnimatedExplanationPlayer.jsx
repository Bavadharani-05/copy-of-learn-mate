import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LucideIcon } from '../LucideIcon';
import { AnimatedSceneCanvas } from './AnimatedSceneCanvas';
import { generateAnimatedScenes } from '../../utils/animatedExplanationEngine';

/**
 * AnimatedExplanationPlayer
 * 
 * Cinematic 16:9 Animated Video Player
 * - True widescreen video container with cinema letterboxing & vignette
 * - 60FPS continuous motion graphics canvas
 * - In-video subtitles (Netflix / YouTube style)
 * - Chaptered timeline scrubber with smooth timecode (e.g., 00:14 / 00:45)
 * - Play/Pause, Previous/Next, Replay, Voice Narration toggle, Speed controls, Fullscreen
 * - Instant voice cancellation on close or pause
 */
export function AnimatedExplanationPlayer({ title, explanationText, onClose }) {
  // Generate structured scenes from explanation
  const scenes = useMemo(() => {
    return generateAnimatedScenes(explanationText, title);
  }, [explanationText, title]);

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

  // Compute duration for each scene based on narration word count
  const sceneDurations = useMemo(() => {
    return scenes.map((s) => {
      const words = (s.narration || "").split(" ").length;
      return Math.max(6, Math.round((words * 0.38) / playbackSpeed));
    });
  }, [scenes, playbackSpeed]);

  const totalVideoDuration = useMemo(() => {
    return sceneDurations.reduce((acc, curr) => acc + curr, 0);
  }, [sceneDurations]);

  // Compute accumulated start time for each scene
  const sceneStartTimes = useMemo(() => {
    const starts = [0];
    for (let i = 0; i < sceneDurations.length - 1; i++) {
      starts.push(starts[i] + sceneDurations[i]);
    }
    return starts;
  }, [sceneDurations]);

  const activeScene = scenes[currentSceneIndex] || scenes[0];

  // Stop active speech synthesis
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
      const utterance = new SpeechSynthesisUtterance(targetScene.narration);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;

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
      const durationMs = sceneDurations[sceneIndex] * 1000;
      fallbackTimerRef.current = setTimeout(() => {
        handleSceneEnd(sceneIndex);
      }, durationMs);
    }
  };

  const handleSceneEnd = (sceneIndex) => {
    if (sceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(sceneIndex + 1);
      setCurrentVideoTime(sceneStartTimes[sceneIndex + 1]);
    } else {
      setIsPlaying(false);
      setHasFinished(true);
      setCurrentVideoTime(totalVideoDuration);
    }
  };

  // Synchronize speech whenever currentSceneIndex, isPlaying, or playbackSpeed changes
  useEffect(() => {
    if (isPlaying) {
      playSceneNarration(currentSceneIndex);
    } else {
      stopSpeech();
    }

    return () => {
      stopSpeech();
    };
  }, [currentSceneIndex, isPlaying, isMuted, playbackSpeed]);

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
            return totalVideoDuration;
          }
          return next;
        });
      }, 100);
    }

    return () => {
      if (timeTickerRef.current) clearInterval(timeTickerRef.current);
    };
  }, [isPlaying, hasFinished, totalVideoDuration, playbackSpeed]);

  // Handle timeline seeking by clicking on scrubber
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = ratio * totalVideoDuration;

    // Find corresponding scene index
    let targetIndex = 0;
    for (let i = 0; i < sceneStartTimes.length; i++) {
      if (targetSeconds >= sceneStartTimes[i]) {
        targetIndex = i;
      }
    }

    setCurrentVideoTime(targetSeconds);
    setCurrentSceneIndex(targetIndex);
    setHasFinished(false);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (hasFinished) {
      handleReplay();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentSceneIndex < scenes.length - 1) {
      const nextIdx = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIdx);
      setCurrentVideoTime(sceneStartTimes[nextIdx]);
      setHasFinished(false);
    } else {
      setHasFinished(true);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      const prevIdx = currentSceneIndex - 1;
      setCurrentSceneIndex(prevIdx);
      setCurrentVideoTime(sceneStartTimes[prevIdx]);
      setHasFinished(false);
    }
  };

  const handleReplay = () => {
    stopSpeech();
    setCurrentVideoTime(0);
    setCurrentSceneIndex(0);
    setHasFinished(false);
    setIsPlaying(true);
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.warn("Fullscreen request failed", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
      setIsFullscreen(false);
    }
  };

  // Helper to format mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={playerContainerRef}
      className={`w-full bg-slate-950 border border-brand-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/10 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-0 flex flex-col justify-center bg-black' : 'p-4 md:p-6 space-y-4'
      }`}
    >
      {/* 1. CINEMA VIDEO VIEWPORT (16:9 Aspect Ratio) */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 group select-none">
        
        {/* 60FPS Continuous Motion Graphics Canvas Engine */}
        <AnimatedSceneCanvas scene={activeScene} isPlaying={isPlaying} speed={playbackSpeed} />

        {/* TOP VIDEO HUD OVERLAY */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-20 pointer-events-auto">
          <div className="flex items-center gap-3">
            {/* Live Animation Indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-[11px] font-bold tracking-wider uppercase shadow-lg">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>LIVE ANIMATED VIDEO</span>
            </div>

            {/* Quality Tag */}
            <span className="hidden sm:inline text-[10px] font-semibold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
              1080p HD • 60 FPS
            </span>

            {/* Current Chapter Badge */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span className="text-slate-500">•</span>
              <span className="text-brand-400 font-bold">Chapter {currentSceneIndex + 1}/{scenes.length}:</span>
              <span>{activeScene.title}</span>
            </div>
          </div>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-2 rounded-xl bg-black/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-all shadow-lg"
              title="Close Video Player"
            >
              <LucideIcon name="x" className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* BIG CENTER PLAY / PAUSE SPLASH OVERLAY */}
        {(!isPlaying || hasFinished) && (
          <div
            onClick={handleTogglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-25 cursor-pointer transition-opacity"
          >
            <div className="w-18 h-18 md:w-20 md:h-20 rounded-full bg-brand-600/95 hover:bg-brand-500 text-white flex items-center justify-center shadow-2xl shadow-brand-500/50 transform hover:scale-110 active:scale-95 transition-all">
              <LucideIcon name={hasFinished ? "rotate-ccw" : "play"} className="w-8 h-8 ml-1" />
            </div>
          </div>
        )}

        {/* IN-VIDEO SUBTITLES (Netflix / YouTube Style) */}
        <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center z-20 pointer-events-none">
          <div className="bg-black/85 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/15 shadow-2xl max-w-[90%] md:max-w-[80%] text-center transform transition-all duration-300 animate-fade-in">
            <p className="text-sm md:text-base lg:text-lg text-white font-medium leading-snug drop-shadow-md">
              "{activeScene.narration}"
            </p>
          </div>
        </div>

      </div>

      {/* 2. CINEMA TIMELINE SCRUBBER & CONTROLS BAR */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-xl">
        
        {/* Full-Width Chaptered Timeline Scrubber */}
        <div
          onClick={handleSeek}
          className="relative w-full h-3 bg-slate-800 hover:h-4 rounded-full cursor-pointer transition-all flex items-center group"
          title="Click to seek"
        >
          {/* Played Progress Bar */}
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400 rounded-full relative transition-all"
            style={{ width: `${Math.min(100, (currentVideoTime / totalVideoDuration) * 100)}%` }}
          >
            {/* Glowing Scrubber Head Dot */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md shadow-brand-500 scale-0 group-hover:scale-100 transition-transform" />
          </div>

          {/* Chapter Dividers along the scrubber */}
          {sceneStartTimes.map((startSec, idx) => {
            if (idx === 0) return null;
            const leftPercent = (startSec / totalVideoDuration) * 100;
            return (
              <div
                key={idx}
                className="absolute top-0 bottom-0 w-0.5 bg-black/60 pointer-events-none"
                style={{ left: `${leftPercent}%` }}
              />
            );
          })}
        </div>

        {/* Bottom Control Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Left Group: Play/Pause, Previous, Next, Timecode */}
          <div className="flex items-center gap-3">
            
            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20 active:scale-95 transition-all"
              title={isPlaying ? "Pause Video" : "Play Video"}
            >
              <LucideIcon name={hasFinished ? "rotate-ccw" : isPlaying ? "pause" : "play"} className="w-5 h-5" />
            </button>

            {/* Previous Scene Button */}
            <button
              onClick={handlePrev}
              disabled={currentSceneIndex === 0}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Previous Scene"
            >
              <LucideIcon name="skip-back" className="w-4 h-4" />
            </button>

            {/* Next Scene Button */}
            <button
              onClick={handleNext}
              disabled={currentSceneIndex === scenes.length - 1 && hasFinished}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Next Scene"
            >
              <LucideIcon name="skip-forward" className="w-4 h-4" />
            </button>

            {/* Timecode Display */}
            <div className="text-xs font-mono text-slate-300 font-semibold pl-2">
              <span className="text-white">{formatTime(currentVideoTime)}</span>
              <span className="text-slate-600 px-1">/</span>
              <span className="text-slate-400">{formatTime(totalVideoDuration)}</span>
            </div>
          </div>

          {/* Right Group: Speed Selector, Voice Narration Toggle, Fullscreen */}
          <div className="flex items-center gap-2.5">
            
            {/* Speed Selector (1x, 1.25x, 1.5x) */}
            <button
              onClick={() => {
                const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
                setPlaybackSpeed(nextSpeed);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold font-mono transition-all"
              title="Change Playback Speed"
            >
              {playbackSpeed}x
            </button>

            {/* Voice Narration Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isMuted
                  ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
              title={isMuted ? "Unmute Voice Narration" : "Mute Voice Narration"}
            >
              <LucideIcon name={isMuted ? "volume-x" : "volume-2"} className="w-4 h-4" />
              <span className="hidden sm:inline">{isMuted ? "Voice Off" : "Voice On"}</span>
            </button>

            {/* Replay from Start */}
            <button
              onClick={handleReplay}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              title="Replay Video from Start"
            >
              <LucideIcon name="rotate-ccw" className="w-4 h-4" />
            </button>

            {/* Fullscreen Mode */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Video"}
            >
              <LucideIcon name={isFullscreen ? "minimize" : "maximize"} className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AnimatedExplanationPlayer;
