import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from './TodoForm';

describe('TodoForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('フォームが正しく表示される', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('優先度')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  });

  test('新しいTodoを追加できる', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByLabelText('タイトル');
    const prioritySelect = screen.getByLabelText('優先度');
    const submitButton = screen.getByRole('button', { name: '追加' });

    await userEvent.type(titleInput, '新しいタスク');
    await userEvent.selectOptions(prioritySelect, 'high');
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('新しいタスク', 'high', 'personal', '');
    expect(titleInput).toHaveValue('');
    expect(prioritySelect).toHaveValue('medium');
  });

  test('空のタイトルでは送信できない', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: '追加' });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
}); 
