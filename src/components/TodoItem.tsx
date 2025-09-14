import React, { useState } from 'react';
import { Comment } from '../App';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  comments?: Comment[];
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newTitle: string, newPriority: 'high' | 'medium' | 'low') => void;
  onDelete: (id: string) => void;
  onAddComment: (todoId: string, commentText: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed, priority, comments, onToggleComplete, onEdit, onDelete, onAddComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editPriority, setEditPriority] = useState(priority);
  const [newCommentText, setNewCommentText] = useState('');

  const handleSave = () => {
    onEdit(id, editTitle, editPriority);
    setIsEditing(false);
  };

  const handleAddCommentClick = () => {
    if (newCommentText.trim() === '') return; // Don't add empty comments
    onAddComment(id, newCommentText);
    setNewCommentText('');
  };

  return (
    <div className={`p-2 border-b ${completed ? 'bg-gray-200' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
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
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700">Comments:</h4>
        {comments && comments.length > 0 ? (
          <div className="mt-2 p-2 bg-gray-50 rounded space-y-2">
            {comments.map(comment => (
              <div key={comment.id} className="text-xs text-gray-600">
                <p className="font-medium">{comment.text}</p>
                <p className="text-gray-400 text-xs">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 mt-1">No comments yet.</p>
        )}
        <div className="mt-2 flex">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="border p-1 flex-grow text-sm mr-2 rounded"
          />
          <button
            onClick={handleAddCommentClick}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
