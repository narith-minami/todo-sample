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
    
    // 優先度を変更（編集モードのselect要素を取得）
    const prioritySelects = screen.getAllByRole('combobox');
    const editModeSelect = prioritySelects[1]; // 編集モードのselect要素
    await userEvent.selectOptions(editModeSelect, 'medium');
    
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

  test('新しいTodoアイテムを追加できる', async () => {
    render(<App />);
    
    // タイトルを入力
    const titleInput = screen.getByLabelText('タイトル');
    await userEvent.type(titleInput, '新しいタスク');
    
    // 優先度を選択
    const prioritySelect = screen.getByLabelText('優先度');
    await userEvent.selectOptions(prioritySelect, 'high');
    
    // 追加ボタンをクリック
    const addButton = screen.getByRole('button', { name: '追加' });
    await userEvent.click(addButton);
    
    // 新しいアイテムが追加されたことを確認
    expect(screen.getByText('新しいタスク')).toBeInTheDocument();
  });

  // Helper function to get todo titles in rendered order
  const getRenderedTodoTitles = () => {
    // Use screen.queryAllByTestId to find all title spans.
    // The regex matches any data-testid that starts with "todo-item-title-".
    const titleSpans = screen.queryAllByTestId(/^todo-item-title-/i);
    return titleSpans.map(span => span.textContent || '').filter(title => title !== '');
  };


  describe('Todo Priority Sorting', () => {
    test('初期状態でTodoアイテムが優先度順に表示される', () => {
      render(<App />);
      const titles = getRenderedTodoTitles();
      // Default items: '買い物に行く' (high), 'レポートを提出する' (medium), '運動する' (low)
      expect(titles).toEqual([
        '買い物に行く',
        'レポートを提出する',
        '運動する',
      ]);
    });

    test('新しい「低」優先度Todoアイテムを追加するとリストの最後に表示される', async () => {
      render(<App />);
      await userEvent.type(screen.getByLabelText('タイトル'), '新しい低優先度タスク');
      await userEvent.selectOptions(screen.getByLabelText('優先度'), 'low');
      await userEvent.click(screen.getByRole('button', { name: '追加' }));

      const titles = getRenderedTodoTitles();
      expect(titles).toEqual([
        '買い物に行く',          // High
        'レポートを提出する',      // Medium
        '運動する',              // Low
        '新しい低優先度タスク',    // New Low
      ]);
    });

    test('新しい「中」優先度Todoアイテムを追加すると中優先度グループの最後に表示される', async () => {
      render(<App />);
      await userEvent.type(screen.getByLabelText('タイトル'), '新しい中優先度タスク');
      await userEvent.selectOptions(screen.getByLabelText('優先度'), 'medium');
      await userEvent.click(screen.getByRole('button', { name: '追加' }));

      const titles = getRenderedTodoTitles();
      expect(titles).toEqual([
        '買い物に行く',          // High
        'レポートを提出する',      // Medium
        '新しい中優先度タスク',    // New Medium
        '運動する',              // Low
      ]);
    });
  });

  test('Todoアイテムにコメントを追加できる', async () => {
    render(<App />);

    // Find the first TodoItem. We'll target "買い物に行く"
    // The TodoItem component itself doesn't have a specific testID, but its title does.
    // We need to find the comment input related to this specific TodoItem.
    // A robust way is to find the TodoItem container by its title, then query within it.
    // Let's assume the structure: TodoItem contains title, then later comment input.
    // We can find all comment input fields and assume the first one corresponds to the first Todo item.
    // Or better, find the parent element of the todo title "買い物に行く", then search within that parent.

    const todoItemTitle = screen.getByText('買い物に行く');
    // Assuming the TodoItem structure is a div that contains the title and then the comment section.
    // This might be fragile if the structure changes significantly.
    // A more robust way would be to add a test-id to the TodoItem's root div.
    // For now, let's try to find the comment input associated with "買い物に行く".
    // The comment input fields are <input type="text" placeholder="Add a comment..." />
    // And the add buttons are <button>Add</button>

    // Get all comment input fields
    const commentInputs = screen.getAllByPlaceholderText('Add a comment...');
    // Get all "Add" buttons for comments
    const addCommentButtons = screen.getAllByRole('button', { name: 'Add' });

    // Assuming the first TodoItem ("買い物に行く") corresponds to the first comment input and button
    const firstCommentInput = commentInputs[0];
    const firstAddCommentButton = addCommentButtons[0];

    // Type a new comment
    await userEvent.type(firstCommentInput, '新しいコメント');
    // Click the add button
    await userEvent.click(firstAddCommentButton);

    // Verify the new comment is displayed.
    // The comment text "新しいコメント" should be present.
    // We also expect the timestamp to be there, but checking for text is simpler.
    expect(screen.getByText('新しいコメント')).toBeInTheDocument();

    // Optional: Verify that the input is cleared (though this is more of a TodoItem unit test concern)
    expect(firstCommentInput).toHaveValue('');


    // Add another comment to the same item to ensure multiple comments are handled
    await userEvent.type(firstCommentInput, '２番目のコメント');
    await userEvent.click(firstAddCommentButton);
    expect(screen.getByText('２番目のコメント')).toBeInTheDocument();

    // Check if the first comment is still there
    expect(screen.getByText('新しいコメント')).toBeInTheDocument();
  });
}); 