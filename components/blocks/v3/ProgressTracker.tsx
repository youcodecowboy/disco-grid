"use client"

interface Task {
  name: string
  completed: boolean
  dueDate?: string
}

interface ProgressTrackerV3Props {
  title?: string
  tasks?: Task[]
}

export default function ProgressTrackerV3({ title, tasks = [] }: ProgressTrackerV3Props) {
  if (tasks.length === 0) {
    tasks = [
      { name: "Design mockups", completed: true, dueDate: "Mar 1" },
      { name: "Frontend development", completed: true, dueDate: "Mar 15" },
      { name: "Backend API", completed: false, dueDate: "Mar 20" },
      { name: "Testing & QA", completed: false, dueDate: "Mar 25" },
      { name: "Deployment", completed: false, dueDate: "Mar 30" },
    ]
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progressPercent = (completedCount / totalCount) * 100

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Header with progress */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-slate-900">{title || "Progress"}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {Math.round(progressPercent)}%
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                task.completed ? 'bg-emerald-50' : 'bg-slate-50'
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  task.completed
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-slate-300'
                }`}
              >
                {task.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Task details */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    task.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                  }`}
                >
                  {task.name}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-slate-500 mt-0.5">Due {task.dueDate}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



