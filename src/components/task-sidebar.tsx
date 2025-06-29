'use client'

import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axiosInstence'
import useUserStore from '@/stores/useUserStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {  Loader2 } from 'lucide-react'
import Link from 'next/link'

type Task = {
    id: string
    title: string
    start: string
    category: string
}

export default function TaskSidebar() {
    const { user } = useUserStore()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user.id) return;

        const fetchTasks = async () => {
            try {
                const res = await axiosInstance.post('/getalltasks', { userID: user.id });

                // Sort tasks by newest date first
                const sorted = (res.data.tasks || []).sort(
                    (a: { start: string | number | Date }, b: { start: string | number | Date }) => new Date(b.start).getTime() - new Date(a.start).getTime()
                );

                setTasks(sorted);
            } catch (e) {
                console.error('Failed to fetch tasks', e);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user.id]);

    return (
        <div className="mt-1 px-3">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                My Tasks
            </h3>

            <ScrollArea className="h-[180px] pr-2 rounded-md border border-muted bg-muted/30">
                <div className="px-1">
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="animate-spin text-muted" size={20} />
                        </div>
                    ) : tasks.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No tasks found.</p>
                    ) : (
                        <ul className="space-y-2 py-2 pr-1">
                            {tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className={`flex justify-between items-start gap-2 bg-background hover:bg-accent rounded-md p-3 border-l-4 ${task.category === 'work'
                                        ? 'border-blue-500'
                                        : task.category === 'personal'
                                            ? 'border-green-500'
                                            : task.category === 'urgent' ? 'border-red-500': 'border-zinc-400'
                                        } transition-all text-sm`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground break-words">{task.title}</span>
                                        <span
                                            className="text-xs text-muted-foreground mt-1 flex flex-col"
                                            title={new Date(task.start).toLocaleString()}
                                        >
                                            <span>{new Date(task.start).toLocaleDateString()}</span>
                                            <span>{new Date(task.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </span>
                                    </div>

                                    <Badge
                                        variant="secondary"
                                        className="text-[10px] capitalize mt-1 whitespace-nowrap"
                                    >
                                        {task.category}
                                    </Badge>
                                </li>


                            ))}
                        </ul>
                    )}
                </div>
            </ScrollArea>

            <Link href="/dashboard/schedule">
                <p className="mt-3 text-xs text-blue-600 hover:underline text-right">
                    View all →
                </p>
            </Link>
        </div>
    )
}
