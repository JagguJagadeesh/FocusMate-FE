"use client";

import { Coffee, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface SidebarTimerPomodoroProps {
  isCollapsed: boolean;
}

type TimerMode = 'work' | 'short' | 'long';

export default function SidebarTimerPomodoro({ isCollapsed }: SidebarTimerPomodoroProps) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const modeConfig = {
    work: { label: 'Focus', duration: 25 * 60, color: 'from-blue-500 to-blue-600', icon: Timer },
    short: { label: 'Break', duration: 5 * 60, color: 'from-emerald-500 to-emerald-600', icon: Coffee },
    long: { label: 'Long', duration: 15 * 60, color: 'from-violet-500 to-violet-600', icon: Coffee }
  };

  const currentConfig = modeConfig[mode];
  const Icon = currentConfig.icon;

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const playBeep = useCallback(() => {
    try {
      if (!audioContextRef.current) return;
      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();
      osc.connect(gain);
      gain.connect(audioContextRef.current.destination);
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);
      osc.start(audioContextRef.current.currentTime);
      osc.stop(audioContextRef.current.currentTime + 0.5);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }, []);

  const handleComplete = useCallback(() => {
    playBeep();
    toast.success(`${currentConfig.label} completed!`);
    if (mode === 'work') {
      const newCount = sessionsCompleted + 1;
      setSessionsCompleted(newCount);
      setMode(newCount % 4 === 0 ? 'long' : 'short');
    } else {
      setMode('work');
    }
  }, [mode, sessionsCompleted, playBeep, currentConfig.label]);

  useEffect(() => {
    setSecondsLeft(currentConfig.duration);
    setIsRunning(false);
  }, [mode, currentConfig.duration]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, secondsLeft, handleComplete]);

  useEffect(() => {
    localStorage.setItem('pomodoroState', JSON.stringify({ mode, sessionsCompleted }));
  }, [mode, sessionsCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = ((currentConfig.duration - secondsLeft) / currentConfig.duration) * 100;

  if (isCollapsed) {
    const isLowTime = secondsLeft <= 60 && isRunning;

    return (
      <motion.button
        onClick={() => setIsRunning(!isRunning)}
        className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${currentConfig.color} text-white font-black shadow-xl flex flex-col items-center justify-center relative overflow-hidden group`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/10"
          animate={{ opacity: isRunning ? [0.2, 0.4, 0.2] : 0.2 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Pulse border when running */}
        {isRunning && (
          <motion.div
            className="absolute inset-0 border-2 border-white/60 rounded-2xl"
            animate={{ scale: [1, 1.15], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          {/* Rotating icon */}
          <motion.div
            animate={{
              rotate: isRunning ? 360 : 0,
              scale: isLowTime ? [1, 1.2, 1] : 1
            }}
            transition={{
              rotate: { duration: 2.5, repeat: isRunning ? Infinity : 0, ease: "linear" },
              scale: { duration: 0.6, repeat: isLowTime ? Infinity : 0 }
            }}
          >
            <Icon className="w-4 h-4" />
          </motion.div>

          {/* Small badge */}
          {sessionsCompleted > 0 && (
            <motion.span
              className="text-[9px] font-black"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ⚡{sessionsCompleted}
            </motion.span>
          )}
        </div>

        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            strokeLinecap="round"
            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
            transition={{ duration: 0.5 }}
            opacity="0.3"
          />
        </svg>

        {/* Low time warning */}
        {isLowTime && (
          <motion.div
            className="absolute inset-0 bg-red-500/20 rounded-2xl"
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
        )}
      </motion.button>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 px-2 py-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {currentConfig.label}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {sessionsCompleted}
        </span>
      </div>

      {/* Time */}
      <div className="text-center py-2">
        <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white">
          {formatTime(secondsLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${currentConfig.color}`}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <motion.button
          onClick={isRunning ? () => setIsRunning(false) : () => setIsRunning(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-2 rounded-lg bg-gradient-to-r ${currentConfig.color} text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isRunning ? 'Pause' : 'Start'}
        </motion.button>
        <motion.button
          onClick={() => {
            setSecondsLeft(currentConfig.duration);
            setIsRunning(false);
          }}
          whileHover={{ scale: 1.05 }}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>

      {/* Mode buttons */}
      <div className="grid grid-cols-3 gap-1">
        {(['work', 'short', 'long'] as const).map((m) => (
          <motion.button
            key={m}
            onClick={() => {
              setMode(m);
              setIsRunning(false);
            }}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === m
                ? `bg-gradient-to-r ${modeConfig[m].color} text-white shadow-sm`
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            whileHover={{ scale: 1.02 }}
          >
            {modeConfig[m].label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
