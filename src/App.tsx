import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Activity, Radio, Cpu, Hash } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative font-sans overflow-hidden">
      {/* Background Static Overlay */}
      <div className="fixed inset-0 static-bg -z-20" />
      <div className="fixed inset-0 crt-overlay pointer-events-none -z-10" />
      <div className="fixed inset-0 crt-scanline" />
      
      {/* Header section */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 z-10">
        <div className="flex flex-col">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter glitch-text text-white"
          >
            S_N_A_K_E.EXE
          </motion.h1>
          <div className="flex items-center gap-2 text-magenta-500 text-lg uppercase tracking-[0.4em] font-bold">
            <Cpu className="w-5 h-5" />
            KERNEL_VERSION_0.9.8b
          </div>
        </div>

        <div className="flex flex-col items-end glitch-border p-4 bg-black/80 min-w-[200px]">
          <span className="text-sm text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <Hash className="w-4 h-4" />
            VALUE_ACCUMULATED
          </span>
          <motion.span 
            key={score}
            animate={{ scale: [1, 1.1, 1] }}
            className="text-5xl font-bold text-magenta-500"
          >
            {score.toString().padStart(8, '0')}
          </motion.span>
        </div>
      </header>

      {/* Main interface */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start z-10">
        
        {/* Visual module */}
        <section className="flex flex-col items-center glitch-border p-2 bg-black relative">
          <div className="absolute -top-3 -left-3 bg-cyan-500 text-black px-2 py-0.5 text-xs font-bold uppercase">
            PRIMARY_VISUAL_FEED
          </div>
          <SnakeGame onScoreUpdate={setScore} />
          
          <div className="w-full mt-4 p-4 border-t-2 border-cyan-500/30 flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-cyan-500 text-black font-bold text-sm">[W][A][S][D]</span>
              <span className="text-xs uppercase text-zinc-400">VECTOR_CONTROL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-magenta-500 text-black font-bold text-sm">[SPACE]</span>
              <span className="text-xs uppercase text-zinc-400">STATE_SUSPEND</span>
            </div>
          </div>
        </section>

        {/* Audio architecture */}
        <aside className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">AUDIO_RECONSTRUCTOR</span>
          </div>
          
          <MusicPlayer />
          
          <div className="glitch-border p-4 bg-black/90 relative overflow-hidden">
             <div className="absolute -top-3 -left-3 bg-magenta-500 text-black px-2 py-0.5 text-xs font-bold uppercase">
              STATUS_LOG
            </div>
            <div className="flex items-center gap-2 text-zinc-500 mb-2 mt-2">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest">FEEDBACK_LOOP</span>
            </div>
            <p className="text-sm text-cyan-700 font-mono leading-none flex flex-col gap-1">
              <span>&gt; AUTHENTICATING... SUCCESS.</span>
              <span>&gt; LOADING WAVE_TABLES... DONE.</span>
              <span className="animate-pulse">&gt; ANALYZING NEURAL_SYNC... 98%</span>
              <span className="text-magenta-800">&gt; WARNING: PARITY_ERROR_DETECTED</span>
              <span>&gt; OVERRIDING...</span>
            </p>
          </div>
        </aside>

      </main>

      {/* Terminal Footer */}
      <footer className="mt-12 w-full max-w-6xl py-4 border-t-2 border-zinc-800 flex justify-between items-center text-xs opacity-60">
        <div className="flex gap-4">
          <span className="text-cyan-500">© 1989-2026 OMNI_CORP</span>
          <span className="text-magenta-500">ENCRYPTION: AES-4096KV</span>
        </div>
        <div className="text-zinc-600 animate-flicker">
          CONNECTION_STATUS: SECURE_STATIC_ESTABLISHED
        </div>
      </footer>
    </div>
  );
}
