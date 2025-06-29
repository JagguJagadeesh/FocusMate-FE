'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Clock, RefreshCw, Play, Pause } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const Pomodoro = () => {
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work')
  const [durations, setDurations] = useState({ work: 25, short: 5, long: 15 })
  const [secondsLeft, setSecondsLeft] = useState(durations.work * 60)
  const [isRunning, setIsRunning] = useState(false)

  const audio = typeof Audio !== 'undefined' ? new Audio('/sounds/done.wav') : null

  useEffect(() => {
    setSecondsLeft(durations[mode] * 60)
  }, [mode, durations])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000)
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false)

      // ✅ Play sound
      audio?.play()

      // ✅ Show toast
      toast.success(`${mode === 'work' ? 'Focus' : 'Break'} session completed!`, {
        description: "Well done! Take a break or start the next session.",
        duration: 5000
      })
    }
    return () => clearInterval(timer)
  }, [isRunning, secondsLeft])

  const formatTime = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-lg bg-gradient-to-br from-blue-100 to-violet-200 dark:from-zinc-800 dark:to-zinc-900">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Clock /> Focus Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col items-center justify-center gap-6 pt-6">
            <motion.div
              className="text-6xl font-bold text-zinc-800 dark:text-zinc-100"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {formatTime(secondsLeft)}
            </motion.div>

            <div className="flex gap-4">
              <Button onClick={() => setIsRunning(prev => !prev)} className="bg-green-600 hover:bg-green-700 text-white">
                {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button variant="outline" onClick={() => setSecondsLeft(durations[mode] * 60)}>
                <RefreshCw className="mr-2" /> Reset
              </Button>
            </div>

            <div className="flex gap-2 mt-4">
              {['work', 'short', 'long'].map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? 'default' : 'ghost'}
                  onClick={() => {
                    setMode(m as any)
                    setIsRunning(false)
                  }}
                >
                  {m === 'work' ? 'Focus' : m === 'short' ? 'Break' : 'Long Break'}
                </Button>
              ))}
            </div>

            <div className="w-full mt-6 space-y-4">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">Focus Duration: {durations.work} min</p>
                <Slider
                  min={15}
                  max={60}
                  step={1}
                  value={[durations.work]}
                  onValueChange={([val]) => setDurations(prev => ({ ...prev, work: val }))}
                />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">Short Break: {durations.short} min</p>
                <Slider
                  min={3}
                  max={15}
                  step={1}
                  value={[durations.short]}
                  onValueChange={([val]) => setDurations(prev => ({ ...prev, short: val }))}
                />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">Long Break: {durations.long} min</p>
                <Slider
                  min={10}
                  max={30}
                  step={1}
                  value={[durations.long]}
                  onValueChange={([val]) => setDurations(prev => ({ ...prev, long: val }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Pomodoro
