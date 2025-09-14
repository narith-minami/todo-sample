import React, { useState } from 'react';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'work' | 'personal' | 'shopping';
  dueDate?: string;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newTitle: string, newPriority: 'high' | 'medium' | 'low', newCategory: 'work' | 'personal' | 'shopping', newDueDate?: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed, priority, category, dueDate, onToggleComplete, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editPriority, setEditPriority] = useState(priority);
  const [editCategory, setEditCategory] = useState(category);
  const [editDueDate, setEditDueDate] = useState(dueDate || '');

  const handleSave = () => {
    onEdit(id, editTitle, editPriority, editCategory, editDueDate);
    setIsEditing(false);
  };

  return (
    <div className={`flex items-center justify-between p-2 border-b ${completed ? 'bg-gray-200' : 'bg-white'}`}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggleComplete(id)}
        className="mr-2"
      />
      {isEditing ? (
        <div className="flex-grow">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border p-1 mr-2 w-full"
          />
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="border p-1"
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value as 'work' | 'personal' | 'shopping')}
            className="border p-1"
          >
            <option value="work">仕事</option>
            <option value="personal">個人</option>
            <option value="shopping">買い物</option>
          </select>
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="border p-1"
          />
        </div>
      ) : (
        <div className="flex-grow">
          <span
            className={`mr-2 ${completed ? 'line-through text-gray-500' : ''}`}
            data-testid={`todo-item-title-${id}`}
          >
            {title}
          </span>
          <span className={`text-sm font-semibold ${
            priority === 'high' ? 'text-red-600' : priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
          }`}>{priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}</span>
          <span className="text-sm ml-2 p-1 bg-gray-200 rounded">{category}</span>
          {dueDate && <span className="text-sm ml-2">{dueDate}</span>}
        </div>
      )}
      <div className="flex items-center">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-blue-600 mr-2">保存</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-600">キャンセル</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="text-green-600 mr-2">編集</button>
            <button onClick={() => onDelete(id)} className="text-red-600">削除</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
