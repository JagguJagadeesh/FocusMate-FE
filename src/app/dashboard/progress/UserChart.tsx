'use client'

import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axiosInstence'
import useUserStore from '@/stores/useUserStore'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2, Clock, CheckCircle2 } from 'lucide-react'

export default function TaskSummaryCards() {
  const { user, taskStats, setTaskStats } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.post('/get-task-stats', { userID: user.id });
        setTaskStats({
          completed: res.data.completed,
          pending: res.data.pending
        });
      } catch (err) {
        console.error("Error fetching task stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user.id) fetchStats();
  }, [user.id]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl mx-auto">
      {/* Pending Tasks Card */}
      <Card className="w-full shadow-md">
        <CardHeader className="flex items-center gap-3">
          <Clock className="text-yellow-500" size={28} />
          <CardTitle className="text-lg">Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin text-yellow-500" />
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-5xl font-bold text-yellow-600">{taskStats.pending}</p>
              <p className="text-zinc-500 text-sm mt-2">To be completed</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks Card */}
      <Card className="w-full shadow-md">
        <CardHeader className="flex items-center gap-3">
          <CheckCircle2 className="text-green-600" size={28} />
          <CardTitle className="text-lg">Completed Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin text-green-500" />
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-5xl font-bold text-green-600">{taskStats.completed}</p>
              <p className="text-zinc-500 text-sm mt-2">Successfully done</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
