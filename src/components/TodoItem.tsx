import React, { useState } from 'react';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newTitle: string, newPriority: 'high' | 'medium' | 'low') => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed, priority, onToggleComplete, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editPriority, setEditPriority] = useState(priority);

  const handleSave = () => {
    onEdit(id, editTitle, editPriority);
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
