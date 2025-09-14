import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'テストタスク',
    completed: false,
    priority: 'high' as const,
    category: 'work' as const,
    dueDate: '2025-09-15'
  };

  const mockHandlers = {
    onToggleComplete: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
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

    expect(mockHandlers.onEdit).toHaveBeenCalledWith('1', '編集されたタスク', 'medium', 'work', '2025-09-15');
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
}); 
