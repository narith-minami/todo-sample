import React, { useState } from 'react';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'work' | 'personal' | 'shopping';
  dueDate?: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: '買い物に行く',
      completed: false,
      priority: 'high',
      category: 'shopping',
      dueDate: '2025-09-15'
    },
    {
      id: '2',
      title: 'レポートを提出する',
      completed: false,
      priority: 'medium',
      category: 'work',
      dueDate: '2025-09-16'
    },
    {
      id: '3',
      title: '運動する',
      completed: true,
      priority: 'low',
      category: 'personal',
      dueDate: '2025-09-15'
    }
  ]);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'work' | 'personal' | 'shopping'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'default'>('priority');

  const handleToggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleEdit = (id: string, newTitle: string, newPriority: 'high' | 'medium' | 'low', newCategory: 'work' | 'personal' | 'shopping', newDueDate?: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, title: newTitle, priority: newPriority, category: newCategory, dueDate: newDueDate } : todo
    ));
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleAddTodo = (title: string, priority: 'high' | 'medium' | 'low', category: 'work' | 'personal' | 'shopping', dueDate?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
      category,
      dueDate
    };
    setTodos([...todos, newTodo]);
  };

  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
  };

  const todosForRender = todos
    .filter(todo => showCompleted || !todo.completed)
    .filter(todo => filterPriority === 'all' || todo.priority === filterPriority)
    .filter(todo => filterCategory === 'all' || todo.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0; // default order
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
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={e => setShowCompleted(e.target.checked)}
                    className="mr-2"
                  />
                  <label>Show Completed</label>
                </div>
                <div className="flex space-x-4 mb-4">
                  <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as any)} className="p-2 border rounded">
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as any)} className="p-2 border rounded">
                    <option value="all">All Categories</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                  </select>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="p-2 border rounded">
                    <option value="default">Default</option>
                    <option value="priority">Sort by Priority</option>
                    <option value="dueDate">Sort by Due Date</option>
                  </select>
                </div>
                <div className="space-y-2">
                  {todosForRender.map(todo => (
                    <TodoItem
                      key={todo.id}
                      id={todo.id}
                      title={todo.title}
                      completed={todo.completed}
                      priority={todo.priority}
                      category={todo.category}
                      dueDate={todo.dueDate}
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
