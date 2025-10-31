"use client";

import { Coffee, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface SidebarTimerPomodoroProps {
  isCollapsed: boolean;
}

type TimerMode = 'work' | 'short' | 'long';

interface ModeConfig {
  label: string;
  icon: typeof Timer;
  duration: number;
  color: 'purple' | 'green' | 'blue';
  description: string;
}

export default function SidebarTimerPomodoro({ isCollapsed }: SidebarTimerPomodoroProps) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const modeConfig: Record<TimerMode, ModeConfig> = {
    work: {
      label: 'Focus',
      icon: Timer,
      duration: 25 * 60,
      color: 'purple',
      description: '25min work session'
    },
    short: {
      label: 'Short Break',
      icon: Coffee,
      duration: 5 * 60,
      color: 'green',
      description: '5min break'
    },
    long: {
      label: 'Long Break',
      icon: Coffee,
      duration: 15 * 60,
      color: 'blue',
      description: '15min break'
    }
  };

  const currentConfig = modeConfig[mode];
  const Icon = currentConfig.icon;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      button: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
      ring: 'ring-blue-500/30'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'bg-green-500',
      text: 'text-green-600 dark:text-green-400',
      button: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
      ring: 'ring-green-500/30'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'bg-purple-500',
      text: 'text-purple-600 dark:text-purple-400',
      button: 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700',
      ring: 'ring-purple-500/30'
    }
  };

  const colors = colorClasses[currentConfig.color];

  // Initialize audio context on user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  // Play completion beep with error handling
  const playBeep = useCallback(() => {
    try {
      if (!audioContextRef.current) return;

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.5);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }, []);

  // Handle timer completion
  const handleComplete = useCallback(() => {
    playBeep();
    toast.success(`${mode} time is completed!`)
    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'work' ? 'Time for a break!' : 'Back to work!',
        icon: '/timer-icon.png',
        badge: '/timer-badge.png'
      });
    }

    if (mode === 'work') {
      const newSessionCount = sessionsCompleted + 1;
      setSessionsCompleted(newSessionCount);
      // Every 4 work sessions, take a long break
      const nextMode = newSessionCount % 4 === 0 ? 'long' : 'short';
      setMode(nextMode);
    } else {
      setMode('work');
    }
  }, [mode, sessionsCompleted, playBeep]);

  // Update seconds when mode changes
  useEffect(() => {
    setSecondsLeft(currentConfig.duration);
    setIsRunning(false);
  }, [mode, currentConfig.duration]);

  // Timer countdown with cleanup
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

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, secondsLeft, handleComplete]);

  // Persist state to localStorage
  useEffect(() => {
    const state = { mode, sessionsCompleted, secondsLeft, isRunning };
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }, [mode, sessionsCompleted, secondsLeft, isRunning]);

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      try {
        const { mode: savedMode, sessionsCompleted: savedSessions } = JSON.parse(savedState);
        setMode(savedMode);
        setSessionsCompleted(savedSessions);
      } catch (e) {
        console.error('Failed to restore timer state:', e);
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(prev => !prev);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setSecondsLeft(currentConfig.duration);
    setIsRunning(false);
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
  };

  const progress = ((currentConfig.duration - secondsLeft) / currentConfig.duration) * 100;
  const isLowTime = secondsLeft <= 60 && isRunning;

  // Collapsed view - minimal display
  if (isCollapsed) {
    return (
      <motion.div
        className="flex justify-center py-2 px-1"
        whileHover={{ scale: 1.05 }}
      >
        <motion.button
          onClick={() => setIsRunning(!isRunning)}
          className={`relative w-11 h-11 rounded-lg ${colors.icon} flex flex-col items-center justify-center shadow-lg transition-all ${isRunning ? `ring-2 ${colors.ring}` : ''
            }`}
          animate={{
            scale: isRunning ? [1, 1.08, 1] : 1,
            opacity: isLowTime ? [1, 0.6, 1] : 1
          }}
          transition={{
            scale: { repeat: isRunning ? Infinity : 0, duration: 2 },
            opacity: { repeat: isLowTime ? Infinity : 0, duration: 1 }
          }}
          title={`${currentConfig.label}: ${formatTime(secondsLeft)} - Click to ${isRunning ? 'pause' : 'start'}`}
          aria-label={`Timer: ${formatTime(secondsLeft)}`}
        >
          <span className="text-[10px] font-bold text-white/90 leading-tight">
            {formatTime(secondsLeft)}
          </span>

          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
            <motion.circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - progress / 100) }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Session badge */}
          {sessionsCompleted > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800"
            >
              <span className="text-[9px] text-white font-bold">{sessionsCompleted}</span>
            </motion.div>
          )}
        </motion.button>
      </motion.div>
    );
  }

  // Expanded view - full interface
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="w-full px-2 py-3"
      >
        <div className={`${colors.bg} border ${colors.border} rounded-xl p-2 shadow-sm`}>

          {/* Header with icon and session count */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <motion.div
                className={`w-8 h-8 ${colors.icon} rounded-lg flex items-center justify-center shadow-sm`}
                animate={{ rotate: isRunning ? 360 : 0 }}
                transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: "linear" }}
              >
                <Icon className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {currentConfig.label}
                </h3>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {/* Radial Glow Progress */}
          <div className="mb-4 relative flex justify-center">
            <div className="relative w-20 h-20">
              {/* Glow effect */}
              <motion.div
                className={`absolute inset-0 ${colors.icon} rounded-full filter blur-lg opacity-50`}
                animate={{ scale: isRunning ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: isRunning ? Infinity : 0, duration: 2 }}
              />

              {/* Progress circle */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="rgb(229 231 235)"
                  strokeWidth="6"
                  className="dark:stroke-gray-700"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  animate={{ strokeDashoffset: 2 * Math.PI * 35 * (1 - progress / 100) }}
                  transition={{ duration: 0.5 }}
                  className={colors.text}
                />
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold font-mono dark:text-white `}>
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>


          {/* Controls */}
          <div className="flex items-center gap-2 mb-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isRunning ? handlePause : handleStart}
              className={`flex-1 flex items-center justify-center gap-2 cursor-pointer px-4 py-2.5 ${colors.button} text-white rounded-lg transition-colors text-xs font-medium shadow-sm`}
              aria-label={isRunning ? 'Pause timer' : 'Start timer'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="p-2.5 cursor-pointer border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              title="Reset timer (R)"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-4 h-3" />
            </motion.button>
          </div>

          {/* Mode switcher */}
          <div className="grid grid-cols-3 gap-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
            {(['work', 'short', 'long'] as const).map((m) => (
              <motion.button
                key={m}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModeChange(m)}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all ${mode === m
                  ? `${colorClasses[modeConfig[m].color].button} text-white shadow-sm`
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                aria-label={`Switch to ${modeConfig[m].label}`}
                aria-pressed={mode === m}
              >
                {modeConfig[m].label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
