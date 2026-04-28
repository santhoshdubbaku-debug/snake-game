import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  }, []);

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      skipForward();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [skipForward]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border-4 border-magenta-500 p-6 w-full relative">
      <audio ref={audioRef} src={currentTrack.url} />
      
      {/* Decorative Hardware Elements */}
      <div className="absolute top-2 right-2 flex gap-1">
        <div className="w-2 h-2 bg-red-500 animate-ping" />
        <div className="w-2 h-2 bg-yellow-500" />
        <div className="w-2 h-2 bg-green-500" />
      </div>

      {/* Meta Data */}
      <div className="mb-6 flex gap-4 items-start">
        <div className="relative w-24 h-24 border-2 border-cyan-500 shrink-0 overflow-hidden">
             <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className={`w-full h-full object-cover transition-all ${isPlaying ? 'hue-rotate-90 scale-110' : 'grayscale'}`}
            />
            {isPlaying && <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay animate-pulse" />}
        </div>
        
        <div className="flex flex-col overflow-hidden">
            <div className="text-[10px] text-zinc-500 bg-zinc-900 px-1 inline-block w-fit mb-1 font-bold">WAVE_SRC_0{currentTrack.id}</div>
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentTrack.id}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                >
                    <h3 className="text-2xl font-bold glitch-text text-magenta-400 leading-none mb-1 truncate">{currentTrack.title}</h3>
                    <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest truncate">{currentTrack.artist}</p>
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* Analyzer Simulation */}
      <div className="h-12 bg-zinc-900/50 mb-6 flex items-end gap-[1px] p-1 overflow-hidden border border-zinc-800">
        {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
                key={i}
                animate={{ height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 4 }}
                transition={{ duration: 0.2, repeat: Infinity, delay: i * 0.02 }}
                className="flex-1 bg-cyan-800"
            />
        ))}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleProgressChange}
          className="w-full h-4 bg-zinc-900 appearance-none cursor-pointer accent-magenta-500 border border-zinc-700"
        />
        <div className="flex justify-between mt-2 font-mono text-xs text-zinc-500 font-bold">
          <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> {formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={skipBackward}
          className="bg-zinc-900 border border-zinc-700 p-3 hover:bg-magenta-900/20 text-zinc-400 hover:text-magenta-400 transition-all flex justify-center"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button
          onClick={togglePlay}
          className={`p-3 font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isPlaying ? 'bg-red-600 text-white animate-pulse' : 'bg-cyan-500 text-black shadow-[4px_4px_0px_#f0f]'}`}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        
        <button 
          onClick={skipForward}
          className="bg-zinc-900 border border-zinc-700 p-3 hover:bg-magenta-900/20 text-zinc-400 hover:text-magenta-400 transition-all flex justify-center"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Signal Strength */}
      <div className="mt-6 flex items-center gap-4">
        <div className="flex-1 h-2 bg-zinc-900 border border-zinc-700 relative overflow-hidden">
            <motion.div 
                animate={{ x: isPlaying ? [0, 400] : 0 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-y-0 left-0 w-20 bg-magenta-500/30 skew-x-12"
            />
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="absolute inset-y-0 left-0 bg-cyan-500" style={{ width: `${volume * 100}%` }} />
        </div>
        <Volume2 className="w-4 h-4 text-cyan-800" />
      </div>
    </div>
  );
};
