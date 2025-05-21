import React, { useState } from 'react';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: '買い物に行く',
      completed: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'レポートを提出する',
      completed: false,
      priority: 'medium'
    },
    {
      id: '3',
      title: '運動する',
      completed: true,
      priority: 'low'
    }
  ]);

  const handleToggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleEdit = (id: string, newTitle: string, newPriority: 'high' | 'medium' | 'low') => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, title: newTitle, priority: newPriority } : todo
    ));
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleAddTodo = (title: string, priority: 'high' | 'medium' | 'low') => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority
    };
    setTodos([...todos, newTodo]);
  };

  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
  };

  const sortedTodos = [...todos].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8">Todo Sample</h1>
                <TodoForm onSubmit={handleAddTodo} />
                <div className="space-y-2">
                  {sortedTodos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      id={todo.id}
                      title={todo.title}
                      completed={todo.completed}
                      priority={todo.priority}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 