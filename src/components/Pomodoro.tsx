"use client";

import { Coffee, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarTimerPomodoroProps {
  isCollapsed: boolean;
}

export default function SidebarTimerPomodoro({ isCollapsed }: SidebarTimerPomodoroProps) {
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const modeConfig = {
    work: {
      label: 'Focus',
      icon: Timer,
      duration: 25 * 60,
      color: 'purple',
      description: '25min work session'
    },
    short: {
      label: 'Break',
      icon: Coffee,
      duration: 15 * 60,
      color: 'green',
      description: '15min short break'
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
      button: 'bg-blue-500 hover:bg-blue-600',
      ring: 'ring-blue-500/30'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'bg-green-500',
      text: 'text-green-600 dark:text-green-400',
      button: 'bg-green-500 hover:bg-green-600',
      ring: 'ring-green-500/30'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'bg-purple-500',
      text: 'text-purple-600 dark:text-purple-400',
      button: 'bg-purple-500 hover:bg-purple-600',
      ring: 'ring-purple-500/30'
    }
  };

  const colors = colorClasses[currentConfig.color];

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }, []);

  // Beep sound function
  const playBeep = () => {
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
  };

  // Update seconds left when mode changes
  useEffect(() => {
    setSecondsLeft(currentConfig.duration);
  }, [mode, currentConfig.duration]);

  // Timer countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      handleComplete();
    }
    
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const handleComplete = () => {
    playBeep();
    
    if (mode === 'work') {
      setSessionsCompleted(prev => prev + 1);
      const nextMode = sessionsCompleted % 4 === 3 ? 'long' : 'short';
      setMode(nextMode);
    } else {
      setMode('work');
    }
  };

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

  const handleModeChange = (newMode: 'work' | 'short' | 'long') => {
    setMode(newMode);
    setIsRunning(false);
  };

  // Progress calculation
  const progress = ((currentConfig.duration - secondsLeft) / currentConfig.duration) * 100;

  // Collapsed view - minimal icon display
  if (isCollapsed) {
    return (
      <div className="flex justify-center py-2">
        <motion.div
          className={`relative w-10 h-10 rounded-lg ${colors.icon} flex items-center justify-center shadow-lg ${isRunning ? `ring-2 ${colors.ring}` : ''}`}
          animate={{
            scale: isRunning ? [1, 1.1, 1] : 1,
            opacity: secondsLeft <= 10 && isRunning ? [1, 0.5, 1] : 1
          }}
          transition={{
            scale: { repeat: isRunning ? Infinity : 0, duration: 2 },
            opacity: { repeat: secondsLeft <= 10 && isRunning ? Infinity : 0, duration: 1 }
          }}
          title={`${currentConfig.label}: ${formatTime(secondsLeft)}`}
        >
          <Icon className="w-4 h-4 text-white" />
          {/* Tiny progress indicator */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {/* Session counter dot */}
          {sessionsCompleted > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">{sessionsCompleted}</span>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Expanded view - full timer display
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 w-full p-4 rounded-xl"
      >
        <div className={`${colors.bg} border ${colors.border} rounded-lg p-3`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 ${colors.icon} rounded-md flex items-center justify-center`}>
                <Icon className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {currentConfig.label}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              #{sessionsCompleted}
            </span>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-3">
            <motion.div 
              className={`inline-flex text-2xl font-bold font-mono ${colors.text}`}
              animate={{ 
                color: secondsLeft <= 10 && isRunning ? '#ef4444' : undefined,
                scale: secondsLeft <= 10 && isRunning ? [1, 1.05, 1] : 1 
              }}
              transition={{ repeat: secondsLeft <= 10 && isRunning ? Infinity : 0, duration: 1 }}
            >
              {formatTime(secondsLeft)}
            </motion.div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {currentConfig.description}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
            <motion.div 
              className={`h-1.5 rounded-full ${colors.icon} transition-all duration-1000 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mb-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 ${colors.button} text-white rounded-lg transition-colors text-xs font-medium`}
              >
                <Play className="w-3 h-3" />
                Start
              </button>
            ) : (
              <button
                onClick={handlePause}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 ${colors.button} text-white rounded-lg transition-colors text-xs font-medium`}
              >
                <Pause className="w-3 h-3" />
                Pause
              </button>
            )}
            <button
              onClick={handleReset}
              className="p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Mode Switch */}
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            {(['work', 'short'] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`flex-1 px-2 py-1 cursor-pointer text-xs font-medium rounded-md transition-colors ${
                  mode === m
                    ? `${colorClasses[modeConfig[m].color].button} text-white`
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                {modeConfig[m].label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
