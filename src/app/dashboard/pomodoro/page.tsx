'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  RefreshCw,
  Play,
  Pause,
  Settings,
  BarChart3,
  Target,
  Volume2,
  VolumeX,
  Coffee,
  Brain,
  Timer,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Pomodoro = () => {
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work')
  const [durations, setDurations] = useState({ work: 25, short: 5, long: 15 })
  const [secondsLeft, setSecondsLeft] = useState(durations.work * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [todaysFocus, setTodaysFocus] = useState(0) // in minutes
  const [currentStreak, setCurrentStreak] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoStartBreaks, setAutoStartBreaks] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const audio = typeof Audio !== 'undefined' ? new Audio('/sounds/done.wav') : null

  // Calculate progress percentage
  const totalSeconds = durations[mode] * 60
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100

  // Calculate circular progress
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  useEffect(() => {
    setSecondsLeft(durations[mode] * 60)
  }, [mode, durations])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000)
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false)
      handleSessionComplete()
    }
    return () => clearInterval(timer)
  }, [isRunning, secondsLeft])

  const handleSessionComplete = () => {
    // Play sound if enabled
    if (soundEnabled) {
      audio?.play()
    }

    // Update statistics
    if (mode === 'work') {
      setSessionsCompleted(prev => prev + 1)
      setTodaysFocus(prev => prev + durations.work)
      setCurrentStreak(prev => prev + 1)
    }

    // Show completion notification
    toast.success(`${mode === 'work' ? 'Focus' : 'Break'} session completed!`, {
      description: `Great job! You've completed a ${durations[mode]}-minute ${mode === 'work' ? 'focus' : 'break'} session.`,
      duration: 5000
    })

    // Auto-start next session if enabled
    if (autoStartBreaks) {
      setTimeout(() => {
        if (mode === 'work') {
          setMode(sessionsCompleted % 4 === 3 ? 'long' : 'short')
        } else {
          setMode('work')
        }
        setIsRunning(true)
      }, 3000)
    }
  }

  const formatTime = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`

  const resetTimer = () => {
    setSecondsLeft(durations[mode] * 60)
    setIsRunning(false)
  }

  const modeConfig = {
    work: {
      label: 'Focus Time',
      icon: <Brain className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30'
    },
    short: {
      label: 'Short Break',
      icon: <Coffee className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30'
    },
    long: {
      label: 'Long Break',
      icon: <Coffee className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30'
    }
  }

  return (
    <div className="w-full min-h-screen max-w-6xl mx-auto p-6 space-y-8">
      {/* Main Timer Section */}
      <div className="grid grid-cols-1 h-[calc(100vh-200px)] lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Timer Card */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className={`h-full shadow-2xl bg-gradient-to-br ${modeConfig[mode].bgColor} border-0 overflow-hidden relative`}>
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

          <CardHeader className="relative z-10 text-center pb-3">
            <CardTitle className="text-xl font-bold flex items-center justify-center gap-2 text-gray-900 dark:text-white">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${modeConfig[mode].color} text-white shadow-lg`}>
                {modeConfig[mode].icon}
              </div>
              {modeConfig[mode].label}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {mode === 'work' ? 'Stay focused and productive' : 'Take a well-deserved break'}
            </p>
          </CardHeader>

          <CardContent className="relative z-10 flex flex-col items-center justify-center gap-4 pb-4">
            {/* Compact Circular Progress Timer */}
            <div className="relative w-60 h-60">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 244 244">
                {/* Background circle */}
                <circle
                  cx="122"
                  cy="122"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="122"
                  cy="122"
                  r="100"
                  stroke="url(#gradient)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 100}
                  strokeDashoffset={2 * Math.PI * 100 - (progress / 100) * 2 * Math.PI * 100}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={mode === 'work' ? '#3b82f6' : mode === 'short' ? '#10b981' : '#8b5cf6'} />
                    <stop offset="100%" stopColor={mode === 'work' ? '#06b6d4' : mode === 'short' ? '#059669' : '#d946ef'} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Timer Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="text-4xl font-bold text-gray-900 dark:text-white mb-1"
                  animate={{
                    scale: isRunning && secondsLeft <= 10 ? [1, 1.1, 1] : 1,
                    color: secondsLeft <= 10 ? ['#000', '#ef4444', '#000'] : '#000'
                  }}
                  transition={{
                    repeat: isRunning && secondsLeft <= 10 ? Infinity : 0,
                    duration: 1
                  }}
                >
                  {formatTime(secondsLeft)}
                </motion.div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {Math.round(progress)}% Complete
                </div>
              </div>
            </div>

            {/* Compact Control Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsRunning(prev => !prev)}
                size="default"
                className={`h-11 px-6 text-base font-semibold bg-gradient-to-r ${modeConfig[mode].color} hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white rounded-xl shadow-lg group`}
              >
                {isRunning ? (
                  <>
                    <Pause className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    Start
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="default"
                onClick={resetTimer}
                className="h-11 px-4 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 group"
              >
                <RefreshCw className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Reset
              </Button>

              {/* Settings Button */}
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="default"
                    className="h-11 px-4 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 group"
                  >
                    <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-sm max-h-[80vh] overflow-y-auto rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-3">
                    {/* Duration Settings */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-medium mb-1 block">Focus: {durations.work}m</Label>
                        <Slider
                          min={15}
                          max={60}
                          step={5}
                          value={[durations.work]}
                          onValueChange={([val]) => setDurations(prev => ({ ...prev, work: val }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium mb-1 block">Short Break: {durations.short}m</Label>
                        <Slider
                          min={3}
                          max={15}
                          step={1}
                          value={[durations.short]}
                          onValueChange={([val]) => setDurations(prev => ({ ...prev, short: val }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium mb-1 block">Long Break: {durations.long}m</Label>
                        <Slider
                          min={10}
                          max={30}
                          step={5}
                          value={[durations.long]}
                          onValueChange={([val]) => setDurations(prev => ({ ...prev, long: val }))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Preference Settings */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                          <Label htmlFor="sound" className="text-xs font-medium">Sound</Label>
                        </div>
                        <Switch
                          id="sound"
                          checked={soundEnabled}
                          onCheckedChange={setSoundEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Timer className="w-3 h-3" />
                          <Label htmlFor="autostart" className="text-xs font-medium">Auto-start</Label>
                        </div>
                        <Switch
                          id="autostart"
                          checked={autoStartBreaks}
                          onCheckedChange={setAutoStartBreaks}
                        />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Compact Mode Selection */}
            <div className="flex gap-1 bg-white/50 dark:bg-gray-800/50 rounded-xl p-1 backdrop-blur-sm">
              {(['work', 'short', 'long'] as const).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setMode(m)
                    setIsRunning(false)
                  }}
                  className={`rounded-lg transition-all duration-300 text-xs ${mode === m
                      ? `bg-gradient-to-r ${modeConfig[m].color} text-white shadow-lg`
                      : 'hover:bg-white/70 dark:hover:bg-gray-700/70'
                    }`}
                >
                  {modeConfig[m].icon}
                  <span className="ml-1 hidden sm:inline">
                    {m === 'work' ? 'Focus' : m === 'short' ? 'Break' : 'Long'}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Compact Side Panel */}
      <motion.div
        className="space-y-4 overflow-y-auto max-h-full lg:col-span-1"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Quick Tips */}
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Focus on one task completely
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Take breaks away from desk
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Long break after 4 sessions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Session History */}
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Focus Goal</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">2 hours</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (todaysFocus / 120) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{todaysFocus}m done</span>
                <span>{Math.max(0, 120 - todaysFocus)}m left</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-semibold mb-1">
                {'"'}Focus is the ultimate power.{'"'}
              </p>
              <p className="text-xs opacity-80">- FocusMate</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>

    </div >
  )
}

export default Pomodoro
