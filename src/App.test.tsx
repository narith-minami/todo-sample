import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  test('初期状態で3つのTodoアイテムが表示される', () => {
    render(<App />);
    
    // タイトルが表示されていることを確認
    expect(screen.getByText('Todo Sample')).toBeInTheDocument();
    
    // 3つのTodoアイテムが表示されていることを確認
    expect(screen.getByText('買い物に行く')).toBeInTheDocument();
    expect(screen.getByText('レポートを提出する')).toBeInTheDocument();
    expect(screen.getByText('運動する')).toBeInTheDocument();
  });

  test('Todoアイテムの完了状態を切り替えられる', async () => {
    render(<App />);
    
    // 最初のTodoアイテムのチェックボックスを取得
    const checkboxes = screen.getAllByRole('checkbox');
    const checkbox = checkboxes[0];
    
    // チェックボックスをクリック
    await userEvent.click(checkbox);
    
    // 完了状態が切り替わったことを確認
    expect(checkbox).toBeChecked();
  });

  test('Todoアイテムを編集できる', async () => {
    render(<App />);
    
    // 最初のTodoアイテムの編集ボタンをクリック
    const editButtons = screen.getAllByText('編集');
    await userEvent.click(editButtons[0]);
    
    // タイトル入力フィールドを取得して編集
    const titleInput = screen.getByDisplayValue('買い物に行く');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, '新しい買い物リスト');
    
    // 優先度を変更
    const prioritySelect = screen.getByRole('combobox');
    await userEvent.selectOptions(prioritySelect, 'medium');
    
    // 保存ボタンをクリック
    const saveButton = screen.getByText('保存');
    await userEvent.click(saveButton);
    
    // 変更が反映されていることを確認
    expect(screen.getByText('新しい買い物リスト')).toBeInTheDocument();
  });

  test('Todoアイテムを削除できる', async () => {
    render(<App />);
    
    // 最初のTodoアイテムの削除ボタンをクリック
    const deleteButtons = screen.getAllByText('削除');
    await userEvent.click(deleteButtons[0]);
    
    // アイテムが削除されたことを確認
    expect(screen.queryByText('買い物に行く')).not.toBeInTheDocument();
  });
}); 