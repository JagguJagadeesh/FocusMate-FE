import React, { useEffect, useState } from "react";
import { getAllTasks } from "@/services/userService";
import useUserStore from "@/stores/useUserStore";

// Dummy tasks data
const initialTasks = [
  { id: 1, title: "Finish the project module", completed: false },
  { id: 2, title: "Read Redux docs", completed: true },
  { id: 3, title: "Standup meeting at 11 AM", completed: false },
  { id: 4, title: "Code review for team", completed: false },
  { id: 5, title: "Push updates to repo", completed: true },
];

const FILTERS = {
  all: { label: "All", fn: () => true },
  active: { label: "Active", fn: (t) => !t.completed },
  completed: { label: "Completed", fn: (t) => t.completed },
};

function TodoTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const userData = useUserStore();

  const filteredTasks = tasks.filter(
    (task) =>
      FILTERS[filter].fn(task) &&
      task.title.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(()=>{
    async function fetchTasks() {
        const data = await getAllTasks(userData.user.id)
        setTasks(data.tasks)
    }
    fetchTasks()
  },[tasks])

  return (
    <div className="w-full h-9/12 mx-auto my-10 bg-white dark:bg-zinc-900 shadow-lg rounded-xl overflow-hidden">
      <header className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
          Today Tasks
        </h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search task"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring focus:ring-indigo-400 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
            {Object.keys(FILTERS).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`text-sm px-2 py-1 rounded ${
                  filter === key
                    ? "bg-indigo-500 text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {FILTERS[key].label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="p-6 min-h-[120px] text-zinc-700 dark:text-zinc-300">
        {filteredTasks.length === 0 ? (
          <div className="text-center text-zinc-400">No tasks found.</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800"
              >
                <span
                  className={`flex-1 ${
                    task.completed
                      ? "line-through text-zinc-400 dark:text-zinc-500"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {task.title}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    task.completed
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      : "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {task.completed ? "Completed" : "Active"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default TodoTasks;
