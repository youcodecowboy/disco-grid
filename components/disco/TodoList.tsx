'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  workflowId: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Scan incoming materials',
      description: 'Check and scan all materials delivered this morning',
      priority: 'high',
      dueDate: '2024-01-15',
      completed: false,
      workflowId: 'material-inspection'
    },
    {
      id: '2',
      title: 'Update item status',
      description: 'Mark items as ready for shipment',
      priority: 'medium',
      dueDate: '2024-01-15',
      completed: false,
      workflowId: 'item-status-update'
    },
    {
      id: '3',
      title: 'Quality check batch #1234',
      description: 'Perform quality inspection on production batch',
      priority: 'high',
      dueDate: '2024-01-14',
      completed: true,
      workflowId: 'quality-check'
    },
    {
      id: '4',
      title: 'Report equipment issue',
      description: 'Document issue with conveyor belt #3',
      priority: 'low',
      completed: false,
      workflowId: 'equipment-report'
    }
  ]);

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle size={16} />;
      case 'medium': return <Clock size={16} />;
      case 'low': return <Circle size={16} />;
      default: return <Circle size={16} />;
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
        <div className="text-sm text-gray-500">
          {completedCount}/{totalCount} completed
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`p-4 rounded-lg border transition-all ${
              todo.completed
                ? 'bg-gray-50 border-gray-200 opacity-75'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => toggleTodo(todo.id)}
                className="mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {todo.completed ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <Circle size={20} />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className={`font-medium ${
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {todo.title}
                  </h3>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                    {getPriorityIcon(todo.priority)}
                    <span className="capitalize">{todo.priority}</span>
                  </span>
                </div>
                
                <p className={`text-sm ${
                  todo.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
                
                {todo.dueDate && (
                  <div className="mt-2 text-xs text-gray-500">
                    Due: {new Date(todo.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
