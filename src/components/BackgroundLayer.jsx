import React, { useEffect, useState } from 'react';
import gardenImage from '../assets/garden.jpg';
import libraryImage from '../assets/library.jpg';
import homeImage from '../assets/home.jpg';
import restaurantImage from '../assets/restaurant.jpg';

export function BackgroundLayer({ profile }) {
  const [particles, setParticles] = useState([]);
  
  const placeImages = {
    garden: gardenImage,
    library: libraryImage,
    home: homeImage,
    restaurant: restaurantImage
  };

  const placeOverlays = {
    garden: 'bg-emerald-950/15 backdrop-blur-[1px]',
    library: 'bg-slate-950/45 backdrop-blur-[2px] bg-gradient-to-t from-slate-950/65 to-slate-950/30',
    home: 'bg-slate-950/35 backdrop-blur-[2px] bg-gradient-to-tr from-brand-950/10 via-slate-950/30 to-transparent',
    restaurant: 'bg-stone-950/50 backdrop-blur-[2px]'
  };

  const env = profile?.environment || '';
  const act = profile?.activity || 'reading';

  const [bgState, setBgState] = useState({
    current: placeImages[env] || '',
    previous: '',
    fade: false
  });

  // Dynamic particles load
  useEffect(() => {
    if (!profile) return;

    let count = 8;
    if (env === 'garden') count = 12;
    if (env === 'restaurant') count = 10;

    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${10 + Math.random() * 10}s`,
      size: `${6 + Math.random() * 12}px`
    }));
    setParticles(newParticles);
  }, [env, act]);

  // Dynamic background image cross-fade handler
  useEffect(() => {
    const nextBg = placeImages[env] || '';
    if (nextBg !== bgState.current) {
      setBgState(prev => ({
        current: nextBg,
        previous: prev.current,
        fade: true
      }));

      // Let browser register opacity-0 state, then trigger fade in transition
      const timer = setTimeout(() => {
        setBgState(prev => ({
          ...prev,
          fade: false
        }));
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [env]);

  if (!profile) return null;

  const overlayClass = placeOverlays[env] || 'bg-slate-950/10';

  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden select-none transition-all duration-700 bg-slate-950 bg-mesh">
      
      {/* 1. Underlayer (Previous Background for cross-fade) */}
      {bgState.previous && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ backgroundImage: `url(${bgState.previous})` }}
        />
      )}

      {/* 2. Top layer (Current Background with opacity transition) */}
      {bgState.current && (
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${bgState.fade ? 'opacity-0' : 'opacity-100'}`}
          style={{ backgroundImage: `url(${bgState.current})` }}
        />
      )}

      {/* 3. Reading Overlay / Blur to preserve text readability */}
      <div className={`absolute inset-0 transition-all duration-1000 ${overlayClass}`} />

      {/* 4. Activity Accents */}
      {act === 'music' && (
        <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-between px-10 opacity-[0.06] text-brand-400">
          {Array.from({ length: 24 }).map((_, idx) => (
            <div 
              key={idx}
              className="w-1.5 bg-current rounded-t-full animate-waveform"
              style={{ 
                height: `${30 + Math.random() * 60}%`,
                animationDelay: `${idx * 0.15}s`
              }}
            />
          ))}
        </div>
      )}

      {act === 'dancing' && (
        <svg className="absolute inset-0 w-full h-full text-brand-500/5" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M-10,30 C30,70 70,-10 110,60" />
          <path d="M-10,40 C40,90 60,10 110,80" />
        </svg>
      )}

      {act === 'playing' && (
        <svg className="absolute top-20 right-20 w-48 h-48 text-brand-500/5" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="15" y="30" width="70" height="40" rx="20" />
          <circle cx="35" cy="50" r="8" />
          <circle cx="65" cy="50" r="8" />
        </svg>
      )}

      {act === 'reading' && (
        <>
          <div className="absolute inset-y-0 left-[8%] w-[1px] bg-slate-900/20" />
          <div className="absolute inset-y-0 left-[8.5%] w-[1px] bg-red-900/10" />
        </>
      )}

      {/* 5. Floating Interactive Particles */}
      {particles.map((p) => {
        let pColor = 'bg-brand-400/20';
        if (env === 'garden') pColor = 'bg-emerald-400/25';
        if (env === 'restaurant') pColor = 'bg-amber-400/25';
        
        return (
          <div
            key={p.id}
            className={`absolute bottom-0 rounded-full animate-float-particle ${pColor}`}
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
            }}
          />
        );
      })}

    </div>
  );
}

export default BackgroundLayer;
