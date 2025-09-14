import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'テストタスク',
    completed: false,
    priority: 'high' as const
  };

  const mockHandlers = {
    onToggleComplete: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onAddComment: jest.fn(), // Added for comment functionality
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Todoアイテムが正しく表示される', () => {
    render(
      <TodoItem
        {...mockTodo}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    expect(screen.getByText('高')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('完了状態の切り替えが機能する', async () => {
    render(
      <TodoItem
        {...mockTodo}
        {...mockHandlers}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(mockHandlers.onToggleComplete).toHaveBeenCalledWith('1');
  });

  test('編集モードの切り替えが機能する', async () => {
    render(
      <TodoItem
        {...mockTodo}
        {...mockHandlers}
      />
    );

    // 編集ボタンをクリック
    const editButton = screen.getByText('編集');
    await userEvent.click(editButton);

    // 編集モードの要素が表示されることを確認
    const titleInput = screen.getByDisplayValue('テストタスク');
    const prioritySelect = screen.getByRole('combobox');
    const saveButton = screen.getByText('保存');
    const cancelButton = screen.getByText('キャンセル');

    expect(titleInput).toBeInTheDocument();
    expect(prioritySelect).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  test('編集の保存が機能する', async () => {
    render(
      <TodoItem
        {...mockTodo}
        {...mockHandlers}
      />
    );

    // 編集モードに切り替え
    const editButton = screen.getByText('編集');
    await userEvent.click(editButton);

    // タイトルを編集
    const titleInput = screen.getByDisplayValue('テストタスク');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, '編集されたタスク');

    // 優先度を変更
    const prioritySelect = screen.getByRole('combobox');
    await userEvent.selectOptions(prioritySelect, 'medium');

    // 保存ボタンをクリック
    const saveButton = screen.getByText('保存');
    await userEvent.click(saveButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith('1', '編集されたタスク', 'medium');
  });

  test('削除が機能する', async () => {
    render(
      <TodoItem
        {...mockTodo}
        {...mockHandlers}
      />
    );

    const deleteButton = screen.getByText('削除');
    await userEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  describe('Comment Functionality', () => {
    const mockComments = [
      { id: 'c1', text: 'First comment', createdAt: new Date(2023, 0, 1, 10, 0, 0).toISOString() },
      { id: 'c2', text: 'Second comment', createdAt: new Date(2023, 0, 2, 12, 30, 0).toISOString() },
    ];

    test('displays comments correctly when comments are provided', () => {
      render(
        <TodoItem
          {...mockTodo}
          {...mockHandlers}
          comments={mockComments}
        />
      );

      expect(screen.getByText('First comment')).toBeInTheDocument();
      expect(screen.getByText(new Date(mockComments[0].createdAt).toLocaleString())).toBeInTheDocument();
      expect(screen.getByText('Second comment')).toBeInTheDocument();
      expect(screen.getByText(new Date(mockComments[1].createdAt).toLocaleString())).toBeInTheDocument();
      expect(screen.queryByText('No comments yet.')).not.toBeInTheDocument();
    });

    test('displays "No comments yet." when comments array is empty', () => {
      render(
        <TodoItem
          {...mockTodo}
          {...mockHandlers}
          comments={[]}
        />
      );
      expect(screen.getByText('No comments yet.')).toBeInTheDocument();
    });

    test('displays "No comments yet." when comments prop is undefined', () => {
      render(
        <TodoItem
          {...mockTodo}
          {...mockHandlers}
          // comments prop is intentionally omitted
        />
      );
      expect(screen.getByText('No comments yet.')).toBeInTheDocument();
    });

    test('allows adding a new comment and clears input', async () => {
      render(
        <TodoItem
          {...mockTodo}
          {...mockHandlers}
        />
      );

      const commentInput = screen.getByPlaceholderText('Add a comment...');
      const addButton = screen.getByRole('button', { name: 'Add' });

      // Type a comment and add it
      await userEvent.type(commentInput, 'This is a test comment');
      await userEvent.click(addButton);

      expect(mockHandlers.onAddComment).toHaveBeenCalledWith(mockTodo.id, 'This is a test comment');
      expect(commentInput).toHaveValue(''); // Input should be cleared
    });

    test('does not add a comment if input is empty', async () => {
      render(
        <TodoItem
          {...mockTodo}
          {...mockHandlers}
        />
      );

      const addButton = screen.getByRole('button', { name: 'Add' });
      await userEvent.click(addButton); // Click with empty input

      expect(mockHandlers.onAddComment).not.toHaveBeenCalled();
    });
    
    test('does not add a comment if input is only whitespace', async () => {
      render(
        <TodoItem
          {...mockTodo}
          {...mockHandlers}
        />
      );

      const commentInput = screen.getByPlaceholderText('Add a comment...');
      const addButton = screen.getByRole('button', { name: 'Add' });
      
      await userEvent.type(commentInput, '   '); // Type only spaces
      await userEvent.click(addButton);

      expect(mockHandlers.onAddComment).not.toHaveBeenCalled();
      expect(commentInput).toHaveValue('   '); // Input should retain whitespace for user to see
    });
  });
}); 